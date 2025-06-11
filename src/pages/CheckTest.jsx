import { useEffect, useState } from "react";
import { API } from "../services/api";
import { formatDuration } from "../lib/util";
import { TimerSection } from "./sections/TimerSection";
import { QuestionListSection } from "./sections/QuestionListSection";
import { AnswerOptionsSection } from "./sections/AnswerOptionsSection";
import { FreeResponseSection } from "./sections/FreeResponseSection/FreeResponseSection";
import { SubmissionSection } from "./sections/SubmissionSection";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";
import { checkManualTest, getManualTest } from "../services/test.service";

const CheckTest = () => {
  const [test, setTest] = useState();
  const [timeSpent, setTimeSpent] = useState("");
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false)

  const [reviewResult, setReviewResult] = useState([])

  const navigate = useNavigate()

  const handleChange = useDebouncedCallback((index, value) => {
    const numericValue = parseFloat(value);
    const safeValue = isNaN(numericValue) ? 0 : Math.max(0, numericValue);

    setReviewResult(prev => {
      const updated = [...prev];
      if (!updated[index]) return prev;

      updated[index] = {
        ...updated[index],
        points: safeValue,
        isCorrect: safeValue > 0
      };

      return updated;
    });
  }, 300);

  const handleSendResults = async() => {
    setLoading(true)
    const response = await checkManualTest(searchParams.get("result_id"), reviewResult)
    setLoading(false)
    // console.log(response)
    navigate("/test")
  }

  useEffect(() => {
    const resultId = searchParams.get("result_id");

    if (!resultId) return;

    const fetchBi = async () => {
      try {
        const data = await getManualTest(resultId)
        setTest(data);
        setTimeSpent(formatDuration(data.startTime, data.endTime));

        const updated = data.answers.map((el) => {
          return {
            question: el.question._id,
            isCorrect: false,
            points: 0
          }

        })

        setReviewResult(updated)

      } catch (error) {
        console.error("Error fetching result:", error);
      }
    };

    fetchBi();
  }, [searchParams]);


  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1440px]">
        <div className="mx-auto w-full max-w-[780px] py-6 px-4 ">
          <div className="relative w-full rounded-[35px] bg-gradient-to-b from-[rgba(243,241,255,0.5)] to-[rgba(218,230,255,0.5)] shadow-[0px_4px_10px_0px_rgba(204,216,233,0.5)] overflow-hidden">
            <div className="flex flex-col space-y-6 p-6">
              {/* Logo/Icon at the top */}
              <div className="flex justify-center mb-2">
                <div className="relative h-[50px] w-[50px]">
                  <div className="absolute w-[45px] h-[45px] top-0 left-0 bg-[url(/path.svg)] bg-[100%_100%]">
                    <div className="relative w-[25px] h-[22px] top-[11px] left-[9px] bg-[#8fabe852] rounded-[14px] rotate-[-105.71deg] blur-[13.5px]" />
                  </div>
                  <div className="">
                    <img
                      className="absolute top-[9px] left-2"
                      alt="Union"
                      width={50}
                      height={50}
                      src="/logo.png"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center justify-center space-x-4">
                <div className="font-bold text-[#3D568F] text-GSB-nu-i text-lg [font-family:'Raleway',Helvetica]">
                  Время выполнения теста:
                </div>
                <div className="bg-white rounded-[20px] border border-solid border-[#d2e0ff] shadow-[0px_4px_10px_0px_rgba(204,216,233,0.5)] px-6 py-2">
                  <div className="[font-family:'Manrope'] font-medium text-[#4a4f55] text-base tracking-[0.24px]">
                    {timeSpent}
                  </div>
                </div>
              </div>

              {test?.answers?.length ? (
                test.answers.map((answer, index) => {
                  const question = answer.question;
                  if (question.questionType === "singleChoice")
                    return (
                      <>
                        <TimerSection
                          answerOptions={question.options}
                          title={question.questionText}
                          questionId={question._id}
                          isChecking={true}
                          answer={answer.selectedOptions[0]}
                          // setAnswers={setAnswers}
                        />
                        <div className=" inline-flex w-fit py-2 gap-2 px-5 rounded-[20px] bg-white ">
                          <p className="text-[#3D568F] font-semibold raleway">
                            Поставить балл:
                          </p>
                          <input
                            className="w-11 text-center text-[#3D568F] rounded-full border border-[#D3E1FFFF]"
                            defaultValue={0}
                            type="text"
                            name=""
                            onChange={(e) => handleChange(index, e.target.value)}
                            id=""
                          />
                        </div>
                      </>
                    );
                  if (question.questionType === "multipleChoice") {
                    return (
                      <>
                        <QuestionListSection
                          answerOptions={question.options}
                          title={question.questionText}
                          questionId={question._id}
                          isChecking={true}
                          answer={answer.selectedOptions}
                        />
                        <div className=" inline-flex w-fit py-2 gap-2 px-5 rounded-[20px] bg-white ">
                          <p className="text-[#3D568F] font-semibold raleway">
                            Поставить балл:
                          </p>
                          <input
                            className="w-11 text-center text-[#3D568F] rounded-full border border-[#D3E1FFFF]"
                            defaultValue={0}
                            type="text"
                            name=""
                            onChange={(e) => handleChange(index, e.target.value)}
                            id=""
                          />
                        </div>
                      </>
                    );
                  }

                  if (question.questionType === "textInput") {
                    return (
                      <>
                        <AnswerOptionsSection
                          title={question.questionText}
                          questionId={question._id}
                          isChecking={true}
                          answer={answer.textAnswer}
                          // setAnswers={setAnswers}
                        />
                        <div className=" inline-flex w-fit py-2 gap-2 px-5 rounded-[20px] bg-white ">
                          <p className="text-[#3D568F] font-semibold raleway">
                            Поставить балл:
                          </p>
                          <input
                            className="w-11 text-center text-[#3D568F] rounded-full border border-[#D3E1FFFF]"
                            defaultValue={0}
                            type="text"
                            name=""
                            onChange={(e) => handleChange(index, e.target.value)}
                            id=""
                          />
                        </div>
                      </>
                    );
                  }

                  if (question.questionType === "matching") {
                    return (
                      <>
                        <FreeResponseSection
                          answerOptions={Object.entries(
                            answer.selectedOptions[0]
                          ).map(([left, right], index) => ({
                            id: index + 1,
                            left,
                            right,
                          }))}
                          title={question.questionText}
                          questionId={question._id}
                          isChecking={true}
                        />
                        <div className=" inline-flex w-fit py-2 gap-2 px-5 rounded-[20px] bg-white ">
                          <p className="text-[#3D568F] font-semibold raleway">
                            Поставить балл:
                          </p>
                          <input
                            className="w-11 text-center text-[#3D568F] rounded-full border border-[#D3E1FFFF]"
                            defaultValue={0}
                            type="text"
                            name=""
                            onChange={(e) => handleChange(index, e.target.value)}
                            id=""
                          />
                        </div>
                      </>
                    );
                  }

                  if (question.questionType === "ordering") {
                    return (
                      <>
                        <SubmissionSection
                          answerOptions={answer.textAnswer.split(" ").map((text, index) => ({
                            id: index + 1,
                            text,
                            order: index + 1
                          }))}
                          title={question.questionText}
                          questionId={question._id}
                          isChecking={true}
                          // setAnswers={setAnswers}
                        />
                        <div className=" inline-flex w-fit py-2 gap-2 px-5 rounded-[20px] bg-white ">
                          <p className="text-[#3D568F] font-semibold raleway">
                            Поставить балл:
                          </p>
                          <input
                            className="w-11 text-center text-[#3D568F] rounded-full border border-[#D3E1FFFF]"
                            defaultValue={0}
                            type="text"
                            name=""
                            onChange={(e) => handleChange(index, e.target.value)}
                            id=""
                          />
                        </div>
                      </>
                    );
                  }
                })
              ) : (
                <></>
              )}

              <div className="flex justify-center">
                <button disabled={loading} type="button" onClick={handleSendResults} className="bg-[#072978] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-[35px] px-16 py-4 h-14 shadow-[0px_4px_10px_0px_rgba(204,216,233,0.5)]">
                  <span className="font-bold text-lg [font-family:'Raleway',Helvetica]">
                    Отправить результат
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckTest;
