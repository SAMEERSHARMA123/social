import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Sidebar from "../sidebar/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchIconClick = () => {
    navigate('/search');
  };

  const onMenuClick = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-[60]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left - Logo and Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onMenuClick}
                className="p-2 hover:bg-purple-100 rounded-md transition-all duration-300 md:hidden"
                aria-label="Menu"
              >
                <div className="w-6 h-6 grid grid-cols-2 gap-1">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <span
                      key={idx}
                      className="w-2.5 h-2.5 bg-purple-600 rounded-sm hover:scale-90 transition-all duration-300"
                    ></span>
                  ))}
                </div>
              </button>
              <Link to="/" className="text-2xl font-bold text-purple-600">
                Social
              </Link>
            </div>

            {/* Right - Search & Profile */}
            <div className="flex items-center space-x-4">
              {/* Search Icon */}
              <button
                onClick={handleSearchIconClick}
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <FaSearch className="text-xl" />
              </button>

              {/* Profile Picture */}
              <Link to="/profile" className="block">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover border-2 border-purple-500 hover:border-purple-600 transition-colors"
                />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default Navbar;
