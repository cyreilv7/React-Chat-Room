import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup';

const ChatRoom = (props) => {
  const rooms = ["general", "random", "programming-help", "career-advice"];
  let body;
  // check if not channel or if user previously connected to this room
  const renderMessages = (message, i) => {
    return (
      <div key={ i }>
        <h5> { message.sender }</h5>
        <p> { message.content } </p>
      </div>
    );
  }

  if (!props.currentChat.isChannel || props.connectedRooms.includes(props.currentChat.chatName)) {
    body = (
      <Row>
        {props.messages.map(renderMessages)}
      </Row>
    );
  } else {
    body = (
      <div className="d-flex h-100 justify-content-center align-items-center">
        <Button variant={"primary"} onClick={() => props.joinRoom(props.currentChat.chatName)}> Join {props.currentChat.chatName}</Button>
      </div>
    )
  }

  const renderRooms = (room) => {
    const currentChat = {
      chatName: room,
      isChannel: true,
      receiverId: "",
    };
    return (
      <Row onClick={() => props.toggleChat(currentChat)} key={room}>
        #{room}
      </Row>
    );
  };

  const renderUsers = (user) => {
    if (user.id === props.yourId) {
      return <Row key={props.yourId}>You: {user.username}</Row>;
    } else {
      const currentChat = {
        chatName: user.username,
        isChannel: false,
        receiverId: user.id,
      };
    return (
      <Row onClick={() => props.toggleChat(currentChat)} key={user.id}>
        {user.username}
      </Row>
    );
  }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      props.sendMessage(e);
    }
  }

  return (
    <Container className="chatroom-container ms-0">
      <Row style={ { "height": "100%" } }>
        <Col sm={2} className="sidebar text-center border-end">
          <Row>
            <h3>Channels</h3>
            <Container className="channels d-flex flex-column align-items-center">
              {rooms.map(renderRooms)}
            </Container>
          </Row>
          <Row className="mt-5">
            <h3>All users</h3>
            <Container className="users d-flex flex-column align-items-center">
              {props.allUsers.map(renderUsers)}
            </Container>
          </Row>
        </Col>
        <Col sm={9} className="chat-pannel d-flex flex-column">
          <Row className="channel-info mb-2 border-bottom">
              <h3>#{props.currentChat.chatName}</h3>
          </Row>
          <div className="messages p-3 mb-3 border-bottom">
            { body }
          </div>
          <InputGroup className="text-box-container ">
            <textarea
              className="text-box w-100 form-control text-start"
              value={props.message}
              onChange={props.handleMessageChange}
              onKeyPress={(e) => handleKeyPress(e)}
              placeholder="Enter message here"
            >
            </textarea>
          </InputGroup>
        </Col>
      </Row>

    </Container>
  );
}

export default ChatRoom;
