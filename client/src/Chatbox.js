import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import moment from "moment";
import { useEffect, useRef } from 'react';

const Chatbox = ( { messages, reference}) => {
    return (  
        <Container className="chatbox" ref={ reference }>
        {messages.map(({ user, date, text }, index) => (
          <Row key={index} className="row mb-2">
            <Col md={2}>
              {moment(date).format("h:mma")}
            </Col>
            {user && <Col md={2}> {user.username}</Col>}
            <Col> {text} </Col>
          </Row>
        ))}
      </Container>
    );
}
 
export default Chatbox;