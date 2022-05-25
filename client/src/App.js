import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./App.scss";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("Anonymous User");
  const isFirstRender = useRef(true);
  const [users, setUsers] = useState([]);


  useEffect(() => {
    console.log("user has entered");

    socket.on("connect", () => {
      console.log("this should be running");
      socket.emit("userEntered", username);
    });

    socket.on("users", users => {
      setUsers(users);
    })

  }, []);


  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
      socket.emit("usernameChange", username);
      console.log("new username:", username);
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
                    if (isFirstRender.current) {
                      const input = prompt("What's your username?");
                      setUsername(input);
                    }
                  }}
                  className="submit-btn"
                  variant={"primary"}
                >
                  Submit
                </Button>
              </Col>
            </Row>
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
