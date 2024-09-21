import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaSave, FaKey, FaTrash } from 'react-icons/fa';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MovieCard } from "../movie-card/movie-card";
import './profile-view.scss';

export const ProfileView = ({ user, movies, setUser }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    Username: user.Username,
    Email: user.Email,
    Birthday: user.Birthday ? new Date(user.Birthday).toISOString().split('T')[0] : '',
    Password: user.Password
  });
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFavoriteMovies(user.FavoriteMovies || []);
    }
  }, [user]);

  // Filter favorite movies
  const favoriteMovieList = movies.filter((movie) =>
    favoriteMovies.includes(movie.id)
  );

  // State change when edit button is clicked
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  // Saving the user profile changes
  const handleSaveClick = () => {
    fetch(`https://moviebaseapi-a2aa3807c6ad.herokuapp.com/users/${user.Username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('User updated successfully:', data);
        localStorage.setItem('user', JSON.stringify(data));
        setIsEditing(false);
        setUser(data);
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  };

  // Password change submission
  const handlePasswordSubmit = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    fetch(`https://moviebaseapi-a2aa3807c6ad.herokuapp.com/users/${user.Username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        Username: user.Username,
        Email: user.Email,
        Birthday: user.Birthday,
        Password: newPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Password updated successfully:', data);
        setIsChangingPassword(false);
        setNewPassword('');
        setConfirmPassword('');
        alert('Password changed successfully');
        setUser(data);
      })
      .catch((error) => {
        console.error('Error updating password:', error);
      });
  };

  // Delete account function
  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (confirmDelete) {
      fetch(`https://moviebaseapi-a2aa3807c6ad.herokuapp.com/users/${user.Username}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            alert('Your account has been deleted.');
            localStorage.clear();
            window.location.href = '/login';
          } else {
            alert('Error deleting account. Please try again.');
          }
        })
        .catch((error) => {
          console.error('Error deleting account:', error);
        });
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-view">
      <h2>Profile</h2>

      {/* User details */}
      <p>
        <strong>Username: </strong>
        {isEditing ? (
          <input
            type="text"
            name="Username"
            value={updatedUser.Username}
            onChange={handleInputChange}
          />
        ) : (
          user.Username
        )}
        <FaPencilAlt className="edit-icon" onClick={handleEditClick} />
      </p>

      <p>
        <strong>Email: </strong>
        {isEditing ? (
          <input
            type="email"
            name="Email"
            value={updatedUser.Email}
            onChange={handleInputChange}
          />
        ) : (
          user.Email
        )}
        <FaPencilAlt className="edit-icon" onClick={handleEditClick} />
      </p>

      <p>
        <strong>Birthday: </strong>
        {isEditing ? (
          <input
            type="date"
            name="Birthday"
            value={updatedUser.Birthday}
            onChange={handleInputChange}
          />
        ) : (
          new Date(user.Birthday).toLocaleDateString()
        )}
        <FaPencilAlt className="edit-icon" onClick={handleEditClick} />
      </p>

      {/* Buttons for editing, pw change and account deletion */}
      {isEditing ? (
        <Button variant="primary" className="save-button" onClick={handleSaveClick}>
          <FaSave /> Save
        </Button>
      ) : (
        <>
          <Button variant="primary" className="save-button" onClick={() => setIsChangingPassword(true)}>
            <FaKey /> Change Password
          </Button>
          <Button variant="danger" className="delete-button" onClick={handleDeleteAccount}>
            <FaTrash /> Delete Account
          </Button>
        </>
      )}

      {/* pw change form */}
      {isChangingPassword && (
        <Form className="change-password mt-5" onSubmit={(e) => { e.preventDefault(); handlePasswordSubmit(); }}>
          <h2>Change Password</h2>
          <Form.Group controlId="newPassword">
            <Form.Label>New Password:</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className='mt-3'>
            Save New Password
          </Button>
        </Form>
      )}

      {/* Favorite Movies Section */}
      <h2 className="mt-5 mb-3">Your Favorite Movies</h2>
      <Row>
        {favoriteMovieList.length > 0 ? (
          favoriteMovieList.map((movie) => (
            <Col key={movie.id} md={4} className="mb-4">
              <MovieCard movie={movie} />
            </Col>
          ))
        ) : (
          <p>You have no favorite movies yet.</p>
        )}
      </Row>
    </div>
  );
};
