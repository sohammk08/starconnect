import { useState } from "react";
import DevBadge from "./DevBadge";
import { RxCross2 } from "react-icons/rx";
import { IoMdContact } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";

function Nav() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <div className="flex bg-black p-3 justify-between w-full rounded-lg">
        <h2
          className="text-white font-semibold flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <IoMdContact className="mr-2" />
          Star Connect
        </h2>

        <ul className="hidden md:flex space-x-3 my-auto">
          <li
            className="text-sm uppercase font-semibold bg-black text-white cursor-pointer rounded-lg px-2 py-1"
            onClick={() => navigate("/docs")}
          >
            Docs
          </li>
          <li
            className="text-sm uppercase font-semibold bg-black text-white cursor-pointer rounded-lg px-2 py-1"
            onClick={() => navigate("/register")}
          >
            Register
          </li>
          <li
            className="text-sm uppercase font-semibold bg-black text-white cursor-pointer rounded-lg px-2 py-1"
            onClick={() => navigate("/login")}
          >
            Login
          </li>
        </ul>

        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setMenuOpen(true)}
        >
          <GiHamburgerMenu />
        </button>

        <div className="hidden md:block">
          <DevBadge />
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 flex flex-col py-5 items-center justify-between backdrop-blur-xl bg-black/40 transition-all duration-500 ease-in-out ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex w-full justify-between items-center px-6">
          <div
            className={`flex items-center text-white font-semibold text-lg transition-all duration-500 ${
              menuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            <IoMdContact className="mr-2 text-2xl" />
            Star Connect
          </div>

          <button
            className={`text-white text-lg bg-white/10 border border-white/20 rounded-xl p-2 transition-all duration-500 ${
              menuOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <RxCross2 />
          </button>
        </div>

        <ul className="flex flex-col items-center space-y-8">
          {[
            { label: "Docs", path: "/docs" },
            { label: "Register", path: "/register" },
            { label: "Login", path: "/login" },
          ].map(({ label, path }, i) => (
            <li
              key={path}
              className={`text-white text-3xl font-bold cursor-pointer transition-all duration-500 hover:opacity-70 ${
                menuOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{
                transitionDelay: menuOpen ? `${i * 80 + 150}ms` : "0ms",
              }}
              onClick={() => handleNav(path)}
            >
              {label}
            </li>
          ))}
        </ul>

        <DevBadge />
      </div>
    </>
  );
}

export default Nav;
