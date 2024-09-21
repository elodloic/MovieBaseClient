import React, { useState, useEffect } from 'react';
import { Card, Button, Container } from 'react-bootstrap';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import './movie-view.scss';

export const MovieView = ({ movies, setUser }) => {
  const { movieId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const movie = movies.find((m) => m.id === movieId);
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const username = user ? user.Username : null;

  // Check if the movie is in the user's favorites list
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token || !username) {
        console.error('No token or username found');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`https://moviebaseapi-a2aa3807c6ad.herokuapp.com/users/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        const favoriteMovies = data.FavoriteMovies;
        const isInFavorites = favoriteMovies.includes(movieId);
        setIsFavorite(isInFavorites);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [movieId, token, username]);

  // Function to add or remove a favorite
  const toggleFavorite = async () => {
    if (!token || !username) {
      console.error('No token or username found');
      return;
    }
    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const endpoint = `https://moviebaseapi-a2aa3807c6ad.herokuapp.com/users/${username}/movies/${movieId}`;

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);

        // Save updated user data to local storage
        const userResponse = await fetch(`https://moviebaseapi-a2aa3807c6ad.herokuapp.com/users/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const updatedUser = await userResponse.json();
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      } else {
        console.error('Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="bg-primary" style={{ width: '40%' }}>
        <Card.Img variant="top" src={movie.image} alt={movie.title} />
        <Card.Body>
          <Card.Title>{movie.title}</Card.Title>
          <Card.Text>Director: {movie.director}</Card.Text>
          <Card.Text>Genre: {movie.genre}</Card.Text>
          <Card.Text>Description: {movie.description}</Card.Text>

          {/* State dependent favorites button */}
          {!loading && (
            <Button variant={isFavorite ? 'danger' : 'success'} onClick={toggleFavorite}>
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          )}

          <Link to={`/`}>
            <Button variant="secondary" className="back-button">Back</Button>
          </Link>
        </Card.Body>
      </Card>
    </Container>
  );
};
