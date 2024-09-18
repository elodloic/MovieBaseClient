import React from 'react';
import { Card, Row, Col, Button, Container } from 'react-bootstrap';
import './movie-view.scss';

export const MovieView = ({ movie, onBackClick }) => {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="bg-primary" style={{ width: '40%' }}>
        <Card.Img variant="top" src={movie.image } alt={movie.title} />
        <Card.Body>
          <Card.Title>{movie.title}</Card.Title>
          <Card.Text>Director: {movie.director}</Card.Text>
          <Card.Text>Genre: {movie.genre}</Card.Text>
          <Card.Text>Description: {movie.description}</Card.Text>
          <Button variant="secondary" onClick={onBackClick}>
            Back
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};