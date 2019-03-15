import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import './css/style.css';

import AuthPage from './pages/Auth';
import BooksPage from './pages/Books';
import MainNavigation from './components/Navigation/MainNavigation';
import HomePage from './pages/Home';
import AuthContext from './context/auth-context';
import BookItem from './pages/Book-item';

class App extends Component {
  state = {
    token: null,
    userId: null
  }

  login = (token, userId, tokenExpiration) => {
    localStorage.setItem('token', JSON.stringify(token));
    localStorage.setItem('userId', JSON.stringify(userId));
    this.retriveToken();
  }

  

  logout = () => {
    this.setState({token: null, userId: null})
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  retriveToken(){
      const token = JSON.parse(localStorage.getItem('token'));;
      const userId = JSON.parse(localStorage.getItem('userId'));
      this.setState({token: token, userId: userId});
  }

  render() {

    window.onload = () =>{
      this.retriveToken();
    }

    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider 
            value={{ 
                token: this.state.token, 
                userId: this.state.userId, 
                login: this.login, 
                logout: this.logout 
                }}>
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {!this.state.token && <Redirect from="/" to="/books" exact />}
                {this.state.token && <Redirect from="/auth" to="/home" exact/>}
                {this.state.token && (<Route path="/home" component={HomePage} />)}
                {!this.state.token && (<Route path="/auth" component={AuthPage} />)}
                {!this.state.token && <Redirect from="/home" to="books" exact />}
                <Route path="/books" component={BooksPage} />
                <Route path="/:id" component={BookItem} exact/>
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
