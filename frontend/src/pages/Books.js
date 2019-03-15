import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import { NavLink } from 'react-router-dom';

class BooksPage extends Component{
    state = {
        toggle: false,
        books: []
    };
    
    static contextType = AuthContext;

    constructor(props){
        super(props);
        this.titleEl = React.createRef();
        this.authEl = React.createRef();
        this.questionEl = React.createRef();
    };


    componentDidMount(){
        this.getBooks();
    };


    addNewBookToggle = () =>{
        this.setState({toggle: true})
    };

    addHandeler = () =>{
        this.setState({toggle: false});

        const title = this.titleEl.current.value;
        const author = this.authEl.current.value;
        const question = this.questionEl.current.value;
        
        if (title.trim().length === 0 || author.trim().length === 0) {
            return console.log("err at triming title, author");
        }

        // const book = { title, author}
        
        const requestBody = {
                query: `
                mutation{
                    createBook(bookInput:
                        {title:"${title}", author:"${author}", question:"${question.replace(/(?:\r\n|\r|\n)/g, '')}"})
                            {
                                _id
                                title
                                author
                                creator{
                                    _id
                                    email
                                }
                            }
                    }
                `
            };

            const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res =>{
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('res.status == 200 || 201 "Faild!"');
            }
            return res.json();

        })
        .then(resData => {
            this.getBooks();
        })
        .catch(err => console.log(err))
    };

    cancelHandeler = () =>{
        this.setState({toggle: false});
    };


    
    getBooks = () =>{
        const requestBody = {
            query: `
            query{
                books {
                    _id
                    title
                    author
                    question
                    creator {
                        _id
                        email
                    }
                }
                }
            `
        };

    fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(res =>{
        if (res.status !== 200 && res.status !== 201) {
            throw new Error('res.status == 200 || 201 "Faild!"');
        }
        return res.json();

    })
    .then(resData => {
        const books = resData.data.books;
        this.setState({books: books})
    })
    .catch(err => console.log(err))
    };

    render(){
        
        const booksList = this.state.books.map(book =>{
            return <NavLink to={book._id} key={book._id}> <li  className="book-item__list"><h1>{book.title}:</h1> {book.question}</li></NavLink>
        });


        return (
            <React.Fragment>
                <div className="book-container">
                    {this.state.toggle && 
                    <React.Fragment>
                        <Backdrop/>
                            <Modal title="Add question" canCancle canAdd onCancel={this.cancelHandeler} onAdd={this.addHandeler}>
                                <form>
                                    <div className="form-control">
                                        <label htmlFor="title">Title:</label>
                                        <input type="text" id="title" ref={this.titleEl}></input>
                                    </div>
                                    <div className="form-control">
                                        <label htmlFor="author">Author:</label>
                                        <input type="text" id="author" ref={this.authEl}></input>
                                    </div>
                                    <div className="form-control">
                                        <label htmlFor="question">Question:</label>
                                        <textarea type="text" id="question" ref={this.questionEl}></textarea>
                                    </div>
                                </form>
                            </Modal>  
                    </React.Fragment>
                    }
                    {this.context.token && <div className="new-book-butn-container">
                        <label htmlFor="new-button">Ask question about any book</label>
                        <button id="new-button" className="add-new-book-butn" onClick={this.addNewBookToggle}>Create question</button>
                    </div>}
                    <ul className="books__list">
                        {booksList}
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}


export default BooksPage;