import React, {  useState, useEffect, useContext, createContext } from 'react';

import authContext from '../context/auth-context';
import { NavLink } from 'react-router-dom';



function fetchData(dataType){
    const [data, setData] = useState([]);
    
    if (dataType === "books") {
        
        const requestBody = {
            query: `
            query{
                books {
                    _id
                    title
                    question
                    creator {
                        _id
                    }
                }
            }
            `
        };
        
        useEffect(() =>{
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
                setData(resData.data.books);
            })
            .catch(err => console.log(err))
        }, []);
        return data; 
    }
    else if (dataType === "coments") {
        
        const requestBody = {
            query: `
            query{
                coments {
                    coment
                    _id
                    bookId {
                        _id
                    }
                    creatorId {
                        _id
                    }
                    }
                }
            `
        };
        
        useEffect(() =>{
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
                    setData(resData.data.coments);
                })
                .catch(err => console.log(err))
        }, []);
        return data;
    }
    
}

const DataComents = createContext();
const DataBooks = createContext();

//#region Functions for Books of user
function RenderBooks(){
    const context = useContext(authContext);
    const books = useContext(DataBooks);

    return books.map(book =>{
        
        if (book.creator._id === context.userId) {
            
            return (
            <div key={book._id} className="content-wrapper">
                <NavLink to={book._id}>
                    <h1>{book.title}</h1>
                        {book.question}
                </NavLink>
            </div>
            )
        }
        return null;
    });
}
//#endregion

//#region Functions for Coments of user
function RenderBooksComents({bookId}){
    const books = useContext(DataBooks);

    return books.map(book =>{
        if (book._id === bookId) {
            return <h1 className="books" key={book._id}>{book.title}</h1>
        }
        return null;
    })

}

function RenderComents(){
    const coments = useContext(DataComents);
    const context = useContext(authContext);

    return coments.map(coment =>{
        if (coment.creatorId._id === context.userId) {
            
            return (
            <div key={coment._id} className="content-wrapper">
                <NavLink to={coment.bookId._id} >
                    <RenderBooksComents bookId={coment.bookId._id}/>
                    <p className="coments">{coment.coment}</p>
                </NavLink>
            </div>
            )
        }
        return null;
    })
}
//#endregion





const HomePage = () => {
    const coments = fetchData("coments");
    const books = fetchData("books");

    return(
        <DataComents.Provider value={coments}>
            <DataBooks.Provider value={books}>
                <div className="homePage-wrap">
                        <div className="your-books-container">
                            <h1>Your questions</h1>
                            <RenderBooks className = "render-books"/>
                        </div>
                        <div className="your-coments-container">
                            <h1>Your coments</h1>
                            <RenderComents/>
                        </div>
                </div>
            </DataBooks.Provider>
        </DataComents.Provider>
    );
}

export default HomePage;