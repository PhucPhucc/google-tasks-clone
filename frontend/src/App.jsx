import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // <--- Import
import "react-toastify/dist/ReactToastify.css"; // <--- Import CSS

import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpVerify from "./pages/OtpVerify";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <div className="min-h-screen w-full relative bg-white">
      {/* Background Effect */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage: `radial-gradient(circle at top center, rgba(70, 130, 180, 0.5), transparent 70%)`,
          filter: "blur(80px)",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative z-10">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verifyotp" element={<OtpVerify />} />
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </div>


      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}