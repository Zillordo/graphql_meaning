import React, { Component } from 'react';

import AuthContext from '../context/auth-context';



class BookItem extends Component {
    state = {
        bookId: this.props.match.params.id,
        books: {},
        coment: []
    }

    static contextType = AuthContext;

    constructor(props){
        super(props)
        this.comentEl = React.createRef();
    }


    componentDidMount() {
        this.getBooks();
        this.getComents();
    };

    addHandeler = () =>{

        const coment = this.comentEl.current.value;
        

        if (coment.trim().length === 0) {
            return console.log("err at triming coment");
        }

        const requestBody = {
                query: `
                    mutation {
                            createComent(comentInput: {coment: "${coment}", bookId: "${this.state.bookId}"}) {
                                _id
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
            this.getComents();
            this.comentEl.current.value = "";
        })
        .catch(err => console.log(err))
    };

    getComents = () =>{
        const requestBody = {
            query: `
            query{
                    coments {
                    _id
                    coment
                    creatorId {
                        email
                    }
                    bookId {
                        _id
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
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('res.status == 200 || 201 "Faild!"');
                }
                return res.json();

            })
            .then(resData => {
                const coment = resData.data.coments;  
                this.setState({coment: coment});
            })
            .catch(err => console.log(err))
    }

    getBooks = () => {
        const requestBody = {
            query: `
            query{
                books {
                    _id
                    title
                    author
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
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('res.status == 200 || 201 "Faild!"');
                }
                return res.json();

            })
            .then(resData => {
                const books = resData.data.books;
                
                books.map(book => {
                    if (book._id === this.state.bookId) {
                        const objbook = {
                            title: book.title,
                            author: book.author,
                            user: book.creator.email,
                        }
                        return this.setState({books: objbook});
                    }
                    return null;
                });
            })
            .catch(err => console.log(err))
    };



    render() {
            const title = this.state.books.title;
            const author = this.state.books.author;
            const user = this.state.books.user;

            const coment = this.state.coment.map(com =>{
                if (com.bookId._id === this.state.bookId) {
                    return <div key={com._id} className="coment">{com.coment}</div>
                }
                return null;
            })

        return (
            <React.Fragment>
                <div className="book-item__scroll">
                    <div className="single-book-container">
                        <div className="header">
                            <div className="title">{title}</div>
                            <div className="author"><sub>{author}</sub></div>
                            <div className="question">
                                <p>{user}´s question: </p>
                                <p>Question inster here</p>
                            </div>
                        </div>
                        <div className="coments-container">
                            <div className="create-new-coment">
                                <textarea ref={this.comentEl}></textarea>
                                <button onClick={this.addHandeler}>Add</button>
                            </div>
                            {coment}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


export default BookItem;