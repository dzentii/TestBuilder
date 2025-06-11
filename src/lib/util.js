import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const mapCardTypeToQuestionType = (cardType) => {
  switch (cardType) {
    case "Card1":
      return "singleChoice";
    case "Card2":
      return "multipleChoice";
    case "Card3":
      return "textInput";
    case "Card4":
      return "matching";
    case "Card5":
      return "ordering";
    default:
      return "textInput";
  }
};

export const mapQuestionTypeToCardType = (questionType) => {
  switch (questionType) {
    case "singleChoice":
      return "Card1";
    case "multipleChoice":
      return "Card2";
    case "textInput":
      return "Card3";
    case "matching":
      return "Card4";
    case "ordering":
      return "Card5";
    default:
      return "Card3";
  }
};

export const answerGenerator = (cardType, options) => {

  switch (cardType) {
    case "Card1":
      return [...options].find((el) => el.selected).text;
    case "Card2":
      return [...options].filter((el) => el.selected).map((el) => el.text);
    case "Card3":
      return [...options].map((el) => el.text.toLowerCase().trim());
    case "Card4":
      const result = options.reduce((acc, item) => {
        acc[item.left] = item.right;
        return acc;
      }, {});

      return result
    case "Card5":
      return options.sort((a, b) => a.order - b.order)
      .map(item => item.text.trim())
      .join(" ")
  }
};

export function timeStringToMinutes(time)  {
  const parts = time.split(':').map(Number);

  // Normalize to [hh, mm, ss]
  while (parts.length < 3) parts.unshift(0); // e.g., ["20"] → [0, 0, 20] → assumed as 0h 0m 20s

  const [hours, minutes, seconds] = parts;
  return hours * 60 + minutes + Math.floor(seconds / 60) ;

}

export function minutesToTimeString(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = 0; // Мы их теряем в исходной функции, так что просто ставим 0

  const pad = (num) => String(num).padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}


export function mixMatchingData(data) {
  // Helper: Shuffle an array
  function shuffleArray(array) {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  // Extract the original right values
  const originalRights = data.map((item) => item.right);

  let shuffledRights;
  do {
    shuffledRights = shuffleArray(originalRights);
  } while (shuffledRights.every((val, idx) => val === originalRights[idx]));

  // Create new mixed data
  return data.map((item, index) => ({
    ...item,
    right: shuffledRights[index],
  }));
}

export function formatDuration(startTime, endTime) {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const durationMs = end - start;

  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

export function shuffleAndReorder(items) {
  // Shuffle using Fisher-Yates algorithm
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Update order based on new index
  return shuffled.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
}




export default mapCardTypeToQuestionType;
