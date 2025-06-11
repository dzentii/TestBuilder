import { Link, useNavigate } from "react-router-dom";

function HomePage() {

  const navigate = useNavigate()

  const redirector = () => {
    if (localStorage.getItem("token")) {
      navigate("/test-management")
    } else {
      navigate("/login")
    }
  }

  return (
    <div className="min-h-screen px-5 md:px-20 flex flex-col">
      {/* Header */}
      <header className="container max-w-[1140px] mx-auto py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img className="cursor-pointer" src="logo.png" alt="Logo" width={50} height={50} />
        </div>
        <div className="flex items-center gap-6">
          <p onClick={redirector} className="text-[#f68d88] cursor-pointer hover:underline">
            Создать тест
          </p>
          <button
            onClick={redirector}
            className="border border-[#f68d88] text-[#f68d88] cursor-pointer px-4 md:px-6 py-1.5 md:py-2 rounded-full hover:bg-[#f68d88] hover:text-white transition-colors"
          >
            Войти
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`img-header  px-16 py-5 `}>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-2xl md:text-4xl font-bold text-[#3d568f] leading-tight mb-6">
              Быстрые тесты.
              <br />
              Умная проверка.
              <br />
              Лучшие результаты.
            </h1>
            <button
               onClick={redirector}
              className="inline-block cursor-pointer bg-[#f68d88] text-white px-8 py-3 rounded-full hover:bg-[#ecbdbb] transition-colors"
            >
              Войти
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="headerIllustration.png"
              alt="Testing illustration"
              className="w-full h-auto md:h-[368px]  max-w-md"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:py-24">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#3d568f] text-center mb-4">
            Автоматизированное тестирование, которое работает на вас
          </h2>
          <p className="text-[#9ab3da] text-center mb-16 max-w-3xl mx-auto">
            Гибкие настройки, удобный интерфейс и мгновенная проверка
            результатов.
          </p>

          <div className="flex justify-center">
            <img
              src="illus2.png"
              alt="Features illustration"
              width={500}
              height={400}
              className="w-full max-w-lg"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <img
                src="logo.png"
                alt="Logo"
                width={50}
                height={50}
                // className="w-10 h-10"
              />
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-[#9ab3da] hover:text-[#3d568f]">
                Конфиденциальность
              </a>
              <a href="#" className="text-[#9ab3da] hover:text-[#3d568f]">
                Условия пользования
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
