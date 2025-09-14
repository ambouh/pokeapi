import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchPokemon, Pokemon } from 'api/pokemon'
import { useState } from 'react'
import Submit from 'assets/submit.png'
import Logo from 'assets/pokeapi-logo.png'
import Chip from './chip'

const PokemonApp = () => {
  const [offset, setOffset] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['pokemon'],
    queryFn: ({ pageParam }) => fetchPokemon(pageParam),
    initialPageParam: 0,
    getNextPageParam: () => {
      const isMax = offset + 30 >= 150
      if (isMax) return undefined
      return offset + 30
    }
  })
  //const [pokemonList, setPokemonList] = useState<Pokemon[][]>(data?.pages || [])
  const handleSearch = (value: string) => {
    console.log('Searching for:', value)
  }
  return (
    <div
      className={
        ` border border-dashed border-red-500 ` +
        `relative h-screen bg-[#f8f9fc]`
      }
    >
      <div
      //className="sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40"
      >
        <div>
          <img src={Logo} alt="Poke Api Logo" />
          <div>
            <p>Search the first 150 Pokemon and mark your favorites!</p>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search for a Pokemon..."
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                handleSearch((e.target as HTMLInputElement).value)
              }
            />
            <button onClick={() => handleSearch(searchValue)}>
              <img src={Submit} alt="Submit" />
            </button>
          </div>
        </div>
        {/* <PokemonSearch /> */}
        {data && (
          <PokemonList
            pokemonList={data}
            setOffset={setOffset}
            fetchNextPage={fetchNextPage}
          />
        )}
        <button
          onClick={() => {
            // update offset count BUT is not reflected in the query until next fetch
            setOffset((prev) => prev + 30)
            fetchNextPage()
          }}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading...'
            : hasNextPage
              ? 'Load the next 30 Pokémon'
              : 'No More Pokémon'}
        </button>
      </div>
    </div>
  )
}
// interface PokemonSearchProps {}

// const PokemonSearch = (pokemonSearch: PokemonSearchProps) => {
//   return (
//     <div>
//       <h1>Pokemon Search</h1>
//     </div>
//   )
// }
interface PokemonListProps {
  pokemonList: { pages: Pokemon[][] }
  setOffset: (offset: number) => void
  fetchNextPage: () => void
}
const PokemonList = ({ pokemonList }: PokemonListProps) => {
  return (
    <div className={`grid grid-cols-12 pb-10`}>
      <div className={`col-span-10 col-start-2 flex flex-wrap gap-4 px-6`}>
        {pokemonList &&
          pokemonList.pages.map((page, pageIndex: number) =>
            page.map((pokemon: Pokemon, index) => (
              <Chip
                key={pokemon.url}
                label={pokemon.name}
                isFavorite={pokemon.isFavorite}
                setList={() => {}}
                index={index + pageIndex * 30}
              />
            ))
          )}
      </div>
    </div>
  )
}
export default PokemonApp
