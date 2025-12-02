import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import hook điều hướng
import { registerAPI } from "../api/auth"; // Import API

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);

    // 1. State lưu dữ liệu form
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    // 2. Hàm xử lý đăng ký
    const handleRegister = async (e) => {
        e.preventDefault();

        // Validate cơ bản phía client (tùy chọn)
        if (!username || !email || !password) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        try {
            // Gọi API
            const res = await registerAPI(email, password, username);

            // Nếu thành công (Backend trả về 201)
            if (res.data.success) {
                alert(res.data.message || "Đăng ký thành công!");
                navigate("/login"); // Chuyển hướng về trang đăng nhập
            }
        } catch (err) {
            console.error("Lỗi đăng ký:", err);
            // Hiển thị lỗi từ Backend trả về
            const errorMsg = err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!";
            alert(errorMsg);
        }
    };

    return (
        <div className="min-h-screen w-full relative flex items-center justify-center p-4">

            {/* --- SIGNUP CARD --- */}
            <div className="bg-white w-full max-w-[450px] rounded-2xl shadow-2xl z-10 py-20 sm:py-32 px-10 sm:px-14 relative flex flex-col justify-center">

                {/* Title */}
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 font-itim">
                    My Trello
                </h2>

                {/* Form: Thêm onSubmit */}
                <form className="space-y-5" onSubmit={handleRegister}>
                    {/* 1. Username Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder=" "
                            value={username} // Binding state
                            onChange={(e) => setUsername(e.target.value)} // Cập nhật state
                            className="peer w-full px-4 py-2.5 border border-gray-400 rounded-lg text-gray-800 text-base focus:outline-none focus:border-cyan-800 focus:border-2 focus:ring-0"
                        />
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-cyan-800 pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-800">
                            Your Name
                        </label>
                    </div>

                    {/* 2. Email Input */}
                    <div className="relative">
                        <input
                            type="email"
                            placeholder=" "
                            value={email} // Binding state
                            onChange={(e) => setEmail(e.target.value)} // Cập nhật state
                            className="peer w-full px-4 py-2.5 border border-gray-400 rounded-lg text-gray-800 text-base focus:outline-none focus:border-cyan-800 focus:border-2 focus:ring-0"
                        />
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-cyan-800 pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-800">
                            Email
                        </label>
                    </div>

                    {/* 3. Password Input */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder=" "
                            value={password} // Binding state
                            onChange={(e) => setPassword(e.target.value)} // Cập nhật state
                            className="peer w-full px-4 py-2.5 border border-gray-400 rounded-lg text-gray-800 text-base focus:outline-none focus:border-cyan-800 focus:border-2 focus:ring-0"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-cyan-800 pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-800">
                            Password
                        </label>
                    </div>

                    {/* Signup Button */}
                    <button
                        type="submit"
                        className="hover:cursor-pointer w-full bg-cyan-700 hover:bg-cyan-800 text-white text-base font-bold py-2.5 rounded-lg transition duration-200"
                    >
                        Sign up
                    </button>
                </form>

                {/* Divider "or" */}
                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-3 text-sm text-gray-400 font-medium">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Google Button */}
                <button className="hover:cursor-pointer w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition text-gray-700 text-base font-bold">
                    <FcGoogle size={22} />
                    Continue with Google
                </button>

                {/* Footer Link */}
                <div className="text-center mt-6 text-sm text-gray-600 font-medium">
                    Already have an account?{" "}
                    <a href="/login" className="hover:cursor-pointer text-cyan-800 font-bold underline hover:text-cyan-900">
                        Login
                    </a>
                </div>

            </div>
        </div>
    );
};

export default Register;