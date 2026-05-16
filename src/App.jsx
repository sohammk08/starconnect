import Home from "./pages/Home";
import Login from "./pages/Login";
import { auth, db } from "../firebase";
import Nav from "./components/Nav";
import Landing from "./pages/Landing";
import Settings from "./pages/Settings";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";
import { useState, useEffect } from "react";
import Documentation from "./pages/Documentation";
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { AuthContext } from "./context/Auth/AuthContext";
import { useContext } from "react";

function App() {
  const { currentUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [userDocID, setUserDocID] = useState("");
  const [userState, setUserState] = useState(false);

  // Set user authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserState(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    // Fetch username
    const fetchUsername = async () => {
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
          });
        }
      } catch (error) {
        alert(error.message);
      }
    };

    fetchUsername();
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
                exact
                path="/"
                element={userState ? <Home username={username} /> : <Landing />}
              />
              <Route
                path="/add-contact"
                element={
                  userState ? <Home username={username} /> : <Register />
                }
              />
              <Route
                path="/:contact"
                element={
                  userState ? <Home username={username} /> : <Register />
                }
              />
              <Route
                path="/archive"
                element={
                  userState ? <Home username={username} /> : <Register />
                }
              />
              <Route
                path="/archive/:contact"
                element={
                  userState ? <Home username={username} /> : <Register />
                }
              />
              <Route path="/documentation" element={<Documentation />} />
              <Route
                path="/settings"
                element={
                  userState ? (
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
                  userState ? <Home username={username} /> : <Register />
                }
              />
              <Route
                path="/login"
                element={userState ? <Home username={username} /> : <Login />}
              />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
