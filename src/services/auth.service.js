import { API } from "./api"

export const login = async (data) => {
  try {

    const response = await API.post("/auth/login", data)
    localStorage.setItem("token", response.data.token)
    return response.data
  } catch(error) {
    return {error: error?.response?.data?.message}
  }
}

export const register = async (data) => {
  // localStorage.removeItem("token")
  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const da = await response.json()
    return da
  } catch (error) {
    return {error: error?.response?.data?.message}
  }
}