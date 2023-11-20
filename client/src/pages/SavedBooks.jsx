// Importing necessary files
import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

// Saved books function
const SavedBooks = () => {
  const { loading , data } = useQuery(GET_ME);
  const userData = data?.me || {};
  const [removeBook] = useMutation(REMOVE_BOOK);

  // Delete books function
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }
    
    // Remove book from db and local storage
    try {
      const { data } = await removeBook({ variables: { bookId }});
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // If loading show loading
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // Setting React display
  return (
    <>
      <Container fluid className="text-light bg-dark p-5">
        <h1>Viewing saved books!</h1>
      </Container>
      <Container>
        <h2 className='pt-5'>
          {(userData?.savedBooks?.length ?? 0) > 0
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
  
        <Row>
        {Array.isArray(userData.savedBooks) && userData.savedBooks.map((book, index) => (
    <Col key={`${book.bookId}-${index}`} md="4">
      <Card border='dark'>

                {book.image && <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
  

};

export default SavedBooks;