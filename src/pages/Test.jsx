import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getTests } from "../services/test.service";
import { useNavigate } from "react-router-dom";


const Test = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [tests, setTests] = useState([]);

  const navigate = useNavigate()

  useEffect(() => {
    getTests().then((data) => {
      setTests(data)
    })
  }, [])

  const toggleIndex = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  console.log(tests);
  

  // /results/test/:testId

  return (
    <div className="w-full bg-color min-h-[100vh] h-full">
      <Navbar />
      <div className="max-w-[1160px] mx-auto  px-5 py-10">
        <h3 className="font-bold text-[24px] mb-10 text-[#3D568F] ">
          Все тесты
        </h3>
        <div>
          {tests.map((item, index) => (
            <div key={index} className="relative">
              <div className="flex items-center justify-between w-full h-[84px] px-[34px] bg-white shadow-lg mb-5  rounded-[20px]">
                <div className="flex items-center gap-x-10">
                  <p className="text-[22px] text-[#3D568F] font-bold">
                    {item.title}
                  </p>
                  <p className="text-[16px] text-[#F68D88]">{item.manualCheck ? "Ручная проверка" : "Автоматическая проверка"}</p>
                </div>
                <div className="flex items-center gap-x-5">
                  <p className="text-[16px] text-[#3D568F] font-semibold">
                  Результаты тестирования
                  </p>
                  {activeIndex === index ? (
                    <img
                      onClick={() => toggleIndex(index)}
                      className="w-5 h-2.5 cursor-pointer transition-transform duration-300"
                      src="./test/top.png"
                      alt="Collapse"
                    />
                  ) : (
                    <img
                      onClick={() => toggleIndex(index)}
                      className="w-5 h-2.5 cursor-pointer transition-transform duration-300"
                      src="./test/bottom.png"
                      alt="Expand"
                    />
                  )}
                </div>
              </div>

              <div
                className={`transition-all duration-700 ease-in-out overflow-hidden ${
                  activeIndex === index
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-white rounded-[35px] mb-4 p-6">
                  {item.attempts.map((student, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center pb-4 gap-x-[104px] border-b border-b-[#95B1EE] mb-5"
                    >
                      <div className="grid grid-cols-4 w-[70%] items-center gap-x-[77px] ">
                        <p className="text-[16px] text-[#3D568F] font-medium">
                          {student.guestInfo.name}
                        </p>
                        <p className="text-[16px] text-[#3D568F] font-medium">
                          {student.guestInfo.lastName}
                        </p>
                        <p className="flex items-center gap-x-2.5 text-[16px] text-[#3D568F] font-medium ">
                          <img
                            className="w-5 h-5"
                            src="./test/phone.png"
                            alt=""
                          />
                          {student.guestInfo.number}
                        </p>
                        <p className="flex items-center gap-x-2.5 text-[16px] text-[#3D568F] font-medium">
                          <img
                            className="w-5 h-5"
                            src="./test/telegram.png"
                            alt=""
                          />
                          {student.guestInfo.telegram}
                        </p>
                      </div>
                      <div className="flex w-[30%] items-center gap-x-10  ">
                        <p className={`text-[18px] ${item.passingScore <= student.percentage ? "text-[#4B9142]" : "text-[#F68D88]"} `}>
                          {student.status === "needsReview" ? "-" : student.percentage + " %"}
                          
                        </p>
                        <p className={`text-[18px] ${item.passingScore <= student.percentage ? "text-[#4B9142]" : "text-[#F68D88]"} `}>
                        {item.passingScore <= student.percentage && (student.status === "completed" || student.status === "reviewed") && "Отбор пройден"}
                          {item.passingScore >= student.percentage && (student.status === "completed" || student.status === "reviewed") && "Отбор не пройден"}
                          {student.status === "needsReview" && <button onClick={() => navigate("/check?result_id=" + student._id)} type="button" className="text-white cursor-pointer rounded-full bg-[#95B1EE] px-6 py-3">Оценить работу</button>}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Test;
