import { Combobox, Group, Loader, Stack, Text, TextInput, useCombobox } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import Image, { ImageLoader } from "next/image";
import Router from "next/router";
import { useEffect, useRef, useState } from "react";

import { searchMovies } from "../../lib/tmdb.api";

export default function SearchMovie() {
  const [value, setValue] = useState('');
  const [debounced] = useDebouncedValue(value, 300);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ value: string; id: number; img: string | null; year: string }[]>([]);
  const [empty, setEmpty] = useState(false);
  const abortController = useRef<AbortController>(undefined);

  useEffect(() => {
    abortController.current?.abort();
    abortController.current = new AbortController();

    if (debounced.trim().length === 0) {
      setLoading(false);
    } else {
      setLoading(true);
      searchMovies(debounced, abortController.current?.signal).then((response) => {
        setLoading(false);
        setData(response.results.map(movie => ({
          value: movie.title,
          id: movie.id,
          img: movie.poster_path,
          year: movie.release_date.substring(0, 4)
        })));
        setEmpty(response.results.length === 0);
      });
    }
  }, [debounced]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });


  const options = data.map((item) => (
    <Combobox.Option value={item.id.toString()} key={item.id}>
      <Group>
        {item.img
          ? <Image loader={tmdbLoader}
                   src={item.img}
                   width={40}
                   height={56}
                   alt="Poster of the film"/>
          : <div style={{ width: 40, height: 56 }}/>
        }
        <Stack>
          <Text fz="sm" fw={500}>
            {item.value}
          </Text>
          <Text fz="xs" opacity={0.6}>
            {item.year}
          </Text>
        </Stack>
      </Group>
    </Combobox.Option>
  ));

  return (

    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        Router.push(`/movie/${val}`)
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <TextInput
          placeholder="Search films"
          value={value}
          onChange={(event) => {
            setValue(event.currentTarget.value);
            combobox.resetSelectedOption();
            combobox.openDropdown();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => {
            combobox.openDropdown();
          }}
          onBlur={() => combobox.closeDropdown()}
          rightSection={loading && <Loader size={18}/>}
          w={300}
          mb={16}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options}
          {empty && <Combobox.Empty>No results found</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

const tmdbLoader: ImageLoader = ({ src, width, quality }) => {
  return `https://image.tmdb.org/t/p/w92/${src}?w=${width}&q=${quality || 75}`
}