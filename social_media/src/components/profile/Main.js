import React, { useState, useRef, useLayoutEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import UserInfo from "./UserInfo";
import Tabs from "./Tabs";
import PhotoGrid from "./PhotoGrid";
import ShortsGrid from "./ShortsGrid";
import { MdVideoLibrary } from 'react-icons/md';
import { useQuery } from '@apollo/client';
import { GET_ALL_POSTS } from '../../graphql/mutations';

const shortsVideos = [
  "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162617474-5b5e00f447af?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162617474-5b5e00f447af?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162617474-5b5e00f447af?auto=format&fit=crop&w=800&q=80",
];

export default function Main() {
  const [activeTab, setActiveTab] = useState(0); // 0: Feeds, 1: Shorts, 2: Tag
  const tabRefs = [useRef(null), useRef(null), useRef(null)];
  const [underline, setUnderline] = useState(null);
  const [isFollowed, setIsFollowed] = useState(false);
  
  // Convert profile to state for dynamic updates
  const [profile, setProfile] = useState(() => {
    
    // Load profile from localStorage if available, otherwise use default
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }
    return {
      id: "122221112",
      name: "Katty Abrohams",
      avatar: "https://randomuser.me/api/portraits/women/8.jpg",
      cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=cover&w=800&q=80",
      bio: "Embracing the mountain air \uD83C\uDFD4\uFE0F\nContent creator \uD83D\uDCF8",
      stats: {
        followers: 0,
        following: 0,
        posts: 0,
      },
    };
  });
  // Function to update profile data
  const updateProfile = (updates) => {
    setProfile(prev => {
      const newProfile = { ...prev, ...updates };
      // Save to localStorage
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      return newProfile;
    });
  };

  useLayoutEffect(() => {
    const node = tabRefs[activeTab].current;
    if (node) {
      setUnderline({ left: node.offsetLeft, width: node.offsetWidth });
    }
  }, [activeTab]);

  // Set initial underline position for Feeds tab
  useLayoutEffect(() => {
    const node = tabRefs[0].current;
    if (node && !underline) {
      setUnderline({ left: node.offsetLeft, width: node.offsetWidth });
    }
  }, [underline]);

  // Fetch posts from backend
  const { data, loading, error } = useQuery(GET_ALL_POSTS);
  const photos = data && data.getAllPosts ? data.getAllPosts.map(post => post.imageUrl) : [];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center w-full text-xs sm:text-sm md:text-base overflow-x-hidden">
      <ProfileHeader profile={profile} updateProfile={updateProfile} />
      <div className="h-8 xs:h-10 sm:h-14" />
      <UserInfo profile={profile} setProfile={setProfile} isFollowed={isFollowed} setIsFollowed={setIsFollowed} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabRefs={tabRefs} />
      <div className="w-full max-w-md px-1 xs:px-2 sm:px-4 py-2 xs:py-4 sm:py-6">
        {loading && <div>Loading...</div>}
        {error && <div>Error loading posts</div>}
        {activeTab === 0 ? (
          <PhotoGrid photos={photos} />
        ) : activeTab === 1 ? (
          <ShortsGrid shortsVideos={shortsVideos} />
        ) : (
          <PhotoGrid photos={photos} />
        )}
      </div>
    </div>
  );
}




// import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
// import ProfileHeader from "./ProfileHeader";
// import UserInfo from "./UserInfo";
// import Tabs from "./Tabs";
// import PhotoGrid from "./PhotoGrid";
// import ShortsGrid from "./ShortsGrid";
// import { MdVideoLibrary } from "react-icons/md";
// import { useQuery } from "@apollo/client";
// import { GET_ALL_POSTS, GET_USER_INFO } from "../../graphql/mutations";
// import { GetTokenFromCookie } from "../getToken/GetToken";

// const shortsVideos = [
//    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
//    "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80",
//    "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=800&q=80",
//    "https://images.unsplash.com/photo-1611162617474-5b5e00f447af?auto=format&fit=crop&w=800&q=80",
//    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
//    "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80",
//   "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=800&q=80",
//   "https://images.unsplash.com/photo-1611162617474-5b5e00f447af?auto=format&fit=crop&w=800&q=80",
//   "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
//   "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80",
//   "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=800&q=80",
//    "https://images.unsplash.com/photo-1611162617474-5b5e00f447af?auto=format&fit=crop&w=800&q=80",
// ];

// export default function Main() {
//   const [activeTab, setActiveTab] = useState(0);
//   const tabRefs = [useRef(null), useRef(null), useRef(null)];
//   const [underline, setUnderline] = useState(null);
//   const [isFollowed, setIsFollowed] = useState(false);
//   const [profile, setProfile] = useState(null);

//   // Get user ID from token
//   const decodedUser = GetTokenFromCookie();
//   const userId = decodedUser?.id;

//   // GraphQL: get user information
//   const {
//     data: userData,
//     loading: userLoading,
//     error: userError,
//   } = useQuery(GET_USER_INFO, {
//     variables: { id: userId },
//     skip: !userId,
//   });

//   // Set profile once data is fetched
//   useEffect(() => {
//     if (userData?.getUserInformation) {
//       const user = userData.getUserInformation;
//       const newProfile = {
//         id: user.id,
//         name: user.name,
//         avatar: user.profileImage || "https://randomuser.me/api/portraits/lego/1.jpg",
//         cover:
//           "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=cover&w=800&q=80",
//         bio: user.bio,
//         stats: {
//           followers: user.followers.length,
//           following: user.following.length,
//           posts: user.posts.length,
//         },
//       };
//       setProfile(newProfile);
//       localStorage.setItem("userProfile", JSON.stringify(newProfile));
//     }
//   }, [userData]);

//   // Tab underline animation
//   useLayoutEffect(() => {
//     const node = tabRefs[activeTab].current;
//     if (node) {
//       setUnderline({ left: node.offsetLeft, width: node.offsetWidth });
//     }
//   }, [activeTab]);

//   useLayoutEffect(() => {
//     const node = tabRefs[0].current;
//     if (node && !underline) {
//       setUnderline({ left: node.offsetLeft, width: node.offsetWidth });
//     }
//   }, [underline]);

//   // Posts
//   const { data, loading, error } = useQuery(GET_ALL_POSTS);
//   const photos = data?.getAllPosts?.map((post) => post.imageUrl) || [];

//   if (userLoading || !profile) return <div className="text-center mt-10">Loading profile...</div>;
//   if (userError) return <div className="text-center mt-10 text-red-500">Failed to load user</div>;

//   return (
//     <div className="min-h-screen bg-white flex flex-col items-center w-full text-xs sm:text-sm md:text-base overflow-x-hidden">
//       <ProfileHeader profile={profile} updateProfile={setProfile} />
//       <div className="h-8 xs:h-10 sm:h-14" />
//       <UserInfo profile={profile} setProfile={setProfile} isFollowed={isFollowed} setIsFollowed={setIsFollowed} />
//       <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabRefs={tabRefs} />
//       <div className="w-full max-w-md px-1 xs:px-2 sm:px-4 py-2 xs:py-4 sm:py-6">
//         {loading && <div>Loading posts...</div>}
//         {error && <div>Error loading posts</div>}
//         {activeTab === 0 ? (
//           <PhotoGrid photos={photos} />
//         ) : activeTab === 1 ? (
//           <ShortsGrid shortsVideos={shortsVideos} />
//         ) : (
//           <PhotoGrid photos={photos} />
//         )}
//       </div>
//     </div>
//   );
// }

