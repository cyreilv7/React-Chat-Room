import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const UsernameForm = (props) => {
    return (  
        <Container className="justify-content-center align-items-center">
            <Form onSubmit={connect}>
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter a username" 
                    onChange={props.handleMessageChange}
                />
                <Button variant="primary" type="submit">Submit</Button>  
            </Form>
        </Container>
    );
}
 
export default UsernameForm;