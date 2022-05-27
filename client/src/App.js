import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";
import immer from "immer"; // introduces immutability to prevent side effects (alternative to redux)
import { useState, useRef } from "react";
import "./App.scss";
import ChatRoom from "./components/ChatRoom";
import UsernameForm from "./components/UsernameForm";

// const socket = io.connect("http://localhost:3001");

function App() {
  const initialMessagesState = {
    general: [],
    random: [],
    "programming-help": [],
    "career-advice": [],
  }
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [currentChat, setCurrentChat] = useState({
    isChannel: true,
    chatName: "general",
    receiverId: ""
  });
  const [connectedRooms, setConnectedRooms] = useState(["general"]);
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState(initialMessagesState);
  const [message, setMessage] = useState("");
  const socketRef = useRef();

  const connect = () => {
    setIsConnected(true);
    socketRef.current = io.connect("/");
    socketRef.current.emit("join server", username);
    socketRef.current.emit("join room", "general", (messages) => joinRoomCallback(messages, "general"));
    socketRef.current.on("new user", users => setAllUsers(users));
    socketRef.current.on("new message", ({ content, sender, chatName }) => {
      setMessages(messages => {
        const newMessages = immer(messages, draft => {
          if (draft[chatName]) {
            draft.push( { content, sender } );
          } else {
            draft[chatName] = [{ content, sender }];
          }
        });
        return newMessages;
      })
    });
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  }

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
    setMessage("");
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
    socketRef.current.emit("join room", room, (messages) => joinRoomCallback(messages, room)); 
  }

  const toggleChat = (currentChat) => {
    // create new chatroom if it doesn't exist
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
      <ChatRoom
        username={username}
        yourId={socketRef.current ? socketRef.current.id : ""}
        currentChat={currentChat}
        toggleChat={toggleChat}
        joinRoom={joinRoom}
        handleMessageChange={handleMessageChange}
        message={message}
        allUsers={allUsers}
        messages={messages[currentChat.chatName]}
        connectedRooms={connectedRooms}
        sendMessage={sendMessage}
      />
    );
  } else {
    body = (
      <UsernameForm
        username={username}
        handleUsernameChange={handleUsernameChange}
        connect={connect}
      />
    );
  }

  return (
    <div className="App">
      { body }
    </div>
  );
}

export default App;
