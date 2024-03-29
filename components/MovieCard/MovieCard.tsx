import { Card, Group, Text } from "@mantine/core";
import Image, { ImageLoader } from "next/image";
import Link from "next/link";
import React from "react";
import { Movie, User } from "../../lib/interfaces";

import Ratings from "../ratings/Ratings";

interface Props {
  movie: Movie;
  user: User | null;
}


export default function MovieCard({ movie, user }: Props) {


  return (
    <Card withBorder radius="sm" p={0}>
      <Group wrap="nowrap" gap={0}>
        {
          movie.poster_path &&
          <Image loader={tmdbLoader} src={movie.poster_path} alt={movie.title} height={180} width={120}/>
        }
        <Group mx="md">
          <Link href={'/movie/' + movie.id} passHref>
            <Text mt="xs" mb="xs" fw="bold">
              {movie.title}
            </Text>
            <Text c="dimmed" size="xs" mb="md" lineClamp={3}>
              {movie.overview}
            </Text>
          </Link>
          <Group wrap="nowrap" gap="xs">
            {user ? <Ratings movie={movie}/> : ''}
          </Group>
        </Group>
      </Group>
    </Card>
  );
}

const tmdbLoader: ImageLoader = ({ src, width, quality }) => {
  return `https://image.tmdb.org/t/p/w500/${src}?w=${width}&q=${quality || 75}`
}
