import Login from "./pages/Login";
import Nav from "./components/Nav";
import Landing from "./pages/Landing";
import StarConnect from "./StarConnect";
import Settings from "./pages/Settings";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";
import Documentation from "./pages/Documentation";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const userState = false;

  return (
    <div className="flex h-screen w-screen">
      <Router>
        <div className="flex h-screen w-screen bg-white dark:bg-black">
          {userState && <Nav />}
          <div className="grow items-center">
            <Routes>
              <Route
                exact
                path="/"
                element={userState ? <StarConnect /> : <Landing />}
              />
              <Route
                path="/new"
                element={userState ? <StarConnect /> : <Register />}
              />
              <Route
                path="/:contact"
                element={userState ? <StarConnect /> : <Register />}
              />
              <Route
                path="/archive"
                element={userState ? <StarConnect /> : <Register />}
              />
              <Route
                path="/archive/:contact"
                element={userState ? <StarConnect /> : <Register />}
              />
              <Route path="/documentation" element={<Documentation />} />
              <Route
                path="/settings"
                element={userState ? <Settings /> : <Register />}
              />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
