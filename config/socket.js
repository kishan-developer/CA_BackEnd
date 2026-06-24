const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.1.6:3000",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join user-specific room
    socket.on("join", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Join role-specific rooms
    socket.on("joinRole", (role) => {
      socket.join(`role_${role}`);
      console.log(`User joined role room: ${role}`);
    });

    // Join department-specific rooms
    socket.on("joinDepartment", (department) => {
      socket.join(`dept_${department}`);
      console.log(`User joined department room: ${department}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

// Helper function to send notification to specific user
const sendNotificationToUser = (userId, notification) => {
  const io = getIO();
  io.to(`user_${userId}`).emit("notification", notification);
};

// Helper function to send notification to specific role
const sendNotificationToRole = (role, notification) => {
  const io = getIO();
  io.to(`role_${role}`).emit("notification", notification);
};

// Helper function to send notification to specific department
const sendNotificationToDepartment = (department, notification) => {
  const io = getIO();
  io.to(`dept_${department}`).emit("notification", notification);
};

// Helper function to broadcast to all
const broadcastNotification = (notification) => {
  const io = getIO();
  io.emit("notification", notification);
};

module.exports = {
  initializeSocket,
  getIO,
  sendNotificationToUser,
  sendNotificationToRole,
  sendNotificationToDepartment,
  broadcastNotification,
};
