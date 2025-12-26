import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import { RxHamburgerMenu } from "react-icons/rx";
import { MdLogout, MdPersonOutline } from "react-icons/md";

const Header = ({ toggleSidebar, user, isProfilePage = false }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_display_name");
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
    <header className="bg-white/80 backdrop-blur-md h-16 flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0 z-40 relative sticky top-0">
      <div className="flex items-center gap-4">
        
        {/* --- SỬA LOGIC Ở ĐÂY: Dùng class invisible để giữ chỗ --- */}
        <button
          onClick={isProfilePage ? undefined : toggleSidebar}
          className={`p-2 rounded-full transition 
            ${isProfilePage 
                ? "invisible cursor-default" // Tàng hình nhưng vẫn chiếm chỗ
                : "hover:bg-gray-100 cursor-pointer text-gray-600"
            }`}
        >
          <RxHamburgerMenu size={24} />
        </button>

        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-blue-600 font-itim">
            My Trello
          </h2>
        </div>
      </div>

      {/* Phần Avatar bên phải giữ nguyên */}
      <div className="flex items-center gap-2 text-gray-600">
        {user && (
          <div className="relative ml-2" ref={menuRef}>
            <div
              className="cursor-pointer p-1 rounded-full hover:bg-gray-100 transition"
              onClick={() => {
                setShowMenu(!showMenu);
                setShowTooltip(false);
              }}
              onMouseEnter={() => !showMenu && setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="w-8 h-8 bg-cyan-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-transparent hover:ring-gray-200 select-none">
                {user.username?.charAt(0).toUpperCase()}
              </div>
            </div>

            

            {showMenu && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.15)] border border-gray-100 py-2 z-50 animate-zoom-in origin-top-right">
                <div className="px-4 py-3 border-b border-gray-100 mb-1 flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-700 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 select-none">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-800 truncate">{user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>

                <button 
                    onClick={() => navigate("/profile")} 
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition hover:cursor-pointer"
                >
                  <MdPersonOutline size={20} className="text-gray-500" />
                  Hồ sơ của bạn
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition hover:cursor-pointer"
                >
                  <MdLogout size={20} className="text-gray-500" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;