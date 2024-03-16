import React, { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { Button, Container, TextField, Typography, Stack } from '@mui/material'

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000", {
    withCredentials:true,
  }), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  console.log(messages)

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault()
    socket.emit('join-room', roomName)
    setRoomName("")
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id)
      console.log("connected", socket.id);
    })

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    })

    socket.on("welcome", (s) => {
      console.log(s);
    })

    return () => {
      socket.disconnect();
    };
  }, [socket])

  return (
    <Container maxwidth="sm">
      <Typography variant="h1" component="div" gutterBottom>
        Welcome to socket.io
        {socketId}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />

        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>
      <form onSubmit={handleSubmit}>
        <TextField value={message}
          onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label="message" variant="outlined" />

        <TextField value={room}
          onChange={(e) => setRoom(e.target.value)} id="outlined-basic" label="Room" variant="outlined" />
        <Button type="submit" variant="contained" color="primary">send</Button>
      </form>

      <Stack>
        {messages.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;





// import React, { useEffect, useState, useMemo} from "react";
// import { io } from "socket.io-client";
// import { Button, Container, TextField, Typography, Stack} from '@mui/material'

// const App = () => {
//   const socket = useMemo(() => io("http://localhost:3000"), ({
//      withCredentials:true,
//   }),[]);

//   const [message, setMessage] = useState("");
//   const [room, setRoom] = useState("");
//   const [socketId, setSocketId] = useState("");
//   const [messages, setMessages] = useState([])
//   const [roomName, setRoomName] = useState("");

//   console.log(messages)

//   const handleSubmit = (e) => {
//      e.preventDefault();
//      socket.emit("message", {message, room});
//      setMessage("");
//   };

//   const joinRoomHandler = (e) => {
//     e.preventDefault()
//     socket.emit('join-room', roomName)
//     setRoomName("")
//   }

//   useEffect(() => {
//     socket.on("connect", () => {
//       setSocketId(socket.id)
//       console.log("connected", socket.id);
//      })

//     socket.on("receive-message", (data) => {
//        console.log(data);
//        setMessages((messages) => [...messages, data]);
//     })

//     socket.on("welcome", (s) => {
//       console.log(s);
//     })

//     return () => {
//       socket.disconnect();
//     };
//   }, [])

//   return (
//      <Container maxwidth="sm">
//      {/* <Box sx= {{height:500}} /> */}
//       <Typography variant="h1" component="div" gutterBottom>
//         Welcome tosocket.io
//         {socketId}
//       </Typography>
      
//       <form onSubmit={joinRoomHandler}>
//         <h5>Join Room</h5>
//       <TextField
//        value={roomName}
//        onChange={(e) => setRoomName(e.target.value)}
//        id="outlined-basic"
//        label="Room Name"
//        varient="outlined"

//        />

//        <Button type="submit" varient="contained" color="primary">
//         Join
//        </Button>
//        </form>
//       <form onSubmit={handleSubmit}>
//         <TextField value={message}
//         onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label="message" varient="outlined"/>

//         <TextField value={room}
//         onChange={(e) => setRoom(e.target.value)} id="outlined-basic" label="Room" varient="outlined"/>
//         <Button type="submit" varient="contained" color="primary">send</Button>
//       </form>

//       <Stack>
//         {messages.map((m,i) => (
//           <Typography key={i} varient="h6" component="div" gutterBottom>
//             {m}
//           </Typography>
//         ))}
//       </Stack>
//      </Container>
//   );
//   // return <div>App</div>
// };

// export default App;
