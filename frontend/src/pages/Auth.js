import React, { Component } from 'react';

import '../css/style.css';
import  AuthContext from '../context/auth-context'

class AuthPage extends Component {
    state = {
        isLogin: true,
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
        this.userName = React.createRef();
    };

    toggleHandeler = () =>{
        this.setState(prevState =>{
            return {isLogin: !prevState.isLogin};
        });
    };

    submitHandeler = (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        
        

        if (email.trim().lenght === 0 || password.trim().lenght === 0) {
            return;
        }

        //...

        let requestBody = {
            query:`
                query {
                    login(email: "${email}", password: "${password}") {
                        userId
                        token
                        tokenExpiration
                    }
                }
                
            `
        }

        if (!this.state.isLogin) {
            const userName = this.userName.current.value;
            requestBody = {
                query: `
                mutation {
                    createUser(userInput: {email: "${email}", password: "${password}", userName: "${userName}"}) {
                        email
                        _id
                    }
                }
                `
            };
        }


        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res =>{
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('res.status == 200 || 201 "Faild!"');
            }
            this.passwordEl.current.value = '';
            return res.json();

        })
        .then(resData => {
            if (resData.data.login.token) {
                this.context.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration);
            }
        })
        .catch(err => console.log(err))
    };


    render() {
        return (
            <div className="form__login">
                <form className="auth-form" onSubmit={this.submitHandeler}>
                    {!this.state.isLogin && 
                    <div className="form-control">
                        <label htmlFor="userName">user name:</label>
                        <input type="userName" className="password-input" id="userName" ref={this.userName}></input>
                    </div>
                    }
                    <div className="form-control">
                        <label htmlFor="email">e-mail:</label>
                        <input type="email" className="email-input" id="email" ref={this.emailEl}></input>
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">password:</label>
                        <input type="password" className="password-input" id="password" ref={this.passwordEl}></input>
                    </div>
                    <div className="form-actions">
                        <button type="submit" >submit</button>
                        <button type="button" onClick={this.toggleHandeler}>{this.state.isLogin? 'Sign up' : 'Log in'}</button>
                    </div>
                </form>
            </div>
        );
    };
}

export default AuthPage;

