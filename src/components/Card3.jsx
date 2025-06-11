"use client";

import { Plus, Trash2, X } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const Card3 = forwardRef(({ handleDelete, errors = [], id, manual, editTask=null }, ref) => {
  const [options, setOptions] = useState([
    { id: 1, text: "", ball: 1  },
  ]);
  const [questionText, setQuestionText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(editTask?.settings?.caseSensitive || false);
  const [exactMatch, setExactMatch] = useState(editTask?.settings?.exactMatch || false);

  useImperativeHandle(ref, () => ({
    getData: () => {
      const totalPoints = options.reduce((sum, option) => {
        const num = parseFloat(option.ball)
        return sum + (isNaN(num) ? 0 : num)
      }, 0)
  
      return {
        type: "Card3",
        questionText,
        options,
        points: !manual ? 0 : totalPoints,
        settings: {
          caseSensitive,
          exactMatch,
        },
      }
    },
  }))

  const addOption = () => {
    const newId =
      options.length > 0 ? Math.max(...options.map((o) => o.id)) + 1 : 1;
    setOptions([
      ...options,
      { id: newId, text: "", ball: "-" },
    ]);
  };

  const removeOption = (id) => {
    setOptions(options.filter((option) => option.id !== id));
  };

  const updateOptionText = (id, text) => {
    setOptions(
      options.map((option) => (option.id === id ? { ...option, text } : option))
    );
  };

  const updateOptionBall = (id, ball) => {
    setOptions(
      options.map((option) => (option.id === id ? { ...option, ball } : option))
    );
  };

  
    useEffect(() => {
    if (editTask) {
      setOptions(
        editTask.correctAnswer.map((text, index) => ({
          id: index + 1,
          text,
          ball: 1,
          selected: false
  }))
);

      //setOptions(editTask.options);
      setQuestionText(editTask.questionText)
    }
  }, [editTask]);

  return (
    <div id={id} className="mb-6 question-card-shadow bg-white p-9 rounded-2xl">
      <div className="relative mb-6">
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Введите текст вопроса"
          className={`w-full text-center bg-transparent border-none outline-none placeholder:text-[20px] placeholder:text-[#3D568F] placeholder:font-medium ${
            errors.includes("Пожалуйста, введите текст вопроса")
              ? "border-2 border-[#F68D88] rounded-xl"
              : ""
          }`}
        />
        {errors.includes("Пожалуйста, введите текст вопроса") && (
          <p className="text-[#F68D88] text-sm text-center mt-1">
            Пожалуйста, введите текст вопроса
          </p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {options.map((option) => (
          <div key={option.id} className="flex gap-x-5 items-center">
            <div className="flex-grow border-2 h-11 rounded-2xl border-[#D3E1FF] relative">
              <input
                type="text"
                value={option.text}
                placeholder="Правильный ответ"
                onChange={(e) => updateOptionText(option.id, e.target.value)}
                className="w-full bg-white rounded-full py-2 px-4 pr-10 border-none outline-none"
              />
              <button
                className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-[#f68d88]"
                onClick={() => removeOption(option.id)}
              >
                <X />
              </button>
            </div>
            {manual ? (
              <div className="flex items-center gap-x-2.5">
                <input
                  type="text"
                  value={option.ball}
                  onChange={(e) => updateOptionBall(option.id, e.target.value)}
                  className="w-12 h-8 border-[#D3E1FF] border-2 text-center text-[16px] text-[#3D568F] rounded-2xl"
                />
                <p className="text-[16px] text-[#3D568F]">Баллы</p>
              </div>
            ) : null}
          </div>
        ))}
        <div className="flex items-center gap-x-8 mt-4">
          <div className="flex items-center gap-x-3">
            <input
              className="w-4 h-4 border-2 border-[#F68D88] accent-[#F68D88] rounded"
              type="checkbox"
              checked={caseSensitive}
              onChange={() => setCaseSensitive(!caseSensitive)}
            />
            <p className="text-[16px] font-semibold text-[#F68D88]">
              Учитывать регистр
            </p>
          </div>
          <div className="flex items-center gap-x-3">
            <input
              className="w-4 h-4 border-2 border-[#F68D88] accent-[#F68D88] rounded"
              type="checkbox"
              checked={exactMatch}
              onChange={() => setExactMatch(!exactMatch)}
            />
            <p className="text-[16px] font-semibold text-[#F68D88]">
              Точное совпадение
            </p>
          </div>
        </div>
      </div>

      {/* Add/Delete Question Buttons */}
      <div className="flex justify-between">
        <button
          className="flex items-center text-center gap-2 h-[50px] bg-white shadow-lg rounded-full py-2 px-4 text-[#3d568f]"
          onClick={addOption}
        >
          <Plus className="w-7 h-7 text-white rounded-full bg-[#95B1EE] p-1" />
          <span className="ml-2 text-[#3D568F] font-semibold text-[16px]">
            Добавить вариант ответа
          </span>
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center cursor-pointer gap-2 bg-white shadow-lg rounded-full py-2 px-4 text-[#f68d88]"
        >
          <div className="w-7 h-7 p-1.5 bg-[#F68D88] rounded-full flex items-center justify-center">
          <Trash2 className="text-white" />
          </div>
          <span className="text-[#F68D88] font-semibold">
            Удалить вопрос из теста
          </span>
        </button>
      </div>
      {errors.length > 0 &&
        !errors.includes("Пожалуйста, введите текст вопроса") && (
          <div className="mt-4">
            {errors.map((error, index) => (
              <p key={index} className="text-[#F68D88] text-sm">
                {error}
              </p>
            ))}
          </div>
        )}
    </div>
  );
});

Card3.displayName = "Card3";

export default Card3;
