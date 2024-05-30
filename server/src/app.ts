import express from "express";
import http from "http";
import socket from "./socket";
import configDotenv from "dotenv";
import cors from "cors";
import * as path from "node:path";
configDotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
// const io = new Server(server);
socket(server);

const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, '../../client/dist')));
console.log(path.join(__dirname, '../../client/dist'));


app.get("/api", function (req, res) {
  res.status(200).json({ message: "Hello from the API!" });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
