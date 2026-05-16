import Nav from "../components/Nav";
import { auth } from "../../firebase";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const passwordInputRef = useRef(null);

  const errorMessages = {
    "auth/invalid-email": "Invalid email address.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/too-many-requests":
      "Too many failed attempts. Please try again later.",
    "auth/network-request-failed":
      "Network error. Please check your connection.",
    "auth/invalid-password": "Invalid password.",
    "auth/missing-password": "Please enter your password.",
    "auth/internal-error": "Something went wrong. Please try again.",
    "auth/invalid-login-credentials": "Invalid email or password.",
    "auth/missing-email": "Please enter your email.",
    "auth/email-already-in-use": "An account already exists with this email.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/requires-recent-login": "Please log in again to continue.",
  };

  // Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      const code = err.code || err.message;
      setError(
        errorMessages[code] || "Something went wrong. Please try again.",
      );
    }
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      passwordInputRef.current?.focus();
    }
  };

  const handlePasswordKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin(e);
    }
  };

  return (
    <div className="mx-2 sm:mx-4 mt-4">
      <Nav />
      <div className="relative flex min-h-[85vh] bg-black items-center justify-center mt-4 rounded-lg overflow-hidden py-6 sm:py-0">
        <div className="absolute inset-0 p-2 sm:p-5">
          <img
            src="/image.png"
            className="h-full w-full object-cover rounded-lg"
            alt=""
          />
        </div>

        <div className="absolute inset-0 bg-black/20 rounded-lg" />

        {/* Login card */}
        <div className="relative z-10 bg-white/85 backdrop-blur-md rounded-2xl shadow-2xl px-4 sm:px-8 py-6 sm:py-9 w-full max-w-[90%] sm:max-w-sm mx-3 sm:mx-4 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-16 bg-linear-to-b from-blue-400/40 to-transparent rounded-t-2xl pointer-events-none" />
          <div className="flex justify-center mb-2.5 sm:mb-4">
            <div className="bg-sky-100 p-3 rounded-2xl">
              <FiLogIn className="text-sky-500 text-2xl" />
            </div>
          </div>
          <h1 className="text-center text-base sm:text-xl font-bold text-gray-900 mb-1">
            Log in to your account
          </h1>
          <p className="text-center text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 leading-snug">
            Sign in to your account to
            <br className="hidden sm:block" /> continue where you left off.
          </p>
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 sm:py-2.5">
              <FiMail className="text-gray-400 text-base shrink-0" />
              <input
                type="email"
                placeholder="Email"
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleEmailKeyDown}
              />
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 sm:py-2.5">
              <FiLock className="text-gray-400 text-base shrink-0" />
              <input
                ref={passwordInputRef}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handlePasswordKeyDown}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              >
                {showPassword ? (
                  <FiEye className="text-base" />
                ) : (
                  <FiEyeOff className="text-base" />
                )}
              </button>
            </div>
            {error && <div className="text-xs text-red-500 px-1">{error}</div>}
            <div
              className="flex justify-end py-1 text-xs text-sky-500 hover:text-sky-400 transition-colors"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </div>
            <button
              onClick={handleLogin}
              className="mt-1 w-full bg-gray-900 hover:bg-gray-700 active:scale-95 transition-all text-white text-sm font-semibold rounded-lg py-2.5 sm:py-3"
            >
              Sign In
            </button>

            <p className="text-center text-xs text-gray-500 mt-1">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-sky-500 hover:text-sky-400 font-medium cursor-pointer transition-colors"
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
