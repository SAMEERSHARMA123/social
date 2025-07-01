import React, { useEffect, useRef } from "react";
import Navbar from "../navbar/Navbar";
import StoryBar from "../storyBar/Storybar";
import FooterNav from "../footer/FooterNav";
import SocialPost from "../socialPost/SocialPost";
import CombinedLogin from "../login/CombinedLogin";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ALL_POSTS } from '../../graphql/mutations';

const Main = () => {
  const storyBarRef = useRef(null);
  const token = sessionStorage.getItem('user');
  const navigate = useNavigate();

  const scrollStories = (direction) => {
    const scrollAmount = 150;
    if (storyBarRef.current) {
      storyBarRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  // Fetch posts from backend
  const { data, loading, error } = useQuery(GET_ALL_POSTS);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="pt-16 pb-20 md:ml-64"> {/* Added margin-left for sidebar on desktop */}
        <div className="max-w-4xl mx-auto px-4">
          {/* Story Bar */}
          <div className="bg-white shadow-sm mb-4 rounded-lg">
            <StoryBar storyBarRef={storyBarRef} scrollStories={scrollStories} />
          </div>

          {/* Footer */}
          <div className="mb-4">
            <FooterNav />
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {loading && <div>Loading...</div>}
            {error && <div>Error loading posts</div>}
            {data && data.getAllPosts && data.getAllPosts.map((post) => (
              <SocialPost
                key={post.id}
                avatarSrc={"https://i.pravatar.cc/150?img=4"} // Placeholder, replace with user avatar if available
                username={post.createdBy || "User"} // Placeholder, replace with user name if available
                handle={"@user"} // Placeholder, replace with user handle if available
                postImageSrc={post.imageUrl}
                initialLikes={0}
                initialComments={0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
