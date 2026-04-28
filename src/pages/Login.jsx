import React from "react";
import Nav from "../components/Nav";
import { FiStar } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

function Login() {
  return (
    <div className="mx-4 mt-4">
      <Nav />
      <div className="flex h-[85vh] bg-black items-center mt-4 rounded-lg">
        <img
          src="/image.png"
          className="h-[80vh] aspect-19/20 rounded-lg ml-5"
          alt=""
        />
        <form className=" flex flex-col w-4xl h-[80vh] p-8 rounded-xl justify-center items-center shadow-lg ml-8 bg-gray-900">
          <h2 className="text-center text-xl font-bold mb-4 text-white">
            Log In
          </h2>

          <div className="mb-3">
            <input
              type="email"
              placeholder="Email address"
              className="w-65 px-2 py-1.5 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent transition"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              className="w-65 px-2 py-1.5 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent transition"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              placeholder="Confirm password"
              className="w-65 px-2 py-1.5 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-65 py-1.5 px-2 rounded-md text-white font-semibold bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition duration-200 mb-3"
          >
            Sign In
          </button>

          <div className="relative mb-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Don't have an account?{" "}
            <a
              href="/login"
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
