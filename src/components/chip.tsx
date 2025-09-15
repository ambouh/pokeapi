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
  const handleFavoriteToggle = (pageIndex: number, pokemonIndex: number) => {
    queryClient.setQueryData(['pokemon'], (oldData: { pages: Pokemon[][] }) => {
      if (!oldData) return oldData
      const newPages = oldData.pages.map((page, pIdx) =>
        pIdx === pageIndex
          ? page.map((poke, idx) =>
              idx === pokemonIndex
                ? { ...poke, isFavorite: !poke.isFavorite }
                : poke
            )
          : page
      )
      return { ...oldData, pages: newPages }
    })
  }
  return (
    <div
      className={`${
        pokemon.isFavorite ? 'bg-[#e2e4f3]' : 'bg-[#f1f2f9]'
      } cursor-pointer rounded-lg px-4 py-2 font-light text-[#0d0d0e] hover:bg-[#e2e4f3]`}
      onClick={() => handleFavoriteToggle(pageIndex, pokemonIndex)}
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
