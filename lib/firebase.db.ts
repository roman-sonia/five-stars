import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";

import firebaseApp from "./firebase";
import { Movie, User } from "./interfaces";
import * as tmdbApi from "./tmdb.api";

const db = getFirestore(firebaseApp);

export const createUser = (uid: string, data: User) => {
  return setDoc(doc(db, 'users', uid), { ...data, uid }, { merge: true });
};

export const getUser = (uid: string) => {
  return getDoc(doc(db, 'users', uid));
};


export const dbRateMovie = async (userId: string, id: string, rating: number) => {
  await setDoc(doc(db, 'users', userId), {
    ratings: {
      [id]: rating
    }
  }, { merge: true });
};

export const dbAddToWatchlist = async (userId: string, id: string) => {
  await updateDoc(doc(db, 'users', userId), {
    watchlist: arrayUnion(id)
  });
};

export const createMovie = async (id: string, movie: Movie) => {
  return await setDoc(doc(db, 'movies', id), movie);
}

export const getMovie = async (id: string) => {
  const docSnap = await getDoc(doc(db, 'movies', id));

  if (docSnap.exists()) {
    return docSnap.data() as Movie;
  }

  const movie = await tmdbApi.getMovie(id);
  await createMovie('' + movie.id, movie);
  return movie;
}

export const getMovies = async (id: (string | number)[]) => {
  console.log(id)
  const q = query(collection(db, "movies"), where("id", "in", id));
  const docSnap = await getDocs(q);
  console.log(docSnap);
  let movies: Movie[] = [];
  docSnap.forEach(doc => movies.push(doc.data() as Movie));
  console.log(movies);
  return movies;
}
