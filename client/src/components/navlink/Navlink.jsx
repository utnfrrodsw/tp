import { NavLink as NavLinkReactRouter } from 'react-router-dom';

export const NavLink = ({to, children, ...props }) => {
    return (
    <NavLinkReactRouter 
        {...props} 
        className={({isActive}) => {return isActive ? 'is-active' : undefined}}
        to = {to}>
            {children}
    </NavLinkReactRouter>
    )
};