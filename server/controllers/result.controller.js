import TestAttempt from "../models/testAttempt.model.js";
import Test from "../models/test.model.js";
import Question from "../models/question.model.js";
import { isMatchingCorrect } from "../util.js";
import transporter from "../mailer.js";

// Создание новой попытки прохождения теста
export const startTestAttempt = async (req, res) => {
  try {
    const { testId, guestInfo } = req.body;

    // Проверка существования теста
    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: "Тест не найден" });
    }

    // Создание новой попытки
    const testAttempt = new TestAttempt({
      test: testId,
      user: req.user ? req.user._id : null,
      guestInfo: !req.user ? guestInfo : null,
      startTime: Date.now(),
      status: "inProgress",
    });

    const savedAttempt = await testAttempt.save();

    res.status(201).json({
      _id: savedAttempt._id,
      startTime: savedAttempt.startTime,
      timeLimit: test.timeLimit,
    });
  } catch (error) {
    console.error("Start test attempt error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Завершение попытки прохождения теста
export const submitTestAttempt = async (req, res) => {
  try {
    const { answers } = req.body;

    // Поиск попытки
    const attempt = await TestAttempt.findById(req.params.id);

    if (!attempt) {
      return res.status(404).json({ message: "Попытка не найдена" });
    }

    // Проверка, не завершена ли уже попытка
    if (attempt.status === "completed") {
      return res.status(400).json({ message: "Попытка уже завершена" });
    }

    // Получение теста и вопросов
    const test = await Test.findById(attempt.test);
    const questions = await Question.find({ test: attempt.test });

    // Подготовка мапы вопросов для быстрого доступа
    const questionsMap = {};
    questions.forEach((q) => {
      questionsMap[q._id.toString()] = q;
    });

    // Проверка ответов и подсчет баллов
    let totalScore = 0;
    let totalPossibleScore = 0;
    let needsManualCheck = test.manualCheck;

    const processedAnswers = answers
      .map((answer) => {
        const question = questionsMap[answer.question];

        if (!question) {
          return null; // Пропускаем неизвестные вопросы
        }

        totalPossibleScore += question.points;

        // Объект для результата ответа
        const processedAnswer = {
          question: question._id,
          selectedOptions: answer.selectedOptions || [],
          textAnswer: answer.textAnswer || "",
          isCorrect: false,
          points: 0,
          needsManualCheck: false,
        };

        // Проверка правильности ответа в зависимости от типа вопроса
        switch (question.questionType) {
          case "singleChoice":
            if (answer.selectedOptions && answer.selectedOptions.length === 1) {
              // Найти правильный вариант
              const correctOption = question.options.find(
                (opt) => opt.text === question.correctAnswer
              );
              if (
                correctOption &&
                answer.selectedOptions[0] === correctOption.id
              ) {
                processedAnswer.isCorrect = true;
                processedAnswer.points = question.points;
                totalScore += question.points;
              }
            }
            break;

          case "multipleChoice":
            if (answer.selectedOptions && answer.selectedOptions.length > 0) {
              // Получение всех правильных вариантов
              const correctOptions = question.options
                .filter((opt) => question.correctAnswer.includes(opt.text))
                .map((opt) => opt.id);

              // Проверка, что выбраны все правильные и нет неправильных
              const allCorrectSelected = correctOptions.every((id) =>
                answer.selectedOptions.includes(id)
              );

              const noIncorrectSelected = answer.selectedOptions.every((id) =>
                correctOptions.includes(id)
              );

              if (allCorrectSelected && noIncorrectSelected) {
                processedAnswer.isCorrect = true;
                processedAnswer.points = question.points;
                totalScore += question.points;
              }
            }
            break;

          case "textInput":
          case "numberInput":
            // Для текстовых вопросов может потребоваться ручная проверка
            if (question.correctAnswer && answer.textAnswer) {
              // Простая проверка на точное совпадение
              if (
                question.correctAnswer.includes(
                  answer.textAnswer.trim().toLowerCase()
                )
              ) {
                processedAnswer.isCorrect = true;
                processedAnswer.points = question.points;
                totalScore += question.points;
              } else {
                // Отметить для ручной проверки
                processedAnswer.needsManualCheck = true;
                // needsManualCheck = true;
              }
            }
            break;

          case "matching":
            if (answer.selectedOptions && answer.selectedOptions.length > 0) {
              const isCorrect = isMatchingCorrect(
                question.correctAnswer,
                answer.selectedOptions[0]
              );

              if (isCorrect) {
                processedAnswer.isCorrect = isCorrect;
                processedAnswer.points = question.points;
                totalScore += question.points;
              } else {
                // Отметить для ручной проверки
                processedAnswer.needsManualCheck = true;
                // needsManualCheck = true;
              }
            }

            break;

          case "ordering":
            if (question.correctAnswer && answer.textAnswer) {
              if (question.correctAnswer === answer.textAnswer) {
                processedAnswer.isCorrect = true;
                processedAnswer.points = question.points;
                totalScore += question.points;
              } else {
                processedAnswer.needsManualCheck = true;
                // needsManualCheck = true;
              }
            }
            break;

          // Другие типы вопросов можно добавить по мере необходимости

          default:
            // Для сложных типов вопросов может потребоваться ручная проверка
            processedAnswer.needsManualCheck = true;
            // needsManualCheck = true;
        }

        return processedAnswer;
      })
      .filter(Boolean); // Удаляем null-значения

    // Вычисление процента правильных ответов
    const percentage =
      totalPossibleScore > 0
        ? Math.round((totalScore / totalPossibleScore) * 100)
        : 0;

    // Определение, пройден ли тест
    const isPassed = percentage >= test.passingScore;

    // Обновление попытки
    attempt.answers = processedAnswers;
    attempt.endTime = Date.now();
    attempt.totalScore = totalScore;
    attempt.percentage = percentage;
    attempt.isPassed = isPassed;
    attempt.status = needsManualCheck ? "needsReview" : "completed";

    if (!needsManualCheck) {
      // attempt.guestInfo.email
      const mailOptions = {
        from: 'amnyamfitnessstore@gmail.com',
        to: attempt.guestInfo.email, // You can use comma-separated list for multiple users
        subject: 'Результаты теста: ' + test.title,
        text: 'This is a plain text message',
        html: `<p>${isPassed ? test.successMessage : failureMessage}</p>`,
        // successMessage failureMessage
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }

    const savedAttempt = await attempt.save();

    res.json({
      _id: savedAttempt._id,
      totalScore,
      percentage,
      isPassed,
      status: savedAttempt.status,
    });
  } catch (error) {
    console.error("Submit test attempt error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Получение результатов попытки
export const getAttemptResult = async (req, res) => {
  try {
    const attempt = await TestAttempt.findById(req.params.id)
      .populate("test", "title description passingScore")
      .populate("user", "name email");

    if (!attempt) {
      return res.status(404).json({ message: "Результат не найден" });
    }

    // Проверка доступа к результату
    if (req.user) {
      const test = await Test.findById(attempt.test._id);

      // Пользователь может просматривать результат, если:
      // 1. Он является создателем теста
      // 2. Это его собственная попытка
      if (
        test.creator.toString() !== req.user._id.toString() &&
        (!attempt.user ||
          attempt.user._id.toString() !== req.user._id.toString())
      ) {
        return res.status(403).json({ message: "Доступ запрещен" });
      }
    } else {
      // Гость может просматривать только свой результат по специальной ссылке
      // Здесь можно добавить дополнительную проверку, например по токену результата
    }

    // Получение вопросов для отображения детальных результатов
    const questions = await Question.find({ test: attempt.test._id });

    // Подготовка объекта с детальными результатами
    const detailedResult = {
      _id: attempt._id,
      test: attempt.test,
      user: attempt.user || attempt.guestInfo,
      startTime: attempt.startTime,
      endTime: attempt.endTime,
      totalScore: attempt.totalScore,
      percentage: attempt.percentage,
      isPassed: attempt.isPassed,
      status: attempt.status,
      answers: attempt.answers.map((answer) => {
        const question = questions.find(
          (q) => q._id.toString() === answer.question.toString()
        );

        return {
          question: {
            _id: question._id,
            questionText: question.questionText,
            questionType: question.questionType,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            points: question.points,
          },
          selectedOptions: answer.selectedOptions,
          textAnswer: answer.textAnswer,
          isCorrect: answer.isCorrect,
          points: answer.points,
          needsManualCheck: answer.needsManualCheck,
        };
      }),
    };

    res.json(detailedResult);
  } catch (error) {
    console.error("Get attempt result error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Получение всех результатов для теста
export const getTestResults = async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);

    if (!test) {
      return res.status(404).json({ message: "Тест не найден" });
    }

    // Проверка, является ли пользователь создателем теста
    if (test.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Доступ запрещен" });
    }

    const results = await TestAttempt.find({ test: req.params.testId })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .select("-answers"); // Исключаем детальные ответы для списка

    res.json(results);
  } catch (error) {
    console.error("Get test results error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Ручная проверка результата
export const reviewAttempt = async (req, res) => {
  try {
    const { answers } = req.body;

    const attempt = await TestAttempt.findById(req.params.id);

    if (!attempt) {
      return res.status(404).json({ message: "Результат не найден" });
    }

    // Проверка, является ли пользователь создателем теста
    const test = await Test.findById(attempt.test);

    if (test.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Доступ запрещен" });
    }

    // Обновление оценок для ответов, требующих ручной проверки
    let totalScore = 0;
    let totalPossibleScore = 0;

    // Получаем все вопросы теста для вычисления максимально возможного балла
    const questions = await Question.find({ test: attempt.test });
    questions.forEach((q) => {
      totalPossibleScore += q.points;
    });

    // Обновляем ответы и подсчитываем общий балл
    const updatedAnswers = attempt.answers.map((answer) => {
      // Поиск обновленной оценки для ответа
      const updatedAnswer = answers.find(
        (a) => a.question.toString() === answer.question.toString()
      );
      // console.log(answer)
      // if (updatedAnswer && answer.needsManualCheck) {
      // }
      answer.isCorrect = updatedAnswer.isCorrect;
      answer.points = updatedAnswer.points;
      answer.needsManualCheck = false;

      totalScore += answer.points;
      return answer;
    });

    // Вычисление процента и определение результата
    const rawPercentage =
      totalPossibleScore > 0
        ? Math.round((totalScore / totalPossibleScore) * 100)
        : 0;

    const percentage = Math.min(rawPercentage, 100);

    const isPassed = percentage >= test.passingScore;

    // Обновление попытки
    attempt.answers = updatedAnswers;
    attempt.totalScore = totalScore;
    attempt.percentage = percentage;
    attempt.isPassed = isPassed;
    attempt.status = "reviewed";
    attempt.reviewedBy = req.user._id;

    const mailOptions = {
      from: 'amnyamfitnessstore@gmail.com',
      to: attempt.guestInfo.email, // You can use comma-separated list for multiple users
      subject: 'Результаты теста: ' + test.title,
      text: 'This is a plain text message',
      html: `<p>${isPassed ? test.successMessage : failureMessage}</p>`,
      // successMessage failureMessage
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    const savedAttempt = await attempt.save();

    res.json({
      _id: savedAttempt._id,
      totalScore,
      percentage,
      isPassed,
      status: savedAttempt.status,
    });
  } catch (error) {
    console.error("Review attempt error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
