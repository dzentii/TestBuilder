import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SubmissionSection = ({
  answerOptions,
  title,
  questionId,
  setAnswers,
  isChecking = false
}) => {
  const [items, setItems] = useState(answerOptions);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  console.log(answerOptions)

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const stringified = arrayMove(items, oldIndex, newIndex)
          .map((item) => item.text.trim())
          .join(" ");
        setAnswers((prev) =>
          [...prev].map((el) => {
            if (questionId === el.question) {
              return {
                ...el,
                textAnswer: stringified,
              };
            } else {
              return { ...el };
            }
          })
        );
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="w-full max-w-[702px] mx-auto">
      <div className="w-full bg-white rounded-[30px] shadow-[0px_4px_10px_0px_rgba(204,216,233,0.5)] px-5 pb-6 py-[30px]">
        <h2 className="text-lg font-semibold text-[#3D568F] mb-6 [font-family:'Raleway',Helvetica]">
          {title}
        </h2>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
            disabled={isChecking}
          >
            <div className="flex flex-col gap-[16px]">
              {items.map((option) => (
                <SortableItem
                  key={option.id}
                  id={option.id}
                  text={option.text}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

const SortableItem = ({ id, text }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative w-full h-11 bg-white rounded-[25px] border border-solid border-[#d2e0ff] flex items-center px-[33px] cursor-move"
    >
      <span className="[font-family:'Manrope',Helvetica] font-medium text-[#4a4f55] text-base">
        {text}
      </span>
      <div className="absolute right-[15px]">
        <img className="w-[15px] h-3" alt="Menu" src="menu.png" />
      </div>
    </div>
  );
};
