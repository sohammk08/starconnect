import {
  FiEye,
  FiUser,
  FiMail,
  FiLock,
  FiEyeOff,
  FiUserPlus,
} from "react-icons/fi";
import Nav from "../components/Nav";
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Register() {
  let navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Email validation logic
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  // Password validation logic
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (/\s/.test(password)) {
      return "Password cannot contain spaces.";
    }
    return "";
  };

  // Trim whitespace
  const sanitizeInput = (input) => {
    return input.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);

    // Check for empty fields
    if (!sanitizedEmail || !sanitizedUsername || !sanitizedPassword) {
      setPasswordError("All fields are required.");
      return;
    }

    // Validate email
    const emailError = validateEmail(sanitizedEmail);
    if (emailError) {
      setPasswordError(emailError);
      return;
    }

    // Validate password
    const passwordValidationError = validatePassword(sanitizedPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    setPasswordError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        sanitizedEmail,
        sanitizedPassword,
      );
      await sendEmailVerification(userCredential.user);

      await addDoc(collection(db, "users"), {
        email: sanitizedEmail,
        username: sanitizedUsername,
        uid: userCredential.user.uid,
      });
      alert(
        "A verification email has been sent to you. Please click on the link in the email to verify.",
      );
      navigate("/");
    } catch (err) {
      alert("Error: " + err.message);
      setPasswordError(err.message);
    }
  };

  return (
    <div className="mx-2 sm:mx-4 mt-4">
      <Nav />
      <div className="relative flex min-h-[85vh] bg-black items-center justify-center mt-4 rounded-lg overflow-hidden py-6 sm:py-0">
        {/* bg */}
        <div className="absolute inset-0 p-2 sm:p-5">
          <img
            src="/image.png"
            className="h-full w-full object-cover rounded-lg"
            alt=""
          />
        </div>

        <div className="absolute inset-0 bg-black/20 rounded-lg" />

        {/* Register Card */}
        <div className="relative z-10 bg-white/85 backdrop-blur-md rounded-2xl shadow-2xl px-4 sm:px-8 py-6 sm:py-9 w-full max-w-[90%] sm:max-w-sm mx-3 sm:mx-4 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-16 bg-linear-to-b from-blue-400/40 to-transparent rounded-t-2xl pointer-events-none" />
          <div className="flex justify-center mb-2.5 sm:mb-4">
            <div className="bg-sky-100 p-3 rounded-2xl">
              <FiUserPlus className="text-sky-500 text-2xl" />
            </div>
          </div>
          <h1 className="text-center text-base sm:text-xl font-bold text-gray-900 mb-1">
            Create your account
          </h1>
          <p className="text-center text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 leading-snug">
            Sign up to start saving contacts for reference or backups. For free!
          </p>
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 sm:py-2.5">
              <FiUser className="text-gray-400 text-base shrink-0" />
              <input
                type="text"
                placeholder="Your Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full disabled:opacity-50"
              />
            </div>

            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2.5">
              <FiMail className="text-gray-400 text-base shrink-0" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full disabled:opacity-50"
              />
            </div>

            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2.5">
              <FiLock className="text-gray-400 text-base shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(sanitizeInput(e.target.value));
                  setPasswordError("");
                }}
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 disabled:opacity-50"
              >
                {showPassword ? (
                  <FiEye className="text-base" />
                ) : (
                  <FiEyeOff className="text-base" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
            <button
              className="mt-1 w-full bg-gray-900 hover:bg-gray-700 active:scale-95 transition-all text-white text-sm font-semibold rounded-lg py-2.5 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
