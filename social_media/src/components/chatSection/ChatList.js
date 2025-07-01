import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PhoneIcon, VideoCameraIcon, EllipsisVerticalIcon, PaperClipIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const ChatList = ({ activeTab }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [messages, setMessages] = useState([]);

  // Sample messages for demonstration
  const sampleMessages = {
    1: [
      { id: 1, text: "Hey, how are you?", sender: "them", time: "10:30 AM" },
      { id: 2, text: "I'm good, thanks! How about you?", sender: "me", time: "10:31 AM" },
      { id: 3, text: "Doing great! Just working on some new features.", sender: "them", time: "10:32 AM" },
      { id: 4, text: "That sounds interesting! What kind of features?", sender: "me", time: "10:33 AM" },
      { id: 5, text: "Mostly UI improvements and some new animations.", sender: "them", time: "10:34 AM" }
    ],
    2: [
      { id: 1, text: "See you tomorrow!", sender: "them", time: "9:45 AM" },
      { id: 2, text: "Yes, looking forward to it!", sender: "me", time: "9:46 AM" }
    ],
    3: [
      { id: 1, text: "The meeting is at 2 PM", sender: "them", time: "Yesterday" },
      { id: 2, text: "Got it, I'll be there!", sender: "me", time: "Yesterday" }
    ],
    4: [
      { id: 1, text: "Thanks for your help!", sender: "them", time: "Yesterday" },
      { id: 2, text: "No problem, happy to help!", sender: "me", time: "Yesterday" }
    ],
    5: [
      { id: 1, text: "Can we reschedule?", sender: "them", time: "Monday" },
      { id: 2, text: "Sure, what time works for you?", sender: "me", time: "Monday" }
    ]
  };

  const regularChats = [
    {
      id: 1,
      name: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      lastMessage: 'Hey, how are you?',
      lastMessageTime: '10:30 AM',
      unread: 2,
      status: 'Online',
      profile: {
        bio: 'Software Developer | Coffee Lover',
        location: 'New York, USA',
        joined: '2023'
      }
    },
    {
      id: 2,
      name: 'Michael Brown',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      lastMessage: 'See you tomorrow!',
      lastMessageTime: '9:45 AM',
      unread: 0,
      status: 'Last seen 5m ago',
      profile: {
        bio: 'UX Designer | Travel Enthusiast',
        location: 'London, UK',
        joined: '2022'
      }
    },
    {
      id: 3,
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      lastMessage: 'The meeting is at 2 PM',
      lastMessageTime: 'Yesterday',
      unread: 1,
      status: 'Online',
      profile: {
        bio: 'Marketing Manager | Foodie',
        location: 'Paris, France',
        joined: '2023'
      }
    },
    {
      id: 4,
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      lastMessage: 'Thanks for your help!',
      lastMessageTime: 'Yesterday',
      unread: 0,
      status: 'Last seen 1h ago',
      profile: {
        bio: 'Product Manager | Tech Enthusiast',
        location: 'San Francisco, USA',
        joined: '2022'
      }
    },
    {
      id: 5,
      name: 'Sophia Chen',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
      lastMessage: 'Can we reschedule?',
      lastMessageTime: 'Monday',
      unread: 3,
      status: 'Online',
      profile: {
        bio: 'Data Scientist | Yoga Instructor',
        location: 'Tokyo, Japan',
        joined: '2023'
      }
    }
  ];

  const groupChats = [
    {
      id: 101,
      name: 'Design Team',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop',
      lastMessage: 'Meeting at 3 PM',
      lastMessageTime: '11:30 AM',
      memberCount: 8,
      profile: {
        description: 'Official design team discussion group',
        created: '2023',
        admin: 'Sarah Wilson'
      }
    },
    {
      id: 102,
      name: 'Project Alpha',
      avatar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=150&h=150&fit=crop',
      lastMessage: 'New features discussion',
      lastMessageTime: '10:15 AM',
      memberCount: 12,
      profile: {
        description: 'Project Alpha development team',
        created: '2023',
        admin: 'Michael Brown'
      }
    }
  ];

  useEffect(() => {
    setSelectedChat(null);
  }, [activeTab]);

  useEffect(() => {
    const initialChats = activeTab === 'all' ? regularChats : groupChats;
    setChats(initialChats);
  }, [activeTab]);

  useEffect(() => {
    if (selectedChat) {
      setMessages(sampleMessages[selectedChat.id] || []);
    }
  }, [selectedChat]);

  const handleChatSelect = (chat) => {
    setIsAnimating(true);
    setSelectedChat(chat);
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Chat List */}
      <div className={`w-full md:w-1/3 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden transition-all duration-300 ease-in-out md:ml-8 ${
        selectedChat ? 'hidden md:block' : 'block'
      }`}>
        <div className="overflow-y-auto h-full custom-scrollbar">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatSelect(chat)}
              className={`flex items-center p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50/80 ${
                selectedChat?.id === chat.id ? 'bg-purple-50' : ''
              }`}
            >
              <div className="flex items-center w-full">
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100"
                  />
                  {chat.unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {chat.unread}
                    </span>
                  )}
                  {activeTab === 'all' && (
                    <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      chat.status === 'Online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></span>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{chat.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                    </div>
                    <div className="flex flex-col items-end ml-2">
                      <span className="text-xs text-gray-500 whitespace-nowrap">{chat.lastMessageTime}</span>
                      {chat.unread > 0 && (
                        <span className="mt-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedChat ? (
        <div className={`flex-1 flex flex-col bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] md:ml-8 md:mr-4 overflow-hidden transform transition-all duration-300 ease-in-out ${
          isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}>
          {/* Chat Header */}
          <div className="flex-none border-b border-gray-100 p-4 flex items-center justify-between bg-white">
            <div className="flex items-center">
              <button 
                onClick={() => setSelectedChat(null)}
                className="md:hidden mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <img
                src={selectedChat.avatar}
                alt={selectedChat.name}
                className="w-12 h-12 rounded-full ring-2 ring-purple-100"
              />
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-gray-900">{selectedChat.name}</h2>
                <p className="text-sm text-purple-600">
                  {activeTab === 'groups' ? `${selectedChat.memberCount} members` : selectedChat.status}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 mb-[80px] md:mb-0">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <PhoneIcon className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <VideoCameraIcon className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Chat Messages - Scrollable area */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-0">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${message.sender === 'me' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-2xl px-4 py-2`}>
                    <p className="text-sm">{message.text}</p>
                    <span className={`text-xs mt-1 block ${message.sender === 'me' ? 'text-purple-200' : 'text-gray-500'}`}>
                      {message.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Input - Fixed at bottom */}
          <div className="flex-none border-t border-gray-100 p-4 bg-white">
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <PaperClipIcon className="h-5 w-5 text-gray-600" />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200">
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-white ml-8 mr-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="text-center animate-fadeIn">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No chat selected</h3>
            <p className="mt-1 text-sm text-gray-500">Select a chat to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatList; 