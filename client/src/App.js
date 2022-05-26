import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from 'react-bootstrap/InputGroup'
import Button from "react-bootstrap/Button";
import "./App.scss";
import Chatbox from "./Chatbox";

const socket = io.connect("http://localhost:3001");


function App() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatBox = useRef(null);

  // const [hoistedMessage, setHoistedMessage] = useState(null);


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

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("send", message);
    setMessage("");
  }

  return (
    <div className="App">
      <Container id="wrapper">
        <Row>
          <Col md={9}>
          <h2>Messages</h2>
          <Container className="chatbox">
            {hoistedMessage && <div> { hoistedMessage } </div>}
            {messages.map(({ user, date, text }, index) => (
              <Row key={index} className="row mb-2">
                <Col md={2}>
                  {moment(date).format("h:mm:ss a")}
                </Col>
                <Col md={2}> {user.username}</Col>
                <Col> {text}</Col>
              </Row>
            ))}
          </Container>

            <Form onSubmit={(e) => {
                handleSubmit(e);
            }}>
              <InputGroup>
              <Form.Control 
                  onChange={(e) => setMessage(e.target.value)}
                  size="lg" 
                  type="text" 
                  value = { message }
                />
                  <Button
                    className="submit-btn"
                    variant={"primary"}
                    type="submit"
                  >
                    Submit
                  </Button>
              </InputGroup>

            </Form>

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
