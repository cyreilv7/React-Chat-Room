import Form from "react-bootstrap/Form";
import InputGroup from 'react-bootstrap/InputGroup'
import Button from "react-bootstrap/Button";

const SubmitField = ({ message, setMessage, handleSubmit }) => {
    return (  
        <Form onSubmit={(e) => {
            e.preventDefault();
            if (message !== "")
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
    );
}
 
export default SubmitField;