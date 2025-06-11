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

// Separate left and right values
export const FreeResponseSection = ({
  title,
  answerOptions,
  questionId,
  setAnswers,
  isChecking = false
}) => {
  const leftOptions = answerOptions.map((opt) => opt.left);
  const [rightItems, setRightItems] = useState(
    answerOptions.map((opt) => ({ id: opt.id, text: opt.right }))
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // console.log(answerOptions)

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setRightItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        // 👇 Format into [{ "left": "right" }] after reordering
        const formattedAnswer = newItems.map((item, index) => {
          return {
            [leftOptions[index]]: item.text,
          };
        });

        const combinedObject = formattedAnswer.reduce((acc, pair) => {
          return { ...acc, ...pair };
        }, {});

        setAnswers((prev) =>
          [...prev].map((el) => {
            if (questionId === el.question) {
              return {
                ...el,
                selectedOptions: [combinedObject],
              };
            } else {
              return { ...el };
            }
          })
        );
        return newItems;
      });
    }
  }

  return (
    <section className="w-full max-w-[704px] mx-auto">
      <div className="w-full rounded-[30px] shadow-[0px_4px_10px_0px_rgba(204,216,233,0.5)] bg-white px-5 pb-6 py-[30px]">
        <h2 className="text-lg font-semibold text-[#3D568F] mb-2">{title}</h2>

        <p className="font-semibold text-[#aaaaaa] text-base mb-6">
          Соотнесите варианты ответов между друг другом.
        </p>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={rightItems.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
            disabled={isChecking}
          >
            <div className="grid grid-cols-1 gap-4">
              {rightItems.map((rightItem, index) => (
                <div key={rightItem.id} className="flex gap-4">
                  {/* Static Left */}
                  <div className="h-11 flex-1 text-start rounded-[25px] border-[#d2e0ff] bg-white justify-start pl-8 flex items-center font-['Manrope',Helvetica] font-medium text-[#4a4f55] text-base border">
                    {leftOptions[index]}
                  </div>

                  {/* Draggable Right */}
                  <SortableItem id={rightItem.id} text={rightItem.text} />
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </section>
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
      className="relative flex-1 h-11 bg-white rounded-[25px] border border-[#d2e0ff] flex items-center px-[33px] cursor-move"
    >
      <span className="font-['Manrope',Helvetica] font-medium text-[#4a4f55] text-base">
        {text}
      </span>
      <div className="absolute right-[15px]">
        <img className="w-[15px] h-3" alt="Menu" src="menu.png" />
      </div>
    </div>
  );
};
