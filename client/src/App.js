import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";
import immer from "immer"; // introduces immutability to prevent side effects (alternative to redux)
import { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./App.scss";
import Chatbox from "./Chatbox";
import SubmitField from "./SubmitField";

const socket = io.connect("http://localhost:3001");


function App() {
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [currentChat, setCurrentChat] = useState({
    isChannel: true,
    chatName: "general",
    receiverId: ""
  });
  const [connectedRooms, setConnectedRooms] = useState(["general"]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatBox = useRef(null);
  const socketRef = useRef();


  useEffect(() => {
    socket.on("connect", () => {
      const username = prompt("What is your username?");
      socket.emit("userEntered", username);
    });

    socket.on("users", users => {
      console.log(users);
      setUsers(users);
    });

    socket.on("connected", ({ user, msg }) => {
      setUsers(existingUsers => [...existingUsers, user]);
      setMessages(messages => [...messages, msg]);
    });

    socket.on("message", message => {
      setMessages(messages => [...messages, message]);
      chatBox.current.scrollTop = chatBox.current.scrollHeight;
    });

    socket.on("disconnected", ({ id, msg }) => {
      setMessages(messages => [...messages, msg]);
      setUsers(users => {
        return users.filter(user => user.id !== id);
      });
    });

  }, []);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  }

  const sendMessage = (e) => {
    e.preventDefault();
    const payload = {
      content: message,
      to: currentChat.isChannel ? currentChat.chatName : currentChat.receiverId,
      sender: username,
      chatName: currentChat.chatName,
      isChannel: currentChat.isChannel,
    };
    socketRef.current.emit("send", payload);
    const newMessages =  immer(messages, draft => { 
      draft[currentChat.chatName].push({
        sender: username,
        content: message
      });
    });
    setMessages(newMessages);
  }

  // callback fn which handles grabbing prev msgs stored on server and pushing them to client-side
  const joinRoomCallback = (incomingMessages, room) => {
    const newMessages = immer(messages, draft => {
      draft[room] = incomingMessages;
    });
    setMessages(newMessages);
  }

  const joinRoom = (room) => {
    const newConnectedRooms = immer(connectedRooms, draft => {
      draft.push(room);
    })
    setConnectedRooms(newConnectedRooms);
    socket.emit("join room", room, (messages) => joinRoomCallback(messages, room)); 
  }

  const toggleChat = (currentChat) => {
    // if client doesn't have msgs for this chat room, initialize it to empty array
    if (!messages[currentChat]) {
      const newMessages = immer(messages, draft => {
        draft[currentChat.chatName] = []; 
      })
      setMessages(newMessages);
    }
    setCurrentChat(currentChat);
  }

  let body;
  if (isConnected) {
    body = (
      <Chatbox
        username={username}
        userId={socketRef.current ? socketRef.current.id : ""}
        currentChat={currentChat}
        toggleChat={toggleChat}
        joinRoom={joinRoom}
        handleMessageChange={handleMessageChange}
        message={message}
        users={users}
        messages={messages[currentChat.chatName]}
        connectedRooms={connectedRooms}
      />
    )
  }

  return (
    <div className="App">
      <Container id="wrapper">
        <Row>
          <Col md={9}>
          <h2>Messages</h2>
          {/* <Chatbox messages={ messages } reference={ chatBox }/> */}
          {/* <SubmitField message={message} setMessage={setMessage} sendMessage={sendMessage} /> */}

          </Col>
          <Col md={3} className="text-center d-flex flex-column">
            <h2>Current Users</h2>
            <div>
              {users.map(( { username, id } ) => (
                <div key={id}>
                  { username }
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
