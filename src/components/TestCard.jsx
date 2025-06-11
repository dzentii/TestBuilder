import { toast, ToastContainer } from "react-toastify"
import { deleteTest, getTest } from "../services/test.service"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function TestCard({test, setTests}) {

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin + "/test-registration?test=" + test._id)
    toast("Ссылка на тест скопирована")
  }

  const handleDelete = async() => {
    setLoading(true)
    await deleteTest(test._id)
    setLoading(false)
    setTests((prev) => ([...prev].filter((el) => el._id !== test._id)))
  }

  const handleEdit = async(id) => {
       navigate(`/edit/${id}`)
  }


  return (
    <div key={test._id} className="bg-white rounded-4xl text-center shadow-sm py-6">
      <ToastContainer />
      <h3 className="text-[#3D568F] text-[22px] font-bold mb-2">{test.title}</h3>
      <div className="text-[#95B1EE] text-[16px] mb-1.5">{test.questionsCount} вопросов</div>
      <div className="text-[#3D568F] text-[16px] mb-4">{test?.attempts?.length ? "Ответов: " + test.attempts.length : "Нет ответов"}</div>
      <div className="flex bg-[#EFF5FF] max-w-[190px] edit-btns-div justify-center items-center mx-auto h-[46px] rounded-2xl space-x-4">
        <button onClick={()=>handleEdit(test._id)} className="text-[#3D568F] cursor-pointer">
          <img className="w-[32px] h-[32px] mt-2" src="./test/edit.png" alt="" />
        </button>
        <button disabled={loading} onClick={handleDelete} className="text-[#f68d88] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer">
          <img className="w-[18px] h-[18px] mt-[2px]" src="./test/delete.png" alt="" />
        </button>
        <button onClick={handleCopy} className="text-[#3D568F] cursor-pointer">
          <img className="w-[32px] h-[32px] mt-2" src="./test/link.png" alt="" />
        </button>
      </div>
    </div>
  )
}