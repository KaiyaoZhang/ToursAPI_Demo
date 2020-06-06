import React, {Component, Fragment} from 'react';
import { Form, Segment, Button, Modal } from 'semantic-ui-react';


class LoginModal extends Component{
    state = {
        modalOpen: false
    }

    handleOpen = () => {
        this.setState({modalOpen: true})
    }

    closeModal = () => {
        this.setState({modalOpen: false})
    }

    render() {
        return(
            <Fragment>
                <Modal
                    size='mini'
                    trigger={<Button
                                basic
                                inverted
                                content='Login'
                                onClick={this.handleOpen}
                            />}
                    open={this.state.modalOpen}
                    onClose={this.closeModal}
                >
                    <Form error size="large">
                    <Segment>
                        <Form.Field>
                        <input 
                            name='email'
                            placeholder='Email'
                            //onChange={this.handleOnChange}
                        />
                        </Form.Field>
                        <Form.Field>
                        <input 
                            name='password'
                            type='password'
                            placeholder='Password'
                            //onChange={this.handleOnChange}
                        />
                        </Form.Field>
                        <Button 
                        fluid 
                        size="large" 
                        color="teal"
                        //disabled={!isEnabled}
                        //onClick={this.onSubmit}  
                        >
                        Login
                        </Button>
                    </Segment>
                    </Form>
                </Modal>
            </Fragment>
        )
    }
};

export default LoginModal;