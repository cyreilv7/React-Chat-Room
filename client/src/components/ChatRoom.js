
import styled from "styled-components";

const Container = styled.div`
    height: 100vh;
    width: 100%;
    display: flex;
`;

const Sidebar = styled.div`
    height: 100%;
    width: 15%;
    border-right: 1px solid black;
`;

const ChatPanel = styled.div`
    height: 100;
    width: 85%;
    display: flex;
    flex-direction: column;
`;

const BodyContainer = styled.div`
    width: 100%;
    height: 75%;
    overflow: scroll;
    border-bottom: 1px solid black;
`;

const TextBox = styled.textarea`
    height: 15%;
    width: 100%;
`;

const ChannelInfo = styled.div`
    height: 10%;
    width: 100%;
    border-bottom: 1px solid black;
`;

const Row = styled.div`
    cursor: pointer;
`;

const Messages = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const ChatRoom = (props) => {
  const rooms = ["general", "random", "programming-help", "career-advice"];

  let body;
  // check if not channel or if user previously connected to this room
  if (!props.currentChat.isChannel || props.connectedRooms.includes(props.currentChat.chatName)) {
    body = (
      <Messages>
        {props.messages.map(renderMessages)}
      </Messages>
    );
  } else {
    body = (
      <button onClick={() => props.joinRoom(props.currentChat.chatName)}> Join {props.activeChannel}</button>
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
        {room}
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

  return (
    <Container>
      <Sidebar sm={4}>
          <h3>Channels</h3>
          {rooms.map(renderRooms)}
          <h3>All users</h3>
          {props.allUsers.map(renderUsers)}
      </Sidebar>
      <ChatPanel>
        <ChannelInfo>
          {props.currentChat.chatName}
        </ChannelInfo>
        <BodyContainer>
          { body }
        </BodyContainer>
        <TextBox
          value={props.message}
          onChange={props.handleMessageChange}
          onKeyPress={handleKeyPress}
          placeholder=""
        />
      </ChatPanel>
    </Container>
  );
};

export default ChatRoom;
