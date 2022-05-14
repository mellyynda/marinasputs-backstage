import { useState } from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import {
    Menu,
    Segment,
} from 'semantic-ui-react'

const Navigation = () => {
    const [activeItem, setActiveItem] = useState('signin')
    const handleItemClick = (e, { name }) => setActiveItem(name)
return (
    <Segment inverted>
        {/* <Checkbox
        checked={visible}
        label={{ children: <code>visible</code> }}
        onChange={(e, data) => setVisible(data.checked)}
        style={{ position: 'relative', left: '10px', top: '25px'}}
        /> */}
        <Menu inverted secondary stackable>
        <AuthUserContext.Consumer>          
            {authUser =>
                authUser
                ? <NavigationAuth 
                    authUser={authUser}
                    activeItem={activeItem}
                    handleItemClick={handleItemClick} 
                /> : <NavigationNonAuth
                    activeItem={activeItem}
                    handleItemClick={handleItemClick}
                />
            }
        </AuthUserContext.Consumer>        
        </Menu>
    </Segment>
)};

const NavigationAuth = ({ authUser, activeItem, handleItemClick }) => (
    <>
        <Menu.Item        
            name='home'
            active={activeItem === 'home'}
            onClick={handleItemClick}
            as={Link}
            to={ROUTES.HOME}
        />
        <Menu.Item        
            name='account'
            active={activeItem === 'account'}
            onClick={handleItemClick}
            as={Link}
            to={ROUTES.ACCOUNT}
        />
        {!!authUser.roles[ROLES.ADMIN] && (
            <Menu.Item            
            name='admin'
            active={activeItem === 'admin'}
            onClick={handleItemClick}
            as={Link}
            to={ROUTES.ADMIN}
            />
        )}
        <Menu.Item        
            name='signout'
        >
            <SignOutButton />
        </Menu.Item>
    </>
);

const NavigationNonAuth = ({activeItem, handleItemClick}) => (
    <>
        <Menu.Item        
            name='signin'
            active={activeItem === 'signin'}
            onClick={handleItemClick}
            as={Link}
            to={ROUTES.SIGN_IN}
        />
    </>
);

export default Navigation;
