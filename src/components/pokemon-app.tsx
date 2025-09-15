import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { fetchPokemon, Pokemon } from 'api/pokemon'
import { useState } from 'react'
import Submit from 'assets/submit.png'
import Logo from 'assets/pokeapi-logo.png'
import Chip from './chip'
import { ArrowRight } from 'lucide-react'

const PokemonApp = () => {
  const [offset, setOffset] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [onsearch, setOnsearch] = useState(false)
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
      console.log('isMax:', isMax, 'offset:', offset, 'offset+30:', offset + 30)
      if (isMax) return undefined
      return offset + 30
    }
  })

  return (
    <div
      className={
        // ` border border-dashed border-red-500 ` +
        `relative h-screen overflow-auto bg-[#f8f9fc]`
      }
    >
      <div className="xs:pt-16 grid grid-cols-12 pb-10 sm:pt-24 lg:pt-40">
        {/* search */}
        <div
          className={`col-span-10 col-start-2 mb-10 rounded-3xl bg-[#E9EAF4] p-6`}
        >
          <div className={`grid gap-4`}>
            <img src={Logo} alt="Poke Api Logo" className="w-32" />
            <div>
              <p>Search the first 150 Pokemon and mark your favorites!</p>
            </div>
            <div className="flex w-full justify-between rounded-[15px] bg-white px-6 py-2">
              <input
                type="text"
                placeholder="Search for a Pokemon..."
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setOnsearch(!onsearch)}
                className="mr-2 w-full rounded text-lg font-light text-[#5b6888] outline-none"
              />
              <button
                onClick={() => setOnsearch(!onsearch)}
                className="grid size-10 place-items-center rounded-[15px] bg-[#011345]"
              >
                <img src={Submit} alt="Submit" className="w-5" />
              </button>
            </div>
            {/* view all / view favorites */}
            <div className="flex justify-end text-[#4353cc]">
              <button className="mr-2 px-4 py-2 " onClick={() => {}}>
                View All
              </button>
              <button className="px-4 py-2 " onClick={() => {}}>
                View Favorites
              </button>
            </div>
          </div>
        </div>
        {/* <PokemonSearch /> */}
        <div className="col-span-10 col-start-2">
          <PokemonList
            searchValue={searchValue}
            onSearch={onsearch}
            setOffset={setOffset}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
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
  searchValue: string
  onSearch: boolean
  setOffset: (offset: number) => void
  fetchNextPage: () => void
  hasNextPage: boolean | undefined
  isFetchingNextPage: boolean
}

const PokemonList = ({
  searchValue,
  onSearch,
  setOffset,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage
}: PokemonListProps) => {
  const queryClient = useQueryClient()
  const pokemonList = queryClient.getQueryData(['pokemon'])
  return (
    <div className={`col-span-10 col-start-2 flex flex-wrap gap-4 px-6`}>
      {pokemonList &&
        pokemonList.pages.map((page, pageIndex: number) =>
          page.map((pokemon: Pokemon, pokemonIndex: number) => {
            if (onSearch) {
              return pokemon.name
                .toLowerCase()
                .includes(searchValue.toLowerCase()) ? (
                <Chip
                  key={pokemon.url}
                  pokemon={pokemon}
                  // setFavorite={setFavorite}
                  pageIndex={pageIndex}
                  pokemonIndex={pokemonIndex}
                />
              ) : null
            } else {
              return (
                <Chip
                  key={pokemon.url}
                  pokemon={pokemon}
                  // setFavorite={setFavorite}
                  pageIndex={pageIndex}
                  pokemonIndex={pokemonIndex}
                />
              )
            }
          })
        )}
      <button
        className={`rounded-3xl bg-[#051031] px-4 py-1 text-sm font-light text-white`}
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
        {hasNextPage && <ArrowRight className="my-2 inline-block size-6 " />}
      </button>
    </div>
  )
}
export default PokemonApp
