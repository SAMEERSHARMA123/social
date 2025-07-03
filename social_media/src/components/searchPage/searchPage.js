import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { FOLLOW_AND_UNFOLLOW } from '../../graphql/mutations'; // ✅ make sure path is correct

import { FaSearch, FaUser, FaTimes, FaArrowLeft, FaEnvelope, FaPhone, FaCalendar } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const navigate = useNavigate();
  const token = sessionStorage.getItem('user');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
  }, [recentSearches]);

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSuggestions(true);
      return;
    }

    setIsLoading(true);
    setShowSuggestions(false);

    const graphqlQuery = `
      query searchUsers($username: String!) {
        searchUsers(username: $username) {
          id
          name
          username
          email
          phone
          profileImage
          bio
          createTime
          followers { id name }
          following { id name }
          posts { id caption imageUrl createdAt }
        }
      }
    `;

    try {
      const response = await axios.post(
        'http://localhost:5000/graphql',
        { query: graphqlQuery, variables: { username: query } },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      const { data, errors } = response.data;

      if (errors && errors.length > 0) {
        setSearchResults([]);
      } else if (data?.searchUsers) {
        const validUsers = data.searchUsers.filter(user => user && user.id && user.name).map(user => ({
          ...user,
          name: user.name || 'Unknown User',
          username: user.username || '',
          email: user.email || '',
          phone: user.phone || '',
          profileImage: user.profileImage || '',
          bio: user.bio || '',
          createTime: user.createTime || new Date().toISOString(),
          followers: user.followers || [],
          following: user.following || [],
          posts: user.posts || []
        }));

        setSearchResults(validUsers);

        validUsers.forEach(user => {
          if (!recentSearches.find(item => item.id === user.id)) {
            setRecentSearches(prev => [user, ...prev.slice(0, 4)]);
          }
        });
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchResults([]);
      setShowSuggestions(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSuggestions(true);
    setSelectedUser(null);
    setShowUserDetails(false);
  };

  const removeRecentSearch = (id) => {
    setRecentSearches(prev => prev.filter(item => item.id !== id));
  };

  const handleRecentSearchClick = (user) => {
    setSearchQuery(user.name);
    handleSearch(user.name);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
    setShowUserDetails(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="relative max-w-2xl mx-auto flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              <span className="font-medium">Back</span>
            </button>
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search for users by name or username..."
                value={searchQuery}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full h-12 px-12 pr-24 rounded-full border-2 border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-gray-700 placeholder-gray-400 text-center"
                autoFocus
              />
              {/* Search Icon */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 mt-2">
                <FaSearch className="text-lg" />
              </div>
              {/* Search Button */}
              <button
                onClick={() => handleSearch()}
                disabled={isLoading || !searchQuery.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-4 py-1.5 rounded-full hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-sm mb-1 mt-4"
              >
                {isLoading ? '...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Search Results and Suggestions */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600">Searching for users...</p>
          </div>
        )}
        {/* Search Results */}
        {!isLoading && searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Search Results ({searchResults.length})
            </h2>
            {searchResults.map((user) => (
              <UserCard key={user.id} user={user} onClick={() => handleUserClick(user)} />
            ))}
          </div>
        )}
        {/* No Results */}
        {!isLoading && searchQuery && searchResults.length === 0 && (
          <div className="text-center py-12">
            <FaUser className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No users found</h3>
          </div>
        )}
        {/* Recent Searches */}
        {!isLoading && !searchQuery && showSuggestions && recentSearches.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Searches</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentSearches.map((user) => (
                <RecentSearchCard
                  key={user.id}
                  user={user}
                  onClick={() => handleRecentSearchClick(user)}
                  onRemove={() => removeRecentSearch(user.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={closeUserDetails}
          updateUser={(updatedUser) => setSelectedUser(updatedUser)}
        />
      )}
    </div>
  );
};

const UserCard = ({ user, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
  >
    <div className="flex items-center space-x-4">
      {/* Profile Image */}
      <div className="flex-shrink-0">
        <img
          src={user.profileImage || 'https://ui-avatars.com/api/?name=User&background=random'}
          alt={user.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
        />
      </div>
      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
          {user.username && (
            <span className="text-sm text-gray-500">@{user.username}</span>
          )}
        </div>
        {user.bio && (
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{user.bio}</p>
        )}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          {user.followers && <span>{user.followers.length} followers</span>}
          {user.following && <span>{user.following.length} following</span>}
          {user.posts && <span>{user.posts.length} posts</span>}
        </div>
      </div>
      {/* Action Button */}
      <div className="flex-shrink-0">
        <button 
          onClick={e => { e.stopPropagation(); onClick(); }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          View Profile
        </button>
      </div>
    </div>
  </div>
);

const RecentSearchCard = ({ user, onClick, onRemove }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3" onClick={onClick}>
        <img
          src={user.profileImage || 'https://ui-avatars.com/api/?name=User&background=random'}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h4 className="font-medium text-gray-900">{user.name}</h4>
          {user.username && <p className="text-sm text-gray-500">@{user.username}</p>}
        </div>
      </div>
      <button
        onClick={onRemove}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <FaTimes />
      </button>
    </div>
  </div>
);

const UserDetailsModal = ({ user, onClose, updateUser }) => {
  const [followUser] = useMutation(FOLLOW_AND_UNFOLLOW);
  const loggedInUserId = JSON.parse(sessionStorage.getItem('user'))?.id;
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (user?.followers?.some(f => f.id === loggedInUserId)) {
      setIsFollowing(true);
    }
  }, [user, loggedInUserId]);

  const handleFollowToggle = async () => {
    try {
      const { data } = await followUser({ variables: { id: user.id } });
      const updatedUser = data?.followAndUnfollow;
      if (updatedUser) {
        setIsFollowing(updatedUser.followers.some(f => f.id === loggedInUserId));
        if (updateUser) updateUser(updatedUser);
      }
    } catch (err) {
      console.error("Follow/Unfollow error:", err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">User Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-6 mb-6">
            <img
              src={user.profileImage || 'https://via.placeholder.com/100x100?text=User'}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
            />
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{user.name || 'Unknown User'}</h3>
              {user.username && <p className="text-lg text-gray-600 mb-2">@{user.username}</p>}
              {user.bio && <p className="text-gray-700 mb-3">{user.bio}</p>}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{user.followers?.length || 0} followers</span>
                <span>{user.following?.length || 0} following</span>
                <span>{user.posts?.length || 0} posts</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            Close
          </button>
          <button
            onClick={handleFollowToggle}
            className={`${
              isFollowing ? 'bg-gray-300 hover:bg-gray-400 text-gray-800' : 'bg-purple-600 hover:bg-purple-700 text-white'
            } px-6 py-2 rounded-lg transition-colors`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
