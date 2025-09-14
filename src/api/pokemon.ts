export interface Pokemon {
  name: string
  url: string
  isFavorite: boolean
}
export function fetchPokemon(offset: number) {
  return fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=30`)
    .then((response) => response.json())
    .then((data) =>
      data.results.map((pokemon: { name: string; url: string }) => ({
        name: pokemon.name,
        url: pokemon.url,
        isFavorite: false
      }))
    )
}
