import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export function AddTestCard() {
  return (
    <Link to="/create">
      <div className="bg-white h-full rounded-xl shadow-sm p-6 flex flex-col items-center justify-center min-h-[180px]">
        <div className="mb-4">
          <img src="./test/Icon.png" alt="" />
        </div>
        <span className="text-[#c78686] font-bold text-[22px]">
          Добавить тест
        </span>
      </div>
    </Link>
  );
}
