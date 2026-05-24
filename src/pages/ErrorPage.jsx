import { useContext } from "react";
import Nav from "../components/Nav";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth/AuthContext";

function ErrorPage() {
  let navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="mx-2 sm:mx-4 mt-4">
      {currentUser ? (
        <button
          className="flex bg-neutral-800 font-medium p-2 items-center text-sm text-white/80 gap-2 rounded-xl cursor-pointer"
          onClick={() => navigate("/")}
          title="Navigate to Home"
        >
          <FaArrowLeft />
          Back to Home
        </button>
      ) : (
        <Nav />
      )}
      <div className="relative flex min-h-[85vh] bg-black items-center justify-center mt-4 rounded-lg overflow-hidden py-6 sm:py-0">
        <div className="absolute inset-0 p-2 sm:p-5">
          <img
            src="/image.png"
            className="h-full w-full object-cover rounded-lg"
            alt=""
          />
        </div>

        <div className="absolute inset-0 bg-black/10 rounded-lg" />
        <div className="flex flex-col justify-center items-center text-center">
          <h1 className="text-[15rem] text-white z-10 italic tracking-wider font-bold font-anton">
            404
          </h1>
          <p className="text-white z-10 text-2xl font-medium">Page Not Found</p>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
