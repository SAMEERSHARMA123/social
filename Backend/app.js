const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const { ApolloServer } = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import DB connection, typedefs, resolvers
const DB = require('./DB/db');
const typeDefs = require('./GraphQL/typeDefs');
const resolvers = require('./GraphQL/resolvers');

// Connect to MongoDB
DB();

const app = express();
app.use(cookieParser()); // ✅ Cookie parser middleware
const port = process.env.PORT || 5000;

// ✅ Global CORS (for non-GQL routes)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// ✅ File upload middleware
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }));

// ✅ Apollo Server Setup
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
     
      const token = req.cookies.token;

      if (!token) return { req, res };

      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return { req, res, user }; // ✅ user + res in context
      } catch (err) {
        return { req, res };
      }
    },
  });

  await server.start();

  // ✅ Apollo middleware with CORS
  server.applyMiddleware({
    app,
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });

  // ✅ Optional health check
  app.get('/', (req, res) => {
    res.send('🚀 Server is running...');
  });

  // ✅ Start Express server
  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  });
}

startServer();
