import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import TestPage from "./components/TestPage";
import Dashboard from "./components/Dashboard";
import UserProfilePage from "./components/UserProfile";
import ModalProvider from "./components/ModalProvider";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <ModalProvider />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
