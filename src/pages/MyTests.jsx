import { FileText, User } from "lucide-react"
import { AddTestCard } from "../components/AddTestCard"
import TestCard from "../components/TestCard"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { getTests } from "../services/test.service"
import Navbar from "../components/Navbar"

export default function TestManagementPage() {
  const [tests, setTests] = useState([])
  useEffect(() => {
    getTests().then((data) => {
      setTests(data)
    })
  }, [])


  return (
    <div className="min-h-screen bg-[#eff5ff]">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Recent Tests Section */}
        <section className="mb-10  max-w-[1152px] mx-auto">
          <h2 className="text-[#3d568f] text-[24px] font-bold  mb-10">Недавние тесты</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tests.slice(0,4).map((item) => (
              <TestCard setTests={setTests} test={item} key={`recent-${item._id}`} />
            ))}
          </div>
        </section>
        <div className="w-full h-[2px] mb-10 bg-[#95B1EE]">

        </div>
        {/* All Tests Section */}
        <section className="max-w-[1152px] mx-auto">
          <h2 className="text-[#3d568f] text-[24px] font-bold  mb-6">Все тесты</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AddTestCard />
            {tests.map((item) => (
              <TestCard setTests={setTests} test={item} key={`all-${item._id}`} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
