"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

const Card2 = forwardRef(({ handleDelete, errors = [], id, manual, editTask=null }, ref) => {
  const [options, setOptions] = useState([
    { id: 1, text: "", selected: true, ball: 1 },
    { id: 2, text: "", selected: false, ball: "-" },
    { id: 3, text: "", selected: false, ball: "-" },
  ]);

  const [questionText, setQuestionText] = useState("");

  useImperativeHandle(ref, () => ({
    getData: () => {
      const points = options.reduce((sum, option) => {
        if (option.selected && !isNaN(option.ball)) {
          return sum + Number(option.ball);
        }
        return sum;
      }, 0);

      return {
        type: "Card2",
        questionText,
        options,
        points: !manual ? 0 : points,
      };
    },
  }));

  const addOption = () => {
    const newId =
      options.length > 0 ? Math.max(...options.map((o) => o.id)) + 1 : 1;
    setOptions([
      ...options,
      { id: newId, text: "", selected: false, ball: "-" },
    ]);
  };

  const removeOption = (id) => {
    setOptions(options.filter((option) => option.id !== id));
  };

  const toggleOption = (id) => {
    setOptions(
      options.map((option) =>
        option.id === id
          ? {
              ...option,
              selected: !option.selected,
              ball: !option.selected ? 1 : "-", // if just selected, assign 1
            }
          : option
      )
    );
  };

  useEffect(() => {
  if (editTask) {
    setOptions(editTask.options);
    setQuestionText(editTask.questionText)
  }
}, [editTask]);

  const updateOptionText = (id, text) => {
    setOptions(
      options.map((option) => (option.id === id ? { ...option, text } : option))
    );
  };

  return (
    <div id={id} className="mb-6 bg-white question-card-shadow p-9 rounded-2xl">
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
            <div
              className="w-5 h-5 rounded mr-3 flex-shrink-0 border-2 cursor-pointer flex items-center justify-center"
              style={{
                backgroundColor: option.selected ? "#3d568f" : "white",
                borderColor: option.selected ? "#3d568f" : "#D3E1FF",
              }}
              onClick={() => toggleOption(option.id)}
            >
              {option.selected && <span className="text-white text-xs">✓</span>}
            </div>
            <div className="flex-grow border-2 h-11 rounded-2xl border-[#D3E1FF] relative">
              <input
                type="text"
                value={option.text}
                placeholder="Вариант ответа"
                onChange={(e) => updateOptionText(option.id, e.target.value)}
                className="w-full bg-white rounded-full py-2 px-4 pr-10 border-none outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#f68d88]"
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
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!isNaN(value) || value === "-") {
                      const updated = options.map((o) =>
                        o.id === option.id ? { ...o, ball: value } : o
                      );
                      setOptions(updated);
                    }
                  }}
                  disabled={!option.selected}
                  className={`w-10 h-6 text-center border-[#D3E1FF] border-2 text-[16px] rounded-2xl outline-none ${
                    option.selected
                      ? "text-[#3D568F] bg-white"
                      : "text-gray-400 bg-gray-100 cursor-not-allowed"
                  }`}
                />

                <p className="text-[16px] text-[#3D568F]">Баллы</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          className="flex items-center gap-2 h-[50px] bg-white shadow-lg rounded-full py-2 px-4 text-[#3d568f]"
          onClick={addOption}
        >
          <Plus className="w-7 h-7 text-white rounded-full bg-[#95B1EE] p-1" />
          <span className="ml-2 text-[#3D568F] font-semibold text-[16px]">
            Добавить вариант ответа
          </span>
        </button>
        <button
          type="button"
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

Card2.displayName = "Card2";

export default Card2;
