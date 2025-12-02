import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpVerify from "./pages/OtpVerify";
import Home from "./pages/Home"; // <--- Import Home

export default function App() {
  return (
    <div className="min-h-screen w-full relative bg-white">
      {/* (Giữ nguyên phần Background Effect cũ của bạn) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage: `
            radial-gradient(
              circle at top center,
              rgba(70, 130, 180, 0.5),
              transparent 70%
            )
          `,
          filter: "blur(80px)",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative z-10"> {/* Bọc z-10 để nội dung nổi lên trên nền */}
        <BrowserRouter>
          <Routes>
            {/* Mặc định vào login */}

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verifyotp" element={<OtpVerify />} />

            {/* Thêm route Home */}
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}