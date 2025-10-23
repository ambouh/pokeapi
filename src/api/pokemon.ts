export interface Pokemon {
  name: string;
  url: string;
  isFavorite: boolean;
}
export function fetchPokemon(offset: number) {
  return fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=30`)
    .then((response) => response.json())
    .then((data) =>
      data.results.map((pokemon: { name: string; url: string }) => ({
        name: pokemon.name,
        url: pokemon.url,
        isFavorite: false,
      }))
    );
}

export function fetchPokemonTypes(
  list: string[]
): Promise<Record<string, number>> {
  let count: Record<string, number> = {};
  return Promise.all(
    list.map((pokemon) =>
      fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon)
        .then((response: Response) => response.json())
        .then(
          ({
            types,
          }: {
            types: { slot: number; type: { name: string; url: string } }[];
          }) => {
            types.forEach(({ type }) => {
              const name = type?.name;
              //if (!name) return;
              count[name] = (count[name] || 0) + 1;
            });
          }
        )
    )
  ).then(() => count);
}
