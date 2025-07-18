import { Grid } from '@mantine/core';
import { getPerformance } from "firebase/performance";
import Head from 'next/head';
import React from "react";
import MovieCard from "../components/MovieCard/MovieCard";
import SearchMovie from "../components/SearchMovie/SearchMovie";
import firebaseApp from '../lib/firebase';
import { useAuth } from "../lib/firebase.auth";
import styles from '../styles/Home.module.css';

if (process.browser) {
  getPerformance(firebaseApp);
}

export default function Home({ posts }) {

  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <Head>
        <title>Five Stars</title>
        <meta name="description" content="Generated by create next app"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Discover
        </h1>

        <SearchMovie/>

        <Grid gutter="lg">
          {posts.results?.map(movie => (
            <Grid.Col span={{ base: 6, lg: 4 }} key={movie.id}>
              <MovieCard movie={movie} user={user}/>
            </Grid.Col>
          ))}
        </Grid>
      </main>
    </div>
  )
}

export async function getStaticProps({ preview = null }) {
  const res = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=' + process.env.NEXT_PUBLIC_MOVIEDB_API_KEY);
  const posts = await res.json();
  return {
    props: { posts, preview },
  }
}
