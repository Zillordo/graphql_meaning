import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';
import '../../scss/style.css';

const mainNavigation = props => (
    <AuthContext.Consumer>
        {(context) =>{
            return(
            <header>
                <nav className="main-navigation">
                    <div className="main-navigation__logo">
                        <h1>M</h1>
                    </div>
                    <nav className="main-navigatin__items">
                        <ul>
                            {context.token && (
                            <li><NavLink to="/home">Home</NavLink></li>
                            )}
                            <li><NavLink to="/books">Books</NavLink></li>
                            {!context.token && (
                            <li><NavLink to="/auth">log-in</NavLink></li>
                            )}
                            {context.token && (
                            <React.Fragment>
                                <li><button onClick={context.logout}>log-out</button></li>
                            </React.Fragment>
                            )}
                        </ul>
                    </nav>
                </nav>
            </header>
            );
        }}
        
    </AuthContext.Consumer>
);

export default mainNavigation;
