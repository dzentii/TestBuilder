import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getTest, startTest } from "../services/test.service";

export default function TestRegistrationForm() {
  const [test, setTest] = useState({});
  const [guest, setGuest] = useState({
    name: "",
    lastName: "",
    telegram: "",
    number: "",
    email:""
  })

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const testId = queryParams.get("test");

  const handleStartTest = async(e) => {
    e.preventDefault()
    setLoading(true)
    const response = await startTest(testId, guest)
    setLoading(false)
    // console.log(response)
    if (response?.startTime) {
      navigate("/start-test", {
        state: {...test, start: response.startTime, result_id: response._id},
      })
    }
  }

  const handleChange = (e) => {
    setGuest((prev) => ({...prev, [e.target.name]: e.target.value}))
  }

  console.log(test)
  useEffect(() => {
    getTest(testId).then((data) => {
      setTest(data);
    });
  }, []);

  return (
    <div className="min-h-screen max-w-[1152px] rounded-3xl mx-auto flex items-center justify-center mt-20 gradient-background  p-10">
      <form onSubmit={handleStartTest} className="relative z-10">
        <div className="flex justify-center mb-6">
          <div className="rounded-2xl flex items-center justify-center">
            <img
              src="./logo.png"
              alt="Document Icon"
              className="w-[70px] h-[70px]"
            />
          </div>
        </div>

        <h1 className="text-[#072A79] text-[32px] font-semibold text-center mb-10">
          {test?.title}
        </h1>

        <div className="bg-[#f8f9ff] rounded-xl p-4 mb-8 max-w-3xl mx-auto">
          <p className="text-[#3D568F] text-center text-[16px] font-medium">
            {test?.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#f68d88]">
                <img src="./test/user.png" alt="" />
              </div>
              <input
                type="text"
                required
                value={guest.lastName}
                name="lastName"
                onChange={handleChange}
                placeholder="Введите вашу фамилию"
                className="w-full pl-15 pr-4 py-4 rounded-full border bg-white border-[#e9f3ff] focus:outline-none focus:ring-2 focus:ring-[#95b1ee] text-[#404b7c] placeholder-[#F68D88]"
              />
            </div>

            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#F68D88]">
                <img src="./test/user.png" alt="" />
              </div>
              <input
                type="text"
                required
                value={guest.name}
                onChange={handleChange}
                name="name"
                placeholder="Введите ваше имя"
                className="w-full pl-15 pr-4 py-4 rounded-full border bg-white border-[#e9f3ff] focus:outline-none focus:ring-2 focus:ring-[#95b1ee] text-[#404b7c] placeholder-[#F68D88]"
              />
            </div>

            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#F68D88]">
                <img src="./test/usertelegram.png" alt="" />
              </div>
              <input
                type="text"
                onChange={handleChange}
                required
                value={guest.telegram}
                name="telegram"
                placeholder="Ваш ник в телеграм"
                className="w-full pl-15 pr-4 py-4 rounded-full border bg-white border-[#e9f3ff] focus:outline-none focus:ring-2 focus:ring-[#95b1ee] text-[#404b7c] placeholder-[#F68D88]"
              />
            </div>

            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#F68D88]">
                <img src="./test/userphone.png" alt="" />
              </div>
              <input
                type="tel"
                onChange={handleChange}
                required
                name="number"
                value={guest.number}
                placeholder="Ваш номер телефона"
                className="w-full pl-15 pr-4 py-4 rounded-full border bg-white border-[#e9f3ff] focus:outline-none focus:ring-2 focus:ring-[#95b1ee] text-[#404b7c] placeholder-[#F68D88]"
              />
            </div>

            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#F68D88]">
                <img src="./test/emai.png" alt="" />
              </div>
              <input
                type="email"
                onChange={handleChange}
                required
                value={guest.email}
                name="email"
                placeholder="Введите вашу почту"
                className="w-full pl-15 pr-4 py-4 rounded-full border bg-white border-[#e9f3ff] focus:outline-none focus:ring-2 focus:ring-[#95b1ee] text-[#404b7c] placeholder-[#F68D88]"
              />
            </div>
          </div>

          <div className="flex justify-center items-center">
            <img
              src="./test/telescope.png"
              alt="Person with telescope"
              width={400}
              height={400}
              className="max-w-full h-auto"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button disabled={loading} className="bg-[#072A79] disabled:opacity-50 disabled:cursor-not-allowed font-bold cursor-pointer hover:bg-[#3d568f] text-white py-4 px-8 rounded-full transition-colors duration-300 min-w-[280px]">
            Начать тестирование
          </button>
        </div>
      </form>
    </div>
  );
}
