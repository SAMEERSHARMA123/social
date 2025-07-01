import React, { useEffect, useState } from "react";
import { FaHome, FaPlus, FaHeart, FaCommentDots, FaTimes } from "react-icons/fa";
import { MdVideoLibrary } from "react-icons/md";
import { BsCameraFill } from "react-icons/bs";
import { FaTowerBroadcast } from "react-icons/fa6";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { GetTokenFromCookie } from '../getToken/GetToken';
import { useMutation } from "@apollo/client";
import { CREATE_POST, GET_ALL_POSTS } from "../../graphql/mutations";
import { useChat } from '../../context/ChatContext';

const FloatingMenu = ({ isOpen, toggleMenu, setShowUploadForm }) => {
  const menuItems = [
    { icon: <MdOutlineVideoLibrary className="text-lg md:text-xl" />, label: "Reels Post", angle: -60 },
    { icon: <BsCameraFill className="text-lg md:text-xl" />, label: "Photo Post", angle: 0 },
    { icon: <FaTowerBroadcast className="text-lg md:text-xl" />, label: "Go Live", angle: 60 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2">
          <div className="relative">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ scale: 0, y: 0, x: 0 }}
                animate={{
                  scale: 1,
                  y: Math.cos((item.angle * Math.PI) / 180) * -50,
                  x: Math.sin((item.angle * Math.PI) / 180) * 50,
                }}
                exit={{
                  scale: 0,
                  y: 0,
                  x: 0,
                  transition: {
                    duration: 0.15,
                    ease: "easeInOut",
                    delay: index * 0.01,
                  },
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
                onClick={() => {
                  if (item.label === "Photo Post") {
                    setShowUploadForm(true);
                  }
                  toggleMenu();
                }}
                className="absolute left-1/2 -translate-x-1/2 bg-white/30 backdrop-blur-md text-black w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg hover:scale-110 hover:bg-purple-600 hover:text-white transition-all duration-200 flex items-center justify-center border border-white/20"
              >
                {item.icon}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

const FooterNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";
  const { selectedChat } = useChat();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState();

  // Hide FooterNav on mobile/tablet if on chat page and a chat is open
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  useEffect(() => {
    const checkScreen = () => {
      setIsMobileOrTablet(window.innerWidth <= 1024);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  useEffect(() => {
    const decodedUser = GetTokenFromCookie();
    setUser(decodedUser);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [createPost] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: GET_ALL_POSTS }],
  });

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!user.id || !caption || !image) return;
    setIsUploading(true);
    try {
      await createPost({
        variables: {
          id: user.id,
          caption,
          image,
        },
      });
      setIsUploading(false); // Loader stops before alert
      setShowUploadForm(false);
      setCaption("");
      setImage(null);
      setTimeout(() => {
        alert("Post uploaded ✅");
      }, 100); // Alert after state updates
    } catch (err) {
      setIsUploading(false);
      console.error(err);
      alert("Upload failed ❌");
    }
  };

  if (isChatPage && isMobileOrTablet && selectedChat) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center z-50">
      <FloatingMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} setShowUploadForm={setShowUploadForm} />

      <footer className="w-[400px] max-w-[90%] bg-white/30 backdrop-blur-md rounded-full px-8 py-4 flex justify-between items-center shadow-lg border border-white/20">
        <button
          onClick={() => navigate("/")}
          className="bg-white/50 backdrop-blur-sm text-black p-3 rounded-full shadow hover:bg-purple-600 hover:text-white active:bg-purple-700 active:text-white transition-all duration-200"
        >
          <FaHome className="text-xl" />
        </button>
        <button className="bg-white/50 backdrop-blur-sm text-black p-3 rounded-full shadow hover:bg-purple-600 hover:text-white active:bg-purple-700 active:text-white transition-all duration-200">
          <MdVideoLibrary className="text-xl" />
        </button>
        <motion.button
          onClick={toggleMenu}
          whileTap={{ scale: 0.9 }}
          className={`bg-white/50 backdrop-blur-sm text-black p-3 rounded-full shadow hover:bg-purple-600 active:bg-purple-700 transition-all duration-200 ${isMenuOpen ? "bg-purple-600" : ""}`}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isMenuOpen ? 135 : 0 }}
            transition={{ duration: 0.01, ease: "easeInOut" }}
          >
            <FaPlus className="text-2xl" />
          </motion.div>
        </motion.button>
        <button className="bg-white/50 backdrop-blur-sm text-black p-3 rounded-full shadow hover:bg-purple-600 hover:text-white active:bg-purple-700 active:text-white transition-all duration-200">
          <FaHeart className="text-xl" />
        </button>
        <button
          onClick={() => navigate("/chat")}
          className={`bg-white/50 backdrop-blur-sm p-3 rounded-full shadow hover:bg-purple-600 hover:text-white active:bg-purple-700 active:text-white transition-all duration-200 ${isChatPage ? "bg-purple-600 text-white" : "text-black"}`}
        >
          <FaCommentDots className="text-xl" />
        </button>
      </footer>

      {showUploadForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-[90%] max-w-md relative border border-purple-100">
            <button
              onClick={() => setShowUploadForm(false)}
              className="absolute top-3 right-3 text-gray-700 hover:text-red-500 bg-white/60 rounded-full p-2 shadow-md transition-colors"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-purple-700 text-center tracking-wide">Create Post</h2>
            <form onSubmit={handlePostSubmit} className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-3 mb-2 border-2 border-purple-200 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg placeholder-gray-400 shadow-sm"
              />
              <div className="mb-2">
                {!image ? (
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-36 rounded-2xl cursor-pointer bg-white/40 backdrop-blur-md border-2 border-dashed border-purple-300 relative overflow-hidden group transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                    style={{ boxShadow: '0 4px 32px 0 rgba(168,139,250,0.10)' }}
                  >
                    {/* Animated Gradient Border on Hover */}
                    <span className="pointer-events-none absolute inset-0 rounded-2xl border-4 border-transparent group-hover:border-purple-400 group-hover:animate-pulse-gradient z-10" style={{transition:'border 0.3s'}}></span>
                    {/* Animated Shimmer on Hover */}
                    <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-100 via-white to-purple-100 opacity-0 group-hover:opacity-60 group-hover:animate-shimmer z-0" />
                    {/* Upload Icon with bounce on hover */}
                    <svg className="w-14 h-14 text-purple-400 mb-2 z-20 group-hover:animate-bounce-slow transition-all" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"></path></svg>
                    {/* Text with gradient and scale on hover */}
                    <span className="text-lg font-bold text-purple-600 group-hover:text-white group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 z-20 group-hover:scale-110">Choose an image</span>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                      className="hidden"
                    />
                    {/* Custom Animations Keyframes */}
                    <style>{`
                      @keyframes shimmer {
                        0% { background-position: -400px 0; }
                        100% { background-position: 400px 0; }
                      }
                      .animate-shimmer {
                        background-size: 800px 100%;
                        animation: shimmer 1.5s linear infinite;
                      }
                      @keyframes pulse-gradient {
                        0%, 100% { box-shadow: 0 0 0 0 rgba(168,139,250,0.3); }
                        50% { box-shadow: 0 0 16px 4px rgba(168,139,250,0.5); }
                      }
                      .animate-pulse-gradient {
                        animation: pulse-gradient 1.2s infinite;
                      }
                      @keyframes bounce-slow {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                      }
                      .animate-bounce-slow {
                        animation: bounce-slow 1.2s infinite;
                      }
                    `}</style>
                  </label>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-full h-36 border-2 border-dashed border-green-400 rounded-2xl bg-green-50 relative shadow-inner overflow-hidden">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Selected Preview"
                        className="w-full h-full object-cover rounded-2xl shadow"
                      />
                    </div>
                    <div className="flex gap-4 mt-3 justify-center">
                      <button
                        type="button"
                        onClick={() => setImage(null)}
                        className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 text-sm shadow"
                      >
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </div>
              <button
                type="submit"
                className="bg-white text-purple-600 border-2 border-purple-600 px-6 py-3 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-200 flex items-center justify-center min-w-[120px] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-purple-600 hover:text-white hover:scale-105 hover:shadow-2xl"
                disabled={isUploading}
              >
                {!isUploading && 'Upload'}
                {isUploading && (
                  <span className="w-6 h-6 border-2 border-white border-t-purple-600 rounded-full animate-spin inline-block"></span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterNav;
