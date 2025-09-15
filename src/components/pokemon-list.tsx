import { useQueryClient } from '@tanstack/react-query'
import { Pokemon } from 'api/pokemon'
import { ArrowRight } from 'lucide-react'
import Chip from './chip'

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

export default PokemonList
