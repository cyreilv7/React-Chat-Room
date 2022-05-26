import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import moment from "moment";
import { useEffect, useRef } from 'react';

const Chatbox = ( { messages, reference}) => {
    return (  
        <Container className="chatbox align-items-center" ref={ reference }>
        {messages.map(({ user, date, text }, index) => (
          <Row key={index} className="chat-row row mb-2 border-bottom">
            <Col className="d-flex align-items-center" md={2}>
              <div>{moment(date).format("h:mm a")}</div>
            </Col>
            <Col className="d-flex align-items-center" md={2}> <div>{user.username}</div></Col>
            <Col className="d-flex align-items-center"> <div>{text}</div></Col>
          </Row>
        ))}
      </Container>
    );
}
 
export default Chatbox;