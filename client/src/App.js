import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./App.scss";

const socket = io.connect("http://localhost:3001", {
  transports: ["websocket", "polling"], // prevents messages from sitting there and not sending
});

function App() {
  const [username, setUsername] = useState("Anonymous User");
  const [users, setUsers] = useState([]);


  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("userEntered", username);
    });

    socket.on("users", users => {
      setUsers(users);
      console.log(users);
    })

  }, []);


  useEffect(() => {
    socket.emit("usernameChange", username);
  }, [username]);

  return (
    <div className="App">
      <Container id="wrapper">
        <Row>
          <Col md={9}>
            <h2>Messages</h2>
            <Row className="chatbox"></Row>
            <Row className="msg-field">
              <Col md={10} className="p-0">
                <Form.Control size="lg" type="text" />
              </Col>
              <Col className="submit-container">
                <Button
                  onClick={() => {
                    const input = prompt("What's your username?");
                    setUsername(input);
                  }}
                  className="submit-btn"
                  variant={"primary"}
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </Col>
          <Col md={3} className="text-center">
            <h2>Current Users</h2>
            {users.map(( { username, id } ) => (
              <Row key={id}>
                { username }
              </Row>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
