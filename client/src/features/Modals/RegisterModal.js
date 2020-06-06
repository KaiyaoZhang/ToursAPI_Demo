import React, {Component, Fragment} from 'react';
import { Form, Segment, Button, Modal } from 'semantic-ui-react';


class RegisterModal extends Component{
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
                                style={{marginLeft: '10px'}}
                                content='Register'
                                onClick={this.handleOpen}
                            />}
                    open={this.state.modalOpen}
                    onClose={this.closeModal}
                >
                    <Form error size="large">
                    <Segment>
                        <Form.Field>
                            <input 
                                name='username'
                                placeholder='User Name'
                                //onChange={this.handleOnChange}
                            />
                        </Form.Field>
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
                        <Form.Field>
                            <input 
                                name='comfirmPassword'
                                type='password'
                                placeholder='Comfirm Password'
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
                        Register
                        </Button>
                    </Segment>
                    </Form>
                </Modal>
            </Fragment>
        )
    }
};

export default RegisterModal;