import Home from "./pages/Home";
import Login from "./pages/Login";
import { auth } from "../firebase";
import Nav from "./components/Nav";
import Landing from "./pages/Landing";
import Settings from "./pages/Settings";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";
import { useState, useEffect } from "react";
import Documentation from "./pages/Documentation";
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [userState, setUserState] = useState(false);

  // Set user authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserState(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex h-screen w-screen">
      <Router>
        <div className="flex h-screen w-screen bg-white dark:bg-black">
          <div className="grow items-center">
            <Routes>
              <Route
                exact
                path="/"
                element={userState ? <Home /> : <Landing />}
              />
              <Route
                path="/new"
                element={userState ? <Home /> : <Register />}
              />
              <Route
                path="/:contact"
                element={userState ? <Home /> : <Register />}
              />
              <Route
                path="/archive"
                element={userState ? <Home /> : <Register />}
              />
              <Route
                path="/archive/:contact"
                element={userState ? <Home /> : <Register />}
              />
              <Route path="/documentation" element={<Documentation />} />
              <Route
                path="/settings"
                element={userState ? <Settings /> : <Register />}
              />
              <Route
                path="/register"
                element={userState ? <Home /> : <Register />}
              />
              <Route path="/login" element={userState ? <Home /> : <Login />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
