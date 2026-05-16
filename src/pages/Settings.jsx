import { FiEdit3 } from "react-icons/fi";
import { GoSignOut } from "react-icons/go";
import { FaArrowLeft } from "react-icons/fa";
import { useState, useContext } from "react";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { HiOutlineIdentification } from "react-icons/hi";
import { AuthContext } from "../context/Auth/AuthContext";

function Settings({ username, handleUpdateUsername, handleLogOut }) {
  let navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [newUsername, setNewUsername] = useState("");

  return (
    <div className="relative bg-white/80 h-screen flex justify-center items-center">
      <div className="absolute top-4 left-4">
        {currentUser ? (
          <button
            className="flex bg-black font-medium p-2 items-center text-sm text-white/80 gap-2 rounded-xl cursor-pointer"
            onClick={() => navigate("/")}
            title="Navigate to Home"
          >
            <FaArrowLeft />
            Back to Home
          </button>
        ) : (
          <Nav />
        )}
      </div>
      <div className="flex flex-col bg-black justify-center items-center p-5 w-6xl text-white rounded-xl">
        <h2 className="text-3xl font-bold mb-4 font-doto">
          Hey, <span className="text-blue-500 italic">{username}</span>
        </h2>
        <div className="p-5 border border-lg border-neutral-600 rounded ">
          <div className="flex items-center gap-3 mb-3">
            <IoMdSettings className="text-blue-600 text-4xl" />
            <div className="flex flex-col">
              <h2 className="text-xl font-medium">Settings</h2>
              <p className="text-sm max-w-3xl text-gray-400">
                Manage and personalize your <bold>Star Connect</bold>{" "}
                experience. Update your account information, adjust preferences,
                and more to stay connected, <i>always</i>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-3">
            {/* Username update */}
            <div className="p-3 border border-neutral-600 rounded-lg space-y-1.5">
              <div className="flex items-center gap-1">
                <HiOutlineIdentification className="text-blue-600 text-2xl" />
                <h3 className="font-medium text-lg">Account</h3>
              </div>
              <p className="text-sm max-w-3xl text-gray-400">
                You can update your username by putting in the updated username
                below and click update.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Enter new username"
                  className="flex-1 min-w-0 p-2 font-medium text-sm text-white placeholder:text-gray-300 border border-gray-600 rounded-lg bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                <button
                  disabled={!newUsername}
                  onClick={() => handleUpdateUsername(newUsername)}
                  className={`py-2 px-3 rounded-lg font-medium text-sm whitespace-nowrap transition-all shrink-0 ${
                    newUsername
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                      : "bg-gray-200 dark:bg-neutral-700 text-gray-500 dark:text-gray-600 cursor-not-allowed"
                  }`}
                >
                  <FiEdit3 className="inline mr-1.5" />
                  Update
                </button>
              </div>
            </div>

            {/* Sign Out */}
            <div className="p-3 border border-neutral-600 rounded-lg space-y-1.5">
              <div className="flex items-center gap-1">
                <GoSignOut className="text-blue-600 text-2xl" />
                <h3 className="font-medium text-lg">Sign Out</h3>
              </div>
              <p className="text-sm max-w-3xl text-gray-400">
                Click the Sign Out button to log out of your account. You can
                always log back in :)
              </p>
              <button
                onClick={() => {
                  handleLogOut();
                }}
                className="my-auto flex items-center font-medium justify-center px-4.5 py-1.5 cursor-pointer rounded-lg border border-red-500 hover:border-red-600 hover:text-red-600 text-sm text-white dark:hover:text-red-500 transition-all duration-300"
              >
                <GoSignOut className="inline mr-1.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
