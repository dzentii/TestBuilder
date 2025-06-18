import { toast } from "react-toastify"
import { API } from "./api"

const createTest = async(data) => {
  const response = await API.post("/api/tests", data)
  return response.data
}

export const getTests = async() => {
  const response = await API.get("/api/tests")
  return response.data
}

export const getTest = async(testId) => {
  const response = await API.get("/api/tests/" + testId)
  return response.data
}

export const deleteTest = async(testId) => {
  const response = await API.delete("/api/tests/" + testId)
  return response.data
}

export const createQuestionsToTest = async (testId, questions) => {
  const response = await API.post("/api/questions/test/" + testId, questions)
  return response.data
}

export const startTest = async (testId, guestInfo) => {
  const response = await API.post("/api/results/start", {
    testId, guestInfo
  })

  return response.data
}

export const submitTest = async (testId, data) => {
  try {

    const response = await API.post(`/api/results/${testId}/submit`, data)
    return 200
  } catch (error) {
    // console.log(error)
    toast.error(error.response.data.message);
  }
}

export const getAllTestResults = async (testId) => {
  const response = await API.get("/api/results/test/" + testId)
  return response.data
}

export const getManualTest = async(resultId) => {
  const response = await API.get(`/api/results/${resultId}`);
  const data = response.data;
  return data
}

export const checkManualTest = async (resultId, data) => {
  const response = await API.post(`/api/results/${resultId}/review`, {answers: data})
  return response.data
}

export const updateTest = async (testId, data)  => {
  const response = await API.put("/api/tests/" + testId, data)
  return response
}



export default createTest