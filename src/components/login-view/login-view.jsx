import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./login-view.scss";

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(
        `http://ec2-3-70-216-96.eu-central-1.compute.amazonaws.com/login?Username=${encodeURIComponent(username)}&Password=${encodeURIComponent(password)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Username: username, Password: password }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            onLoggedIn(data.user, data.token);
          } else {
            alert("Login failed");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred. Please try again.");
        });
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-3 loginview">
      <Form.Group controlId="formUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength="3"
        />
      </Form.Group>

      <Form.Group controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3 mb-3">
        Submit
      </Button>
    </Form>
  );
};

