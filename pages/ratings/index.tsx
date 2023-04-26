import { Grid, Title } from '@mantine/core';
import Head from 'next/head';
import { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import { useAuth } from "../../lib/firebase.auth";
import { getMovies } from "../../lib/firebase.db";
import { Movie } from "../../lib/interfaces";

export default function Watchlist() {

  const { user } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  useEffect(() => {
    if (user) {
      getMovies(Object.keys(user.ratings).map(rating => Number(rating))).then((data) => setMovies(data))
    }
  }, [user]);

  return (
    <div>
      <Head>
        <title>My ratings | Five Stars</title>
        <meta name="description" content="Generated by create next app"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main>
        <Title order={1}>My ratings</Title>

        <Grid gutter="lg">
          {movies.map(movie => (
            <Grid.Col sm={6} lg={4} key={movie.id}>
              <MovieCard movie={movie} user={user}/>
            </Grid.Col>
          ))}
        </Grid>
      </main>
    </div>
  )
}
