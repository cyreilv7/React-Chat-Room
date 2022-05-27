import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'

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
      <button onClick={() => props.joinRoom(props.currentChat.chatName)}> Join {props.currentChat.chatName}</button>
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
    <Container className="chatroom-container">
      <Row style={ { "height": "100%" } }>
        <Col sm={4} className="sidebar text-center">
          <Row className="channels">
            <h3>Channels</h3>
            {rooms.map(renderRooms)}
          </Row>
          <Row className="users mt-5">
            <h3>All users</h3>
            {props.allUsers.map(renderUsers)}
          </Row>
        </Col>
        <Col sm={8} className="chat-pannel d-flex flex-column">
          <Row className="channel-info">
              #{props.currentChat.chatName}
          </Row>
          <div className="messages">
            { body }
          </div>
          <div className="text-box-container">
            <textarea
              className="text-box w-100"
              value={props.message}
              onChange={props.handleMessageChange}
              onKeyPress={(e) => handleKeyPress(e)}
              placeholder="Text here"
            >
            </textarea>
          </div>
        </Col>
      </Row>

    </Container>
  );
}

export default ChatRoom;
