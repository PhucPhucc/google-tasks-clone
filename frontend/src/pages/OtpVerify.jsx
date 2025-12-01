import React from "react";
import { Link } from "react-router-dom";

const OtpVerify = () => {
    return (
        <div className="min-h-screen w-full bg-[#541c24] relative flex items-center justify-center p-4">
            
            {/* Background Effect */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle 500px at 50% 100px, rgba(255, 255, 255, 0.08), transparent)`,
                }}
            />

            {/* --- OTP CARD --- */}
            <div className="bg-white w-full max-w-[400px] rounded-2xl shadow-2xl z-10 px-8 py-10 relative flex flex-col justify-center">

                {/* Title */}
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8 font-itim">
                    Enter OTP
                </h2>

                <form className="space-y-6">

                    {/* OTP Input Group */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-[#9c0f22]">
                            OTP *
                        </label>
                        
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 text-base focus:outline-none focus:border-[#9c0f22] focus:border-2 focus:ring-0 placeholder-gray-400"
                        />
                        
                        {/* Helper text màu đỏ nhỏ bên dưới */}
                        <span className="text-xs text-[#9c0f22] font-medium">
                            has been sent to your email
                        </span>
                    </div>

                    {/* Verify Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#9c0f22] hover:bg-[#7f0a1b] text-white text-lg font-bold py-2.5 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                    >
                        Verify
                    </button>
                </form>

                <div className="text-center mt-6">
                    <Link to="/login" className="text-sm text-gray-500 hover:text-[#9c0f22] font-medium transition">
                        ← Back to Login
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default OtpVerify;