import { useQueryClient } from '@tanstack/react-query'
import { Pokemon } from 'api/pokemon'
import Favorited from 'src/assets/favorited.png'
import Unfavorited from 'src/assets/unfavorited.png'

const Chip = ({
  pokemon,
  pageIndex,
  pokemonIndex
}: {
  pokemon: Pokemon
  pageIndex: number
  pokemonIndex: number
}) => {
  const queryClient = useQueryClient()
  const handleFavoriteToggle = (
    pokemon: Pokemon,
    pageIndex: number,
    pokemonIndex: number
  ) => {
    queryClient.setQueryData(['pokemon'], (oldData: { pages: Pokemon[][] }) => {
      const newData = { ...oldData }
      newData.pages[pageIndex][pokemonIndex].isFavorite = !pokemon.isFavorite
      return newData
    })
  }
  return (
    <div
      className={`${
        pokemon.isFavorite ? 'bg-[#e2e4f3]' : 'bg-[#f1f2f9]'
      } cursor-pointer rounded-lg px-4 py-2 font-light text-[#0d0d0e] hover:bg-[#e2e4f3]`}
      onClick={() => handleFavoriteToggle(pokemon, pageIndex, pokemonIndex)}
    >
      <span>{pokemon.name}</span>
      {pokemon.isFavorite ? (
        <img
          src={Favorited}
          alt="Favorited"
          className="my-2 ml-2 inline-block size-4 "
        />
      ) : (
        <img
          src={Unfavorited}
          alt="Unfavorited"
          className="my-2 ml-2 inline-block size-4 "
        />
      )}
    </div>
  )
}

export default Chip
