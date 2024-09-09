import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "Pulp Fiction",
      image:
        "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg",
      director: "Quentin Tarantino",
      genre: "Crime"
    },
    {
      id: 2,
      title: "Tenet",
      image:
        "https://upload.wikimedia.org/wikipedia/en/1/14/Tenet_movie_poster.jpg",
      director: "Christopher Nolan",
      genre: "Action"
    },
    {
      id: 3,
      title: "The Godfather",
      image:
        "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg",
      director: "Francis Ford Coppola",
      genre: "Crime"
    },
    {
      id: 4,
      title: "Chef",
      image:
        "https://upload.wikimedia.org/wikipedia/en/b/b8/Chef_2014.jpg",
      director: "Jon Favreau",
      genre: "Comedy"
    },
    {
      id: 5,
      title: "Titanic",
      image:
        "https://upload.wikimedia.org/wikipedia/en/1/18/Titanic_%281997_film%29_poster.png",
      director: "James Cameron",
      genre: "Drama"
    },
  ]);

  const [selectedMovie, setSelectedMovie] = useState(null);

  if (selectedMovie) {
    return (
      <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
    );
  }

  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  return (
    <div>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onMovieClick={(newSelectedMovie) => {
            setSelectedMovie(newSelectedMovie);
          }}
        />
      ))}
    </div>
  );
};
