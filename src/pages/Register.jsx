import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { register } from "../services/auth.service";

export const RegisterPage = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    name: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await register(user);
    setLoading(false);
    console.log(response.error);
    if (response.error) {

      setError(response.error);
      return;
    }
    if (response?.token) {
      localStorage.setItem("token", response.token);
      navigate("/test-management");
    }
  };

  return (
    <div className="bg-white flex justify-center items-center [background:linear-gradient(180deg,rgba(249,248,255,1)_0%,rgba(218,230,255,1)_100%)] w-full min-h-screen">
      <div className="bg-white px-8 py-6 flex flex-col rounded-[40px]">
        <img src="logo.png" className="w-16 h-16 self-center" alt="" />
        <div className="rounded-4xl border p-[3px] mt-8 border-[#D3E1FFFF]">
          <button className="py-4 px-7 cursor-pointer bg-[#95B1EEFF] text-white rounded-4xl">
            Регистрация
          </button>
          <button
            onClick={() => navigate("/login")}
            className="py-4 px-7 text-[#3D568F] cursor-pointer"
          >
            Вход в аккаунт
          </button>
        </div>
        {error && <p className="text-red-400 pt-8 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="flex space-y-3.5 py-8 flex-col">
          <input
            required
            onChange={(e) => handleChange("lastName", e.target.value)}
            type="text"
            className="rounded-4xl placeholder:text-[#3D568F] shadow py-4 px-7"
            placeholder="Введите вашу фамилию"
          />
          <input
            required
            onChange={(e) => handleChange("name", e.target.value)}
            type="text"
            className="rounded-4xl placeholder:text-[#3D568F] shadow py-4 px-7"
            placeholder="Введите ваше имя"
          />
          <input
            required
            onChange={(e) => handleChange("email", e.target.value)}
            type="text"
            className="rounded-4xl placeholder:text-[#3D568F] shadow py-4 px-7"
            placeholder="Введите вашу почту"
          />
          <input
            required
            onChange={(e) => handleChange("password", e.target.value)}
            type="password"
            className="rounded-4xl placeholder:text-[#3D568F] shadow py-4 px-7"
            placeholder="Придумайте пароль"
          />
          <button
            disabled={loading}
            className="bg-[#F68D88] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-white py-4 rounded-4xl"
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
};
