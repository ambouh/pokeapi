import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchPokemon } from 'api/pokemon'
import { useState } from 'react'
import Submit from 'assets/submit.png'
import Logo from 'assets/pokeapi-logo.png'

import PokemonList from './pokemon-list'

const PokemonApp = () => {
  const [offset, setOffset] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [onsearch, setOnsearch] = useState(false)
  const [isFavoritesView, setIsFavoritesView] = useState(false)
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
      // console.log('isMax:', isMax, 'offset:', offset, 'offset+30:', offset + 30)
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
              <button
                className="mr-2 px-4 py-2 "
                onClick={() => setIsFavoritesView(false)}
              >
                View All
              </button>
              <button
                className="px-4 py-2 "
                onClick={() => setIsFavoritesView(true)}
              >
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
            isFavoritesView={isFavoritesView}
          />
        </div>
      </div>
    </div>
  )
}

export default PokemonApp
