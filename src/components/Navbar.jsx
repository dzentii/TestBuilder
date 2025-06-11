import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {

  const [open, setOpen] = useState(false)


  const navigate = useNavigate()

  const handleOpen = () => {
    setOpen((prev) => (!prev))
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <header className="border-b border-gray-200">
      <div className="container max-w-[1152px] mx-auto px-4 py-[23px] flex items-center justify-between h-20">
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-md flex items-center justify-center">
              <img className="w-[50px] h-[50px]" src="/logo.png" alt="" />
            </div>
          </div>
          <nav className="flex space-x-8">
            <Link
              to="/test-management"
              className="text-[#3d568f] text-[20px] font-bold py-5"
            >
              Мои тесты
            </Link>
            <Link
              to="/test"
              className="text-[#3D568F] text-[20px] font-medium py-5"
            >
              Результаты тестирований
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div onClick={handleOpen} className="relative">
            <img
              className="h-10 w-10 cursor-pointer"
              src="/test/profile.png"
              alt=""
            />
            {open && <div className="absolute w-[186px] -translate-x-16 px-5 py-2.5 rounded-4xl bg-white shadow top-12">
              <p onClick={handleLogout} className="text-[#3D568F] cursor-pointer">Выход из аккаунта</p>
            </div>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
