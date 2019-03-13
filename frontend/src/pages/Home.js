import React, {  useState, useEffect, useContext } from 'react';
import AuthContext from '../context/auth-context';



function fetchData(dataType){
    const [data, setData] = useState([]);
    
    if (dataType === "books") {
        
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

function RenderComents({bookId}){
    const coments = fetchData("coments");

    return coments.map(coment =>{
        if (coment.bookId._id === bookId) {
            return <p key={coment._id}>{coment.coment}</p>;
        }
        return null;
    })
}

function RenderBooks(){
    const context = useContext(AuthContext);
    const books = fetchData("books");

    return books.map(book =>{
        
        if (book.creator._id === context.userId) {
            
            return (
            <div key={book._id}>
                <h1>{book.title}</h1>
                <RenderComents bookId={book._id}/>
            </div>
            )
        }
        return null;
    });
}








const HomePage = () => {
    return(
        <div>
            <RenderBooks></RenderBooks>
        </div>
    );
}

export default HomePage;