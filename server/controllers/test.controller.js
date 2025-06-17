import Test from "../models/test.model.js";
import Question from "../models/question.model.js";
import mongoose from "mongoose";

export const getTests = async (req, res) => {
  try {
    const tests = await Test.aggregate([
      { $match: { creator: req.user._id } },
      { $sort: { createdAt: -1 } },

      // Lookup related questions
      {
        $lookup: {
          from: "questions", // Collection name for questions
          localField: "_id", // Test._id
          foreignField: "test", // Question.test
          as: "questions",
        },
      },

      // Lookup related test attempts
      {
        $lookup: {
          from: "testattempts", // Collection name for test attempts
          localField: "_id", // Test._id
          foreignField: "test", // TestAttempt.test
          as: "attempts",
        },
      },

      // Add count of questions
      {
        $addFields: {
          questionsCount: { $size: "$questions" },
        },
      },

      // Exclude full questions array (but keep attempts if needed)
      {
        $project: {
          questions: 0, // omit questions array
          // You can also exclude attempts here if you want only the count
          // attempts: 0
        },
      },
    ]);

    res.json(tests);
  } catch (error) {
    console.error("Get tests error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Получение теста по ID
export const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate({
      path: "questions",
      // select: '-correctAnswer' // Exclude this field
    });

    if (!test) {
      return res.status(404).json({ message: "Тест не найден" });
    }

    res.json(test);
  } catch (error) {
    console.error("Get test by ID error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Создание нового теста
export const createTest = async (req, res) => {
  try {
    const {
      title,
      description,
      timeLimit,
      passingScore,
      manualCheck,
      failureMessage,
      successMessage,
    } = req.body;

    const test = await Test.create({
      title,
      description,
      creator: req.user._id,
      timeLimit: timeLimit || 0,
      passingScore: passingScore || 60,
      manualCheck: !manualCheck,
      failureMessage,
      successMessage,
    });

    res.status(201).json(test);
  } catch (error) {
    console.error("Create test error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const updateTest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      title,
      description,
      timeLimit,
      passingScore,
      manualCheck,
      failureMessage,
      successMessage,
      isPublished,
      randomOrder,
      questions = [],
    } = req.body;

    const testId = req.params.id;
    const userId = req.user._id.toString();

    // 1. Find the test and verify ownership
    const test = await Test.findById(testId).session(session).lean();
    if (!test) return res.status(404).json({ message: "Тест не найден" });
    if (test.creator.toString() !== userId)
      return res.status(403).json({ message: "Доступ запрещен" });

    // 2. Update the test
    await Test.updateOne(
      { _id: testId },
      {
        $set: {
          title: title || test.title,
          description: description || test.description,
          timeLimit: timeLimit !== undefined ? timeLimit : test.timeLimit,
          passingScore: passingScore || test.passingScore,
          isPublished:
            isPublished !== undefined ? isPublished : test.isPublished,
          randomOrder:
            randomOrder !== undefined ? randomOrder : test.randomOrder,
          updatedAt: Date.now(),
          manualCheck: !manualCheck,
          failureMessage,
          successMessage,
        },
      },
      { session }
    );

    // 3. Prepare bulk operations for questions
    const incomingIds = [];
    const bulkOps = [];

    questions.forEach((q, index) => {
      if (q._id) {
        incomingIds.push(q._id);
        bulkOps.push({
          updateOne: {
            filter: { _id: q._id, test: testId },
            update: {
              $set: {
                questionText: q.questionText,
                questionType: q.questionType,
                options: q.questionType === "textInput" ? [] : q.options || [],
                correctAnswer: q.correctAnswer,
                points: q.points || 1,
                orderIndex: index,
                explanation: q.explanation,
              },
            },
          },
        });
      } else {
        const newId = new mongoose.Types.ObjectId();
        incomingIds.push(newId);
        bulkOps.push({
          insertOne: {
            document: {
              _id: newId,
              test: testId,
              questionText: q.questionText,
              questionType: q.questionType,
              options: q.questionType === "textInput" ? [] : q.options || [],
              correctAnswer: q.correctAnswer,
              points: q.points || 1,
              orderIndex: index,
              explanation: q.explanation,
            },
          },
        });
      }
    });

    if (bulkOps.length) {
      await Question.bulkWrite(bulkOps, { session });
    }

    // 4. Delete removed questions
    await Question.deleteMany({
      test: testId,
      _id: { $nin: incomingIds },
    }).session(session);

    // 5. Commit transaction
    await session.commitTransaction();
    session.endSession();

    // 6. Respond
    const updatedQuestions = await Question.find({ test: testId }).sort(
      "orderIndex"
    );
    res.json({
      message: "Тест и вопросы обновлены",
      questions: updatedQuestions,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Ошибка при обновлении теста:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Удаление теста
export const deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ message: "Тест не найден" });
    }

    // Проверка, является ли пользователь создателем теста
    if (test.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Доступ запрещен" });
    }

    // Удаление всех вопросов, связанных с тестом
    await Question.deleteMany({ test: test._id });

    // Удаление теста
    await test.deleteOne();

    res.json({ message: "Тест удален" });
  } catch (error) {
    console.error("Delete test error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Публикация теста
export const publishTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ message: "Тест не найден" });
    }

    // Проверка, является ли пользователь создателем теста
    if (test.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Доступ запрещен" });
    }

    // Проверка, есть ли вопросы в тесте
    const questionsCount = await Question.countDocuments({ test: test._id });

    if (questionsCount === 0) {
      return res
        .status(400)
        .json({ message: "Нельзя опубликовать тест без вопросов" });
    }

    // Публикация теста
    test.isPublished = true;
    test.updatedAt = Date.now();

    const updatedTest = await test.save();

    res.json(updatedTest);
  } catch (error) {
    console.error("Publish test error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Получение публичного теста по ID (без авторизации)
export const getPublicTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ message: "Тест не найден" });
    }

    // Проверка, опубликован ли тест
    if (!test.isPublished) {
      return res
        .status(404)
        .json({ message: "Тест не найден или не опубликован" });
    }

    // Возвращаем только основную информацию о тесте без вопросов
    const publicTest = {
      _id: test._id,
      title: test.title,
      description: test.description,
      timeLimit: test.timeLimit,
      randomOrder: test.randomOrder,
    };

    res.json(publicTest);
  } catch (error) {
    console.error("Get public test by ID error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
