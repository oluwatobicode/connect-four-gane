import { BrowserRouter, Route, Routes } from "react-router";

import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

import Rules from "./pages/Rules";
import Start from "./pages/Start";
import Game from "./pages/Game";
import GameProvider from "./contexts/GameProvider";
import Levels from "./pages/Levels";
import Onboarding from "./pages/Onboarding";
import { SignUp } from "./pages/SignUp";
import { Login } from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import NewPassword from "./pages/NewPassword";
import Profile from "./pages/Profile";
import LeaderboardPage from "./pages/LeaderboardPage";
import { AuthProvider } from "./contexts/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              border: "3px solid #000000",
              borderRadius: "16px",
              background: "#ffffff",
              color: "#000000",
              fontWeight: "700",
            },
          }}
        />
        <Analytics />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<NewPassword />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/start" element={<Start />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/game" element={<Game />} />
              <Route path="/levels" element={<Levels />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
