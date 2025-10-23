import { useQueryClient } from '@tanstack/react-query'
import { Pokemon } from 'api/pokemon'
import { ArrowRight } from 'lucide-react'
import Chip from './chip'
import { useMemo, useState } from 'react'
import { PieChart } from './pie-chart'

interface PokemonListProps {
  searchValue: string
  fetchNextPage: () => void
  hasNextPage: boolean | undefined
  isFetchingNextPage: boolean
  isFavoritesView: boolean
}

const PokemonList = ({
  searchValue,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isFavoritesView
}: PokemonListProps) => {
  const queryClient = useQueryClient()
  const pokemonList: { pages: Pokemon[][] } | undefined =
    queryClient.getQueryData(['pokemon'])

  const [favorites, setFavorites] = useState<Record<string, boolean>>({})

  const filterFavorites = (list: { pages: Pokemon[][] }) => {
    const filtered = list.pages.map((page) =>
      page.filter((pokemon) => !!favorites[pokemon.name])
    )
    return { pages: filtered }
  }

  const view = useMemo(() => {
    if (!pokemonList) return { pages: [] }
    const query = searchValue.trim()

    if (isFavoritesView) {
      return filterFavorites(pokemonList)
    } else if (query.length > 0) {
      const filtered = pokemonList.pages.map((page) =>
        page.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(query.toLowerCase())
        )
      )
      return { pages: filtered }
    } else {
      return pokemonList
    }
  }, [isFavoritesView, pokemonList, favorites, searchValue])

  const isFavoriteEmpty = useMemo(() => {
    for (const key in favorites) {
      if (favorites[key]) return false
    }
    return true
  }, [favorites])

  const favoritesKey = useMemo(() => {
    return Object.keys(favorites).filter((key) => favorites[key])
  }, [favorites])

  return (
    <div className={`col-span-10 col-start-2`}>
      {/* pokemon list */}
      <div className="flex w-full flex-wrap gap-4 px-6">
        {view && view.pages.length > 0 ? (
          <ViewPokemons
            pages={view.pages}
            setFavorites={setFavorites}
            favorites={favorites}
            button={
              !isFavoritesView && (
                <button
                  className={`rounded-3xl bg-[#051031] px-4 py-1 text-sm font-light text-white`}
                  onClick={() => {
                    fetchNextPage()
                  }}
                  disabled={!hasNextPage || isFetchingNextPage}
                >
                  {isFetchingNextPage
                    ? 'Loading...'
                    : hasNextPage
                      ? 'Load the next 30 Pokémon'
                      : 'No More Pokémon'}
                  {hasNextPage && (
                    <ArrowRight className="my-2 inline-block size-6 " />
                  )}
                </button>
              )
            }
          />
        ) : (
          <div className="w-full text-center">No Pokémon found</div>
        )}
      </div>
      {/* pie chart */}
      {isFavoritesView && (
        <div className={`col-span-10 mt-5 flex  justify-center`}>
          {!isFavoriteEmpty ? (
            <div className={`m-4 w-[700px] rounded-2xl bg-white p-4`}>
              <PieChart favorites={favoritesKey} />
            </div>
          ) : (
            <div className="w-full text-center">
              You haven&apos;t favorited any Pokémon yet.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PokemonList

export const ViewPokemons = ({
  pages,
  setFavorites,
  favorites,
  button
}: {
  pages: Pokemon[][]
  setFavorites: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  favorites: Record<string, boolean>
  button: React.ReactNode
}) => {
  const toggleFavorite = (name: string) => {
    setFavorites((prev) => {
      const newFavorites = { ...prev, [name]: !prev[name] }

      return newFavorites
    })
  }
  return (
    <div className={`col-span-10 col-start-2 flex flex-wrap gap-4 px-6`}>
      {pages &&
        pages.map((page) =>
          page.map((pokemon: Pokemon) => {
            return (
              <Chip
                key={pokemon.url}
                pokemon={pokemon}
                toggleFavorite={toggleFavorite}
                isFavorite={favorites[pokemon.name]}
              />
            )
          })
        )}
      {button}
    </div>
  )
}
