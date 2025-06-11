import { useState } from "react"

export default function Switch() {
  const [checked, setChecked] = useState(false)

  return (
    <button
      className={`relative inline-flex h-6 w-11 items-center rounded-full border-2 border-transparent transition-colors ${
        checked ? "bg-blue-primary" : "bg-gray-200"
      }`}
      onClick={() => setChecked(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  )
}