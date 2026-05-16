import {
  doc,
  where,
  query,
  getDocs,
  updateDoc,
  collection,
} from "firebase/firestore";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Nav from "./components/Nav";
import Landing from "./pages/Landing";
import { auth, db } from "../firebase";
import Settings from "./pages/Settings";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";
import Documentation from "./pages/Documentation";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./context/Auth/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Helper to avoid repetition in Home routes
const HomeOr = ({ userState, username, fallback, contactAvatarPreference }) =>
  userState ? (
    <Home
      username={username}
      contactAvatarPreference={contactAvatarPreference}
    />
  ) : (
    fallback
  );

function App() {
  const [labels, setLabels] = useState([]);
  const [username, setUsername] = useState("");
  const [userDocID, setUserDocID] = useState("");
  // Set user authentication status
  const { currentUser } = useContext(AuthContext);
  const [contactAvatarPreference, setContactAvatarPreference] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    // Fetch user doc
    const fetchUserDoc = async () => {
      try {
        if (currentUser?.email) {
          const nameQuery = query(
            collection(db, "users"),
            where("email", "==", currentUser.email),
          );
          const querySnapshot = await getDocs(nameQuery);
          querySnapshot.forEach((doc) => {
            setUsername(doc.data().username);
            setUserDocID(doc.id);
            setContactAvatarPreference(
              doc.data().contactAvatarPreference ?? "filled-color",
            );
            setLabels(doc.data().contactLabels);
          });
        }
      } catch (error) {
        alert(error.message);
      }
    };

    fetchUserDoc();
  }, [currentUser]);

  // Update username
  const handleUpdateUsername = async (newUsername) => {
    if (!userDocID) {
      alert("User data not loaded. Please refresh");
      return;
    }
    const uc = doc(db, "users", userDocID);
    await updateDoc(uc, { username: newUsername });
    alert("Username updated succesfully! (refresh to see changes)");
  };

  // Log Out
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <Router>
        <div className="flex h-screen w-screen bg-white dark:bg-black">
          <div className="grow items-center">
            <Routes>
              <Route
                path="/"
                element={
                  <HomeOr
                    userState={!!currentUser}
                    username={username}
                    contactAvatarPreference={contactAvatarPreference}
                    fallback={<Landing />}
                  />
                }
              />
              <Route
                path="/add-contact"
                element={
                  <HomeOr
                    userState={!!currentUser}
                    username={username}
                    contactAvatarPreference={contactAvatarPreference}
                    fallback={<Register />}
                  />
                }
              />
              <Route
                path="/:contact"
                element={
                  <HomeOr
                    userState={!!currentUser}
                    username={username}
                    contactAvatarPreference={contactAvatarPreference}
                    fallback={<Register />}
                  />
                }
              />
              <Route
                path="/archive"
                element={
                  <HomeOr
                    userState={!!currentUser}
                    username={username}
                    contactAvatarPreference={contactAvatarPreference}
                    fallback={<Register />}
                  />
                }
              />
              <Route
                path="/archive/:contact"
                element={
                  <HomeOr
                    userState={!!currentUser}
                    username={username}
                    contactAvatarPreference={contactAvatarPreference}
                    fallback={<Register />}
                  />
                }
              />
              <Route
                path="/settings"
                element={
                  currentUser ? (
                    <Settings
                      username={username}
                      handleLogOut={handleLogout}
                      handleUpdateUsername={handleUpdateUsername}
                    />
                  ) : (
                    <Register />
                  )
                }
              />
              <Route
                path="/register"
                element={
                  <HomeOr
                    userState={!!currentUser}
                    username={username}
                    contactAvatarPreference={contactAvatarPreference}
                    fallback={<Register />}
                  />
                }
              />
              <Route
                path="/login"
                element={
                  <HomeOr
                    userState={!!currentUser}
                    username={username}
                    contactAvatarPreference={contactAvatarPreference}
                    fallback={<Login />}
                  />
                }
              />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
