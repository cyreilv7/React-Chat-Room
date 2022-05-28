import React from 'react'
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/esm/Row';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from 'react-bootstrap/InputGroup'

const UsernameForm = (props) => {
    return (
        <div className="wrapper">
            <div className="username-form">
                <h3 className="mb-4">Welcome to Chat Room!</h3>
                <Form onSubmit={props.connect}>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Enter a username" 
                            onChange={props.handleUsernameChange}
                        />
                        <Button variant="primary" type="submit">Submit</Button>  
                    </InputGroup>
                    <p className="my-3 text-center">OR</p>
                    <Button onClick={props.handleUsernameChange} variant="secondary ms-5" type="submit">Get a random username</Button>  
                </Form>
            </div>
        </div>
    );
}
 
export default UsernameForm;