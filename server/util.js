export function isMatchingCorrect(correctAnswer, studentAnswer) {
  for (const key in correctAnswer) {
    if (correctAnswer[key] !== studentAnswer[key]) {
      return false;
    }
  }
  return true;
}