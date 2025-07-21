import { Server as SocketIoServer } from "socket.io";

const setupSocket = (server) => {
    const io = new SocketIoServer(server, {
        cors: {
            origin: process.env.origin,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    const userSocketMap = new Map();

    const handleDisconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };
};

export default setupSocket;
