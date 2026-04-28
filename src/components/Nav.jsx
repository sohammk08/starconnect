import DevBadge from "./DevBadge";
import { IoMdContact } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function Nav() {
  const navigate = useNavigate();

  return (
    <div className="flex bg-black p-3 justify-between w-full rounded-lg">
      <h2
        className="text-white font-semibold flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <IoMdContact className="mr-2" />
        Star Connect
      </h2>
      <ul className="flex space-x-3 my-auto">
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
      <DevBadge />
    </div>
  );
}

export default Nav;
