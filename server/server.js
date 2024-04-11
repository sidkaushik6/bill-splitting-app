require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const authRoutes = require('./routes/auth.routes');
const orderRoutes = require('./routes/orders.routes');
const friendRoutes = require('./routes/friends.routes');
const usersRoutes = require('./routes/users.routes');

const verifyToken = require('./middleware/auth.middleware');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000', // client URL
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(express.json());
app.use(cors()); // This line requires the 'cors' module

// MongoDB connection
mongoose.connect('mongodb://localhost/bill-splitting-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/friends', friendRoutes);
app.use('/api/orders',verifyToken, orderRoutes);
app.use('/api/friends', verifyToken, friendRoutes);
app.use('/api/users', verifyToken, usersRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});