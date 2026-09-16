import { canJoinRoom } from "./roomAccess.js";
const getMembership = async ({ roomId, userId }) => {

    return null;
};
socket.on("join-room", async (roomId) => {
    const result = await canJoinRoom({
        user: socket.user,
        roomId,
        getMembership,
    });

    if (!result.allowed) {
        socket.emit("join-room:error", {
            code: result.code,
            message: result.message,
        });

        return;
    }

    const authorizedRoomId = result.roomId;

    if (!roomUsers.has(authorizedRoomId)) {
        roomUsers.set(authorizedRoomId, new Map());
    }

    roomUsers.get(authorizedRoomId).set(socket.id, {
        socketId: socket.id,
        userId: socket.user.id,
        name: socket.user.name,
    });

    socket.join(authorizedRoomId);

    const usersInRoom = Array.from(
        roomUsers.get(authorizedRoomId).values()
    );

    io.to(authorizedRoomId).emit(
        "room-users",
        usersInRoom
    );

    console.log(
        `${socket.id} joined room ${authorizedRoomId}`
    );
});