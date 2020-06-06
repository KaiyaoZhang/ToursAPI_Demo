import React from 'react';
import {Menu} from 'semantic-ui-react';
import LoginModal from '../Modals/LoginModal';
import RegisterModal from '../Modals/RegisterModal';

const SignedOutMenu = () => {
    return(
        <Menu.Item position={"right"}>
            <LoginModal/>
            <RegisterModal/>
        </Menu.Item>
    )
};

export default SignedOutMenu;