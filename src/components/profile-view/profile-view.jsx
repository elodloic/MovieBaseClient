import React, { useState } from 'react';
import { FaPencilAlt, FaSave, FaKey, FaTrash } from 'react-icons/fa';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import './profile-view.scss';

export const ProfileView = ({ user, token, onUserUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [updatedUser, setUpdatedUser] = useState({
    Username: user.Username,
    Email: user.Email,
    Birthday: user.Birthday,
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const navigate = useNavigate();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSaveClick = () => {
    fetch(`https://moviebaseapi-a2aa3807c6ad.herokuapp.com/users/${user.Username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        Username: updatedUser.Username,
        Email: updatedUser.Email,
        Birthday: updatedUser.Birthday,
        Password: user.Password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('User updated successfully:', data);
        onUserUpdated(data);
        setIsEditing(false);
        localStorage.setItem('user', JSON.stringify(data));
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  };

  const handleChangePasswordClick = () => {
    setIsChangingPassword(true);
  };

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
      })
      .catch((error) => {
        console.error('Error updating password:', error);
      });
  };

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
            navigate('/login');
          } else {
            alert('Error deleting your account. Please try again.');
          }
        })
        .catch((error) => {
          console.error('Error deleting account:', error);
        });
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-view">
      <h1>Profile</h1>

      {/* Username */}
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

      {/* Email */}
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

      {/* Birthday */}
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
          user.Birthday
        )}
        <FaPencilAlt className="edit-icon" onClick={handleEditClick} />
      </p>

      {isEditing ? (
        <Button variant="primary" className="save-button" onClick={handleSaveClick}>
          <FaSave /> Save
        </Button>
      ) : (
        <>
          <Button variant="primary" className="save-button" onClick={handleChangePasswordClick}>
            <FaKey /> Change Password
          </Button>
          <Button variant="danger" className="delete-button" onClick={handleDeleteAccount}>
            <FaTrash /> Delete Account
          </Button>
        </>
      )}

      {isChangingPassword && (
        <Form className="change-password" onSubmit={(e) => { e.preventDefault(); handlePasswordSubmit(); }}>
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
          <Button variant="primary" type="submit">
            Save New Password
          </Button>
        </Form>
      )}
    </div>
  );
};
