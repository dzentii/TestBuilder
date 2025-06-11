"use client";

import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import Card1 from "../components/Card1";
import Card2 from "../components/Card2";
import Card3 from "../components/Card3";
import Card4 from "../components/Card4";
import Card5 from "../components/Card5";
import createTest, { createQuestionsToTest, getTest, updateTest } from "../services/test.service";

import mapCardTypeToQuestionType, {
  answerGenerator,
  mapQuestionTypeToCardType,
  minutesToTimeString,
  timeStringToMinutes,
} from "../lib/util";

import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const EditTest = () => {
    const [editTest, setEditTest] = useState();
  const [questions, setQuestions] = useState([{ id: 0, type: "Card1" }]);
  const [nextId, setNextId] = useState(1);
  const [showCardSelection, setShowCardSelection] = useState(false);
  const [testTitle, setTestTitle] = useState("");
  const [testInstructions, setTestInstructions] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setFailureMessage] = useState("");
  const [manualCheck, setManualCheck] = useState(false);
  const [passingScore, setPassingScore] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [errors, setErrors] = useState({
    testTitle: "",
    questions: {},
  });
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()

  // Refs for each card to get data
  const cardRefs = useRef({});

  // Function to add a new question card of the selected type
  const addQuestionCard = (cardType) => {
    const newQuestion = {
      id: nextId,
      type: cardType,
    };

    setQuestions([...questions, newQuestion]);
    setNextId(nextId + 1);
    setShowCardSelection(false);
  };


async function getTestData() {
  const getDataEditTest = await getTest(id);
  
  setEditTest(getDataEditTest)
  const updatedQuestions = getDataEditTest.questions.map((q, index) => ({
    id: index,
    type: mapQuestionTypeToCardType(q.questionType),
    editTask:{ ...q, settings:getDataEditTest.settings }
  }));

  setQuestions(updatedQuestions);
  setEditTest(getDataEditTest);
}

  useEffect(()=>{
    getTestData()
  }, [id]);
  useEffect(()=>{
    if(editTest){
    setSuccessMessage(editTest.successMessage || "");
    setFailureMessage(editTest.failureMessage || "");
    setTestInstructions(editTest.description);
    setTestTitle(editTest.title);
    setPassingScore(editTest.passingScore);
    console.log(editTest)
    setManualCheck(editTest.manualCheck);
    setTimeLimit(minutesToTimeString(editTest.timeLimit))

    //const time = formatTime(editTest.timeLimit)
  //    console.log(time)
}  
}, [editTest]);


  // Function to remove a question
  const removeQuestion = (id) => {
    setQuestions(questions.filter((question) => question.id !== id));

    // Remove ref for deleted card
    const updatedRefs = { ...cardRefs.current };
    delete updatedRefs[id];
    cardRefs.current = updatedRefs;
  };


  // Format time input
  const formatTime = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 6);
    const parts = [
      digits.slice(0, 2),
      digits.slice(2, 4),
      digits.slice(4, 6),
    ].filter(Boolean);
    return parts.join(":");
  };

  // Handle time input change
  const handleTimeChange = (e) => {
    const formatted = formatTime(e.target.value);
    console.log(formatted)
    setTimeLimit(formatted);
  };

  // Function to handle saving the test
  const handleSaveTest = () => {
    // Reset errors
    setErrors({ testTitle: "", questions: {} });

    // Validate test title
    let hasErrors = false;
    const newErrors = { testTitle: "", questions: {} };

    if (!testTitle.trim()) {
      newErrors.testTitle = "Пожалуйста, введите название теста";
      hasErrors = true;
    }

    // Validate questions
    questions.forEach((question) => {
      const questionErrors = [];
      const data = cardRefs.current[question.id]?.getData();
      
      if (!data) return;

      if (!data.questionText.trim()) {
        questionErrors.push("Пожалуйста, введите текст вопроса");
      }

      // Validate based on question type
      if (data.type === "Card1" || data.type === "Card2") {
        // Check if any option is empty
        const emptyOptions = data.options.some((opt) => !opt.text.trim());
        if (emptyOptions) {
          questionErrors.push("Пожалуйста, заполните все варианты ответов");
        }

        // For Card2, check if at least one option is selected
        if (
          data.type === "Card2" &&
          !data.options.some((opt) => opt.selected)
        ) {
          questionErrors.push("Выберите хотя бы один правильный ответ");
        }
      } else if (data.type === "Card3") {
        // Check if any answer is empty
       
        const emptyAnswers = data.options.some((opt) => !opt.text.trim());
        if (emptyAnswers) {
          questionErrors.push("Пожалуйста, заполните все правильные ответы");
        }
      } else if (data.type === "Card4") {
        // Check if any pair is empty
        const emptyPairs = data.pairs.some(
          (pair) => !pair.left.trim() || !pair.right.trim()
        );
        if (emptyPairs) {
          questionErrors.push("Пожалуйста, заполните все пары");
        }
      } else if (data.type === "Card5") {
        // Check if any step is empty
        const emptySteps = data.steps.some((step) => !step.text.trim());
        if (emptySteps) {
          questionErrors.push("Пожалуйста, заполните все шаги");
        }
      }

      if (questionErrors.length > 0) {
        newErrors.questions[question.id] = questionErrors;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      // Scroll to the first error
      if (newErrors.testTitle) {
        document.querySelector('input[placeholder="Название теста"]').focus();
      } else {
        const firstErrorId = Object.keys(newErrors.questions)[0];
        const firstErrorElement = document.getElementById(
          `question-${firstErrorId}`
        );
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
      return;
    }   
      const questionsData = questions
          .map((question, index) => {
            if (!cardRefs.current[question.id]) return null;
            const data = cardRefs.current[question.id].getData();
            return {
              id:index,
              questionText: data.questionText,
              questionType: mapCardTypeToQuestionType(data.type), // we'll define this below
              options: data.options || data.pairs || data.steps || [],
              correctAnswer: answerGenerator(
                data.type,
                data.options || data.options || data.pairs || data.steps
              ),
              points: data.points || 1,
              explanation: data.explanation || "",
            };
          })
          .filter(Boolean);
const testData = {
      title: testTitle,
      instructions: testInstructions,
      successMessage,
      failureMessage,
      manualCheck,
      passingScore: passingScore ? Number.parseInt(passingScore) : 0,
      timeLimit: timeLimit
        ? timeStringToMinutes(timeLimit)
        : 0,
      questions: questionsData
    };
          // console.log(testData)
          setLoading(true)
          updateTest(id, testData).then((dart) => {
            setLoading(false)
            if(dart.status === 200) {
              navigate("/test-management")
            }
          })
  };

  // Toggle card selection modal
  const toggleCardSelection = () => {
    setShowCardSelection(!showCardSelection);
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="container max-w-[1152px] mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Left Column - Test Content */}
          <div className="w-2/3 bg-[#f7faff] rounded-3xl p-8">
            <div className="relative mb-6">
              <input
                type="text"
                value={testTitle}
                onChange={(e) => {
                  setTestTitle(e.target.value);
                  if (errors.testTitle) setErrors({ ...errors, testTitle: "" });
                }}
                placeholder="Название теста"
                className={`w-full text-center text-xl font-medium bg-transparent border-none outline-none placeholder:text-[22px] placeholder:text-[#4A4F55] placeholder:font-semibold ${
                  errors.testTitle ? "border-2 border-[#F68D88] rounded-xl" : ""
                }`}
              />
              {errors.testTitle && (
                <p className="text-[#F68D88] text-sm text-center mt-1">
                  {errors.testTitle}
                </p>
              )}
            </div>

            <input
              type="text"
              value={testInstructions}
              onChange={(e) => setTestInstructions(e.target.value)}
              placeholder="Добавьте инструкцию, сроки и другую полезную информацию"
              className="w-full text-center placeholder:text-[16px] placeholder:font-medium placeholder:text-[#4A4F55] mb-8 h-[52px] bg-white rounded-full py-3 px-4 border-none outline-none"
            />

            {/* Question Cards */}
            {questions.map((question) => {
              const { id, type } = question;
              // Set up props for each card typ e (without the key)
              const cardProps = {
                ref: (el) => {
                  if (el) {
                    cardRefs.current[id] = el;
                  }
                },
                handleDelete: () => removeQuestion(id),
                errors: errors.questions[id] || [],
                id: `question-${id}`,
                manual: manualCheck
              };
              // Render the appropriate card component with key passed directly
              switch (type) {
                case "Card1":
                  return <Card1 key={id} {...cardProps} editTask={question.editTask}/>;
                case "Card2":
                  return <Card2 key={id} {...cardProps} editTask={question.editTask}/>;
                case "Card3":
                  return <Card3 key={id} {...cardProps} editTask={question.editTask}/>;
                case "Card4":
                  return <Card4 key={id} {...cardProps} editTask={question.editTask}/>;
                case "Card5":
                  return <Card5 key={id} {...cardProps} editTask={question.editTask}/>;
                default:
                  return null;
              }
            })}

            {/* Success/Failure Messages */}
            <div className="space-y-3.5">
              <input
                type="text"
                value={successMessage}
                onChange={(e) => setSuccessMessage(e.target.value)}
                placeholder="Добавить сообщение об успешном прохождении теста"
                className="w-full shadow text-center placeholder:text-[16px] placeholder:font-medium placeholder:text-[#4A4F55] h-[52px] bg-white rounded-full py-3 px-4 border-none outline-none"
              />
              <input
                type="text"
                value={failureMessage}
                onChange={(e) => setFailureMessage(e.target.value)}
                placeholder="Добавить сообщение о не успешном прохождении теста"
                className="w-full shadow text-center placeholder:text-[16px] placeholder:font-medium placeholder:text-[#4A4F55] mb-6 h-[52px] bg-white rounded-full py-3 px-4 border-none outline-none"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveTest}
              disabled={loading}
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed bg-[#F68D88] cursor-pointer h-[52px] text-white rounded-full text-[18px] py-3 font-bold"
            >
              Сохранить изменения
            </button>
          </div>

          {/* Right Column - Test Settings */}
          <div className="w-1/3 px-[44px] rounded-2xl bg-[#f7faff]">
            {/* Manual Check Toggle */}
            <div className="rounded-3xl p-6">
              <div className="flex items-center gap-x-2 justify-between mb-4">
                <div className="relative inline-block min-w-15 min-h-8 rounded-full">
                  <input
                    type="checkbox"
                    className="opacity-0 w-0 h-0"
                    checked={manualCheck}
                    onChange={() => setManualCheck(!manualCheck)}
                    id="toggle"
                  />
                  <label
                    htmlFor="toggle"
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${
                      manualCheck ? "bg-[#95B1EE]" : "bg-[#AAAAAA]"
                    }`}
                  >
                    <span
                      className={`absolute h-6 w-6 left-1 bottom-1 bg-white rounded-full transition-all duration-300 ${
                        manualCheck ? "translate-x-7" : "translate-x-0"
                      }`}
                    ></span>
                  </label>
                </div>
                <span className="text-[#4A4F55] text-[17px] font-semibold leading-5">
                  {manualCheck ? "Автоматическая" : "Ручная"} проверка тестов
                </span>
              </div>
            </div>

            {/* Passing Score */}
            <div className="rounded-3xl mb-10">
              <div>
                <p className="text-[#3D568F] text-center font-semibold text-[17px] mb-2">
                  Добавить проходной балл
                </p>
                <input
                  type="number"
                  value={passingScore}
                  onChange={(e) => setPassingScore(e.target.value)}
                  placeholder="0"
                  className="mx-auto w-[254px] outline-none bg-white shadow-lg border border-gray-100 rounded-full py-2 px-4 text-center"
                />
              </div>
            </div>

            {/* Time Limit */}
            <div className="rounded-3xl mb-10">
              <div>
                <p className="text-[#3D568F] text-center font-semibold text-[17px] mb-2">
                Добавить таймер на тест
                </p>
                <input
                  type="text"
                  placeholder="00:00:00"
                  value={timeLimit}
                  onChange={handleTimeChange}
                  className="mx-auto w-[254px] bg-white shadow-lg border outline-none border-gray-100 rounded-full py-2 px-4 text-center"
                />
              </div>
            </div>

            {/* Add Question Button */}
            <div
              onClick={toggleCardSelection}
              className="bg-white custom-shadow cursor-pointer rounded-3xl relative p-4"
            >
              <div className="flex  items-center w-[254px] gap-2">
                <button className="w-8 cursor-pointer h-8 bg-[#95b1ee] rounded-full flex items-center justify-center text-white">
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-[#4a4f55] font-semibold raleway text-[17px]">
                  Добавить новый вопрос
                </span>
              </div>

              {/* Card Selection Modal */}
              {showCardSelection && (
                <div className="absolute w-[267px] top-18 left-0 flex flex-col gap-y-5 shadow-lg rounded-4xl bg-white p-6 z-10">
                  <div
                    onClick={() => addQuestionCard("Card1")}
                    className="flex cursor-pointer items-center gap-x-3"
                  >
                    <img src="/test/radio.png" width={20} height={20} alt="" />
                    <p className="text-[16px] font-semibold text-[#3D568F]">
                      Один вариант
                    </p>
                  </div>
                  <div
                    onClick={() => addQuestionCard("Card2")}
                    className="flex cursor-pointer items-center gap-x-3"
                  >
                    <img src="/test/select2.png" alt="" />
                    <p className="text-[16px] font-semibold text-[#3D568F]">
                      Несколько вариантов
                    </p>
                  </div>
                  <div
                    onClick={() => addQuestionCard("Card3")}
                    className="flex cursor-pointer items-center gap-x-3"
                  >
                    <img src="/test/pencil.png" alt="" />
                    <p className="text-[16px] font-semibold text-[#3D568F]">
                      Ручной ввод
                    </p>
                  </div>
                  <div
                    onClick={() => addQuestionCard("Card4")}
                    className="flex cursor-pointer items-center gap-x-3"
                  >
                    <img src="/test/select3.png" alt="" />
                    <p className="text-[16px] font-semibold text-[#3D568F]">
                      Соотнесение
                    </p>
                  </div>
                  <div
                    onClick={() => addQuestionCard("Card5")}
                    className="flex cursor-pointer items-center gap-x-3"
                  >
                    <img src="/test/copy.png" alt="" />
                    <p className="text-[16px] font-semibold text-[#3D568F]">
                      Последовательность
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditTest;
