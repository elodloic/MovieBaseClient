import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./main-view.scss";
import { ProfileView } from "../profile-view/profile-view";

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [searchMovie, setSearchMovie] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }
    fetch("http://ec2-3-70-216-96.eu-central-1.compute.amazonaws.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        const moviesFromApi = data.map((movie) => {
          return {
            id: movie._id,
            title: movie.Title,
            description: movie.Description,
            image: movie.ImagePath,
            director: movie.Director.Name,
            genre: movie.Genre.Name,
          };
        });
        setMovies(moviesFromApi);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [token]);

  const filteredMovies = movies.filter((movie) => {
    const regex = new RegExp(`\\b${searchMovie}`, "i"); // RegExp to only match at the beginning of words
    return regex.test(movie.title);
  });

  return (
    <BrowserRouter>
      <NavigationBar
        user={user}
        onLoggedOut={() => {
          setUser(null);
        }}
      />
      <Row className="justify-content-md-center">
        <Routes>
          <Route
            path="/signup"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <SignupView />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <LoginView
                      onLoggedIn={(user, token) => {
                        setUser(user);
                        setToken(token);
                      }}
                    />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/movies/:movieId"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : (
                  <Col md={8}>
                    <MovieView movies={movies} setUser={setUser} />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : (
                  <>
                    {/* Filter input */}
                    <Col md={12} className="mb-4">
                      <Form>
                        <Form.Control
                          type="text"
                          placeholder="Search movies"
                          value={searchMovie}
                          onChange={(e) => setSearchMovie(e.target.value)}
                        />
                      </Form>
                    </Col>

                    {/* Filter results */}
                    {filteredMovies.length === 0 ? (
                      <p>No matching movies.</p>
                    ) : (
                      filteredMovies.map((movie) => (
                        <Col className="mb-4" key={movie.id} md={3}>
                          <MovieCard movie={movie} />
                        </Col>
                      ))
                    )}
                  </>
                )}
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : (
                  <Col md={8}>
                    <ProfileView user={user} movies={movies} setUser={setUser} />
                  </Col>
                )}
              </>
            }
          />
        </Routes>
      </Row>
    </BrowserRouter>
  );
};