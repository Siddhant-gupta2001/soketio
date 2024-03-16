import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const port = 3000;
const secretKeyJwT = "adddhddhdhdhdhd";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/login", (req, res) => {
  const token = jwt.sign({ _id: "asdsjshsgssfsg" }, secretKeyJwT);

  res
    .cookie("token", token, { httpOnly: false, secure: true, sameSite: "none" })
    .json({
      message: "login success"
    });
});

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, (err) => {
    if (err) return next(err);

    const token = socket.request.cookies.token;
    if (!token) return next(new Error("Authentication Error"));

    jwt.verify(token, secretKeyJwT, (err, decoded) => {
      if (err) return next(new Error("Authentication Error"));
      // Use decoded if needed
      next();
    });
  });
});

io.on("connection", (socket) => {
  console.log("User Connected");
  console.log("Id", socket.id);

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    socket.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`user joined room ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});




// import express from "express";
// import { Server } from "socket.io";
// import {createServer} from "http"
// import cors from "cors"
// import jwt from "jsonwebtoken"
// import cookieParser from "cookie-parser";

// const port= 3000;
// const secretKeyJwT= "adddhddhdhdhdhd"

// const app = express();
// const server= createServer(app);

// const io = new Server(server, {
//     cors:{
//         origin:"http://localhost:5173",
//         methods:["GET", "POST"],
//         credentials:true
//     }
// })

// app.get("/", (req,res)=> {
//     res.send("Hello world");
// })

// app.get("/login", (req, res) => {
//   const token=  jwt.sign({_id: "asdsjshsgssfsg"}, secretKeyJwT)

//   res
//   .cookie("token", token, {httpOnly:false, secure:true, sameSite:"none"})
//   .json({
//     message:"login success"});
 
// })

// // const user= false;

// // io.use((socket, next) => {
// //     if(user) next();
// // })

// const user = false;

// io.use((socket, next) => {
//     cookieParser()(socket.request, socket.request.res, (err) => {
//         if(err) return next(errr);

//         const token= socket.request.cookies.token;
//         if (!token) return next(new Error("Authentication Error"));

//         const decoded= jwt.verify(token, secretKeyJwT);
//         next();
//     });
//     if(user) next()
// })

// io.on("connection", (socket) => {
//     console.log("User Connected");
//     console.log("Id", socket.id);

//     socket.on("message", ({room, message}) => {
//         console.log({room, message})
//         // io.emit("receive-message", data);
//         // socket.broadcast.emit("receive-message", data);
//         // io.to(room).emit("receive-message", message);
//         socket.to(room).emit("receive-message", message);
//     })

//     socket.on("join-room", (room) => {
//         socket.join(room);
//         console.log(`user joined room ${room}`)
//     });
//     // socket.emit("welcome", `Welcome to the server`)
//     // socket.broadcast.emit("welcome", ` ${socket.id} joined to the server`);
//     socket.on("disconnect", () => {
//         console.log("User Disconnected", socket.id);
//     })
// })

// server.listen(port, ()=> {
//     console.log(`server is running on port ${port}`);
// })