const bcrypt = require('bcryptjs');
const User = require('../Models/user');
const { sendOtpMail } = require('../Utils/otp');
const { user_token } = require('../Utils/token');
require('dotenv').config();

const { GraphQLUpload } = require('graphql-upload');
const Post = require('../Models/Post');
const { uploadToCloudinary } = require('../Utils/cloudinary');

// In-memory OTP storage
const otpStore = {};

setInterval(() => {
  const now = new Date();
  Object.keys(otpStore).forEach(email => {
    if (otpStore[email].expiry < now) delete otpStore[email];
  });
}, 5 * 60 * 1000);

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    users: async () => await User.find().select('id name username email phone profileImage bio createTime'),

    getAllPosts: async () => await Post.find().sort({ createdAt: -1 }),

    searchUsers: async (_, { username }) => {
      try {
        console.log('Searching for users with term:', username);
        
        // Search by name or username (case insensitive)
        const users = await User.find({
          $or: [
            { name: { $regex: username, $options: 'i' } },
            { username: { $regex: username, $options: 'i' } }
          ]
        }).select('id name username email phone profileImage bio createTime followers following posts')
          .populate('followers', 'id name')
          .populate('following', 'id name')
          .populate('posts', 'id caption imageUrl createdAt')
          .limit(10); // Limit results to 10 users
        
        console.log('Found users:', users.length);
        console.log('First user data:', users[0] ? {
          id: users[0]._id,
          name: users[0].name,
          username: users[0].username,
          email: users[0].email,
          phone: users[0].phone,
          profileImage: users[0].profileImage,
          bio: users[0].bio,
          createTime: users[0].createTime,
          followersCount: users[0].followers?.length || 0,
          followingCount: users[0].following?.length || 0,
          postsCount: users[0].posts?.length || 0
        } : 'No users found');
        
        return users;
      } catch (error) {
        console.error('Search users error:', error);
        throw new Error('Failed to search users');
      }
    },

    suggestedUsers: async (_, { userId }) => {
      const currentUser = await User.findById(userId).populate("following");
      const userFollowings = currentUser.following.map(u => u._id.toString());
      const potentialSuggestionsMap = {};

      for (let followedUserId of userFollowings) {
        const followedUser = await User.findById(followedUserId).populate("following");
        followedUser.following.forEach(targetUser => {
          const id = targetUser._id.toString();
          if (id !== userId && !userFollowings.includes(id) && id !== currentUser._id.toString()) {
            potentialSuggestionsMap[id] = (potentialSuggestionsMap[id] || 0) + 1;
          }
        });
      }

      const suggestedUserIds = Object.entries(potentialSuggestionsMap)
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => id);

      return await User.find({ _id: { $in: suggestedUserIds } });
    },
  },

  Mutation: {
    requestOtp: async (_, { name, username, email, password, phone }) => {
      if (await User.findOne({ email })) throw new Error('User with this email already exists');
      if (await User.findOne({ username })) throw new Error('Username already taken');

      const otp = Math.floor(100000 + Math.random() * 900000);
      await sendOtpMail(email, otp);

      otpStore[email] = {
        otp,
        name,
        username,
        email,
        password,
        phone,
        expiry: new Date(Date.now() + 2 * 60 * 1000),
      };

      return { email, otp, otpExpiryTime: otpStore[email].expiry };
    },

    registerUser: async (_, { email, otp }, { res }) => {
      const entry = otpStore[email];
      if (!entry) throw new Error('No OTP requested');
      if (new Date() > entry.expiry) throw new Error('OTP expired');
      if (parseInt(otp) !== entry.otp) throw new Error('OTP not matched');
      if (await User.findOne({ email: entry.email })) throw new Error('User already exists');

      const user = new User({
        name: entry.name,
        username: entry.username,
        email: entry.email,
        password: await bcrypt.hash(entry.password, 10),
        phone: entry.phone,
        otp: entry.otp,
        createTime: new Date(),
        otpExpiryTime: entry.expiry,
      });

      await user.save();
      delete otpStore[email];

      const token = user_token(user);
      res.cookie("token", token);

      return user;
    },

    login: async (_, { email, password }, { res }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error('Invalid credentials');

      const token = user_token(user);
      res.cookie("token", token);
      return user;
    },

    logout: async (_, __, { res }) => {
      res.clearCookie("token");
      return "User logged out successfully";
    },

    changePassword: async (_, { email, oldPassword, newPassword }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) throw new Error('Old password incorrect');

      user.password = await bcrypt.hash(newPassword, 6);
      await user.save();
      return 'Password updated successfully';
    },

    createPost: async (_, { id, caption, image }) => {
      const imageUrl = await uploadToCloudinary(image);
      return await Post.create({ caption, imageUrl, createdBy: id });
    },

    editProfile: async (_, { id, username, name, caption, image }) => {
      const user = await User.findById(id);
      if (!user) throw new Error("User not found");
      if (name) user.name = name;
      if (username) user.username = username;
      if (caption) user.bio = caption;
      if (image) user.profileImage = await uploadToCloudinary(image);
      await user.save();
      return user;
    },

    followAndUnfollow: async (_, { id }, context) => {
      if (!context?.user?.id) throw new Error("Unauthorized");
      const reqUserId = context.user.id;
      if (reqUserId === id) throw new Error("You cannot follow yourself");

      const [currentUser, targetUser] = await Promise.all([
        User.findById(reqUserId),
        User.findById(id),
      ]);

      if (!currentUser || !targetUser) throw new Error("User not found");

      const isFollowing = currentUser.following.includes(id);

      if (isFollowing) {
        await Promise.all([
          User.updateOne({ _id: reqUserId }, { $pull: { following: id } }),
          User.updateOne({ _id: id }, { $pull: { followers: reqUserId } }),
        ]);
      } else {
        await Promise.all([
          User.updateOne({ _id: reqUserId }, { $push: { following: id } }),
          User.updateOne({ _id: id }, { $push: { followers: reqUserId } }),
        ]);
      }

      return targetUser;
    },

    getUserInformation : async(_,{id}) => {
       const user = await User.findById(id);
      if (!user) throw new Error("User not found");
      return user;
    }
  }
};

module.exports = resolvers;

