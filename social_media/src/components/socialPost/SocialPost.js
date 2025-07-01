import React, { useState } from "react";
import { FaHeart, FaComment, FaPaperPlane } from "react-icons/fa";

const SocialPost = ({ avatarSrc, username, handle, postImageSrc, initialLikes, initialComments }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [commentCount, setCommentCount] = useState(initialComments);
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const handleLike = () => {
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
  };

  const handleCommentClick = () => {
    setShowCommentInput(!showCommentInput);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newCommentText.trim()) {
      setComments((prev) => [...prev, { id: Date.now(), username: "You", text: newCommentText.trim() }]);
      setCommentCount(commentCount + 1);
      setNewCommentText("");
    }
  };

  return (
    <div className="m-4 rounded-lg shadow bg-white">
      <div className="flex items-center gap-3 px-4 py-2">
        <img src={avatarSrc} alt="avatar" className="w-11 h-11 rounded-full object-cover" />
        <div>
          <div className="font-bold">{username}</div>
          <div className="text-sm text-gray-500">{handle}</div>
        </div>
      </div>
      <img src={postImageSrc} alt="post" className="w-full max-h-96 object-cover rounded-lg" />
      <div className="flex justify-around py-3 text-sm text-gray-700">
        <button onClick={handleLike} className="flex items-center gap-1 cursor-pointer">
          <FaHeart className={isLiked ? "text-red-500" : ""} />
          <span>{likes.toLocaleString()}</span>
        </button>
        <button onClick={handleCommentClick} className="flex items-center gap-1 cursor-pointer">
          <FaComment />
          <span>{commentCount.toLocaleString()}</span>
        </button>
        <div className="flex items-center gap-1">
          <FaPaperPlane />
          <span>9.8K</span>
        </div>
      </div>

      {showCommentInput && (
        <form onSubmit={handleCommentSubmit} className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
            />
            <button
              type="submit"
              className="bg-purple-600 text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-purple-700 cursor-pointer"
            >
              Post
            </button>
          </div>
        </form>
      )}

      {comments.length > 0 && (
        <div className="px-4 pb-4">
          {comments.map((comment) => (
            <div key={comment.id} className="mt-2 text-sm">
              <span className="font-bold">{comment.username}:</span> {comment.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialPost; 