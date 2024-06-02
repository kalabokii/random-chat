import { Server, Socket } from "socket.io";
import http from "http";

interface User {
  id: string;
  name: string;
  image: string;
}

interface Message {
  id: string;
  sender: User;
  content: string;
  createdAt: string;
}

const nicks = [
  "Bubblesnack",
  "Captain Quirk",
  "Sir Chucklehead",
  "Snickerdoodle",
  "Dr. Chuckles",
  "Gigglesaurus",
  "WhimsyWombat",
  "BananaPeeler",
  "NoodleNinja",
  "Chuckleberry Finn",
  "QuirkMaster",
  "WackyWizard",
  "ChuckleChamp",
  "TicklishTornado",
  "LaughingLlama",
  "JollyJalapeno",
  "Chucklezilla",
  "GuffawGuru",
  "ChuckleCheetah",
  "BubblyBuffoon",
];

const images = [
  "https://static.wikia.nocookie.net/iceage/images/d/d3/Roshan.png",
  "https://static.wikia.nocookie.net/iceage/images/2/24/Sid_Sloth.png",
  "https://static.wikia.nocookie.net/iceage/images/2/2e/Manny_full_size.png",
  "https://static.wikia.nocookie.net/iceage/images/e/e9/Shira_Ice_Age.png",
  "https://static.wikia.nocookie.net/iceage/images/7/74/Buck3.webp",
  "https://static.wikia.nocookie.net/iceage/images/e/ec/Scrat_Ice_Age.png",
  "https://static.wikia.nocookie.net/iceage/images/2/2f/Diego4.png",
  "https://static.wikia.nocookie.net/iceage/images/e/e8/Peaches1.png",
];

let usersQue: User[] = [];
let users: User[] = [];
let activeChats: [User, User][] = [];

const timeout = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    const user = {
      name: nicks[Math.floor(Math.random() * nicks.length)],
      image: images[Math.floor(Math.random() * images.length)],
      id: socket.id,
      adress: socket.handshake.address,
    };

    users.push(user);
    io.emit("user-count", users.length);
    socket.emit("welcome", user);
    let friend: User | undefined = undefined;

    // ? find a friend on request or add user to que
    socket.on("find friend", () => {
      friend = usersQue.find((user) => user.id !== socket.id);
      if (friend !== undefined) {
        activeChats.push([user, friend]);
        usersQue = usersQue.filter(
          (user) => user.id !== friend?.id && user.id !== socket.id,
        );
        io.to(friend.id).emit("friend found", user);
        io.to(user.id).emit("new chat", friend);
        io.to(friend.id).emit("new chat", user);
      } else {
        usersQue.push(user);
      }
    });

    // ? when a friend is found
    socket.on("friend found", (user: User) => {
      friend = user;
    });

    // ? when one of the users disconnects from a chat
    socket.on("disconnected", () => {
      activeChats = activeChats.filter(
        (chat) => !chat.some((u) => u.id === socket.id),
      );
      if (friend === undefined) return;
      io.to(friend?.id).emit("disconnected");
      friend = undefined;
    });

    // ? when a user disconnects from the server
    socket.on("disconnect", () => {
      if (friend !== undefined) {
        activeChats = activeChats = activeChats.filter(
          (chat) => !chat.some((u) => u.id === socket.id),
        );
        io.to(friend?.id).emit("disconnected");
      }
      users = users.filter((u) => u.id !== socket.id);
      usersQue = usersQue.filter((u) => u.id !== socket.id);
      io.emit("user-count", users.length);
    });

    // ? when a user sends a message
    socket.on("chat message", (msg: Message) => {
      if (friend) {
        io.to(friend.id).emit("chat message", msg);
        return;
      }
      io.to(socket.id).emit("disconnected");
      console.error("friend not found");
      activeChats = activeChats.filter(
        (members) => !members.some((u) => u.id === socket.id),
      );
    });

    //  ? message delivery
    socket.on("delivered", (msg_id: string) => {
      if (!friend) return;
      io.to(friend?.id).emit("delivered", msg_id);
    });

    socket.on("music", (videoId: string) => {
      if (!friend) return;
      io.to(friend?.id).emit("music", videoId);
    });

    socket.on("play", (videoId: string) => {
      if (!friend) return;
      io.to(friend?.id).emit("play", videoId);
    });

    socket.on("pause", () => {
      if (!friend) return;
      io.to(friend?.id).emit("pause");
    });

    socket.on("playNext", () => {
      if (!friend) return;
      io.to(friend?.id).emit("playNext");
    });

    socket.on("playPrevious", () => {
      if (!friend) return;
      io.to(friend?.id).emit("playPrevious");
    });

    socket.on("jumpTo", (time: number) => {
      if (!friend) return;
      io.to(friend?.id).emit("jumpTo", time);
    });

    socket.on("addToQueue", (video: any) => {
      if (!friend) return;
      io.to(friend?.id).emit("addToQueue", video);
    });
  });
};
