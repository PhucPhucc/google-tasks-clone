import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import { RxHamburgerMenu } from "react-icons/rx";
import { MdOutlineTaskAlt, MdLogout, MdPersonOutline } from "react-icons/md";
import { FiSettings, FiHelpCircle } from "react-icons/fi";
import { IoMdApps } from "react-icons/io";

const Header = ({ toggleSidebar, user }) => {
  const navigate = useNavigate();
  
  // State quản lý hiển thị
  const [showMenu, setShowMenu] = useState(false);     
  const [showTooltip, setShowTooltip] = useState(false); 
  
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md h-16 flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0 z-40 relative">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className=" hover:cursor-pointer p-2 hover:bg-gray-200 rounded-full transition"
        >
          <RxHamburgerMenu size={24} className="text-gray-600" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-700 font-itim">
            My Trello
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-gray-600">
        
        
        {/* --- AVATAR USER AREA --- */}
        {user && (
          <div className="relative ml-2" ref={menuRef}>
            
            {/* 1. Avatar Circle */}
            <div 
                className="cursor-pointer p-1 rounded-full hover:bg-gray-100 transition"
                onClick={() => {
                    setShowMenu(!showMenu);
                    setShowTooltip(false);
                }}
                onMouseEnter={() => !showMenu && setShowTooltip(true)} 
                onMouseLeave={() => setShowTooltip(false)}
            >
                <div className="w-8 h-8 bg-cyan-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-transparent hover:ring-gray-200">
                    {user.username.charAt(0).toUpperCase()}
                </div>
            </div>

            {/* 2. HOVER TOOLTIP (LIGHT MODE) */}
            {showTooltip && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white text-gray-800 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.15)] p-5 z-50 animate-fadeIn border border-gray-200 pointer-events-none">
                    <div className="text-xs font-medium text-gray-500 mb-3 text-center">Tài khoản Google</div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-20 h-20 bg-cyan-700 rounded-full flex items-center justify-center text-white font-bold text-4xl mb-2 shadow-sm">
                             {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-gray-800 font-bold text-lg">{user.username}</div>
                        <div className="text-gray-500 text-sm">{user.email || "user@example.com"}</div>
                    </div>
                </div>
            )}

            {/* 3. CLICK MENU (Hiện khi click) */}
            {showMenu && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.15)] border border-gray-100 py-2 z-50 animate-zoom-in origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-100 mb-1 flex items-center gap-3">
                         <div className="w-10 h-10 bg-cyan-700 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                             {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-800 truncate">{user.username}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition">
                        <MdPersonOutline size={20} className="text-gray-500"/>
                        Hồ sơ của bạn
                    </button>
                    
                    <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition"
                    >
                        <MdLogout size={20} className="text-gray-500"/>
                        Đăng xuất
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>
                    
                
                </div>
            )}

          </div>
        )}
      </div>
    </header>
  );
};

export default Header;