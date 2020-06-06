import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import { Menu, Segment, Container } from 'semantic-ui-react';
import SignedOutMenu from '../Menus/SignedOutMenu';

class NavBar extends Component{
    state = {
        activeItem: ''
    }

    render() {
        const {activeItem} = this.state;
        return(
            <Segment inverted color={'black'}>
                <Container>
                    <Menu inverted secondary >
                        <Menu.Item 
                            name='Tours'
                        >
                        <img src='favicon.png' alt='logo'/>
                        </Menu.Item>
                        <Menu.Item
                            name='All Tours'
                            active={activeItem === 'All Tours'}
                            as={Link}
                            to={'/'}
                        />
                        <SignedOutMenu/>
                    </Menu>
                </Container>
            </Segment>
        )
    }
};

export default NavBar;