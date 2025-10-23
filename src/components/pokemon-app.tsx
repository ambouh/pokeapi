import { QueryErrorResetBoundary, useInfiniteQuery } from "@tanstack/react-query";
import { fetchPokemon } from "api/pokemon";
import {
  Component,
  Suspense,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import Submit from "assets/submit.png";
import Logo from "assets/pokeapi-logo.png";

import PokemonList from "./pokemon-list";

const PAGE_SIZE = 30;
const MAX_POKEMON = 150;

const PokemonApp = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFavoritesView, setIsFavoritesView] = useState(false);

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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setSearchQuery(e.currentTarget.value.trim());
                  }
                }}
                className="mr-2 w-full rounded text-lg font-light text-[#5b6888] outline-none"
              />
              <button
                onClick={() => setSearchQuery(searchValue.trim())}
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
        {/* results */}
        <div className="col-span-10 col-start-2">
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <PokemonErrorBoundary
                onReset={reset}
                fallback={(handleReset) => (
                  <div className="rounded-3xl bg-white p-6 text-center text-red-500">
                    <p className="mb-3 font-medium">
                      Failed to load Pokémon. Please try again.
                    </p>
                    <button
                      className="rounded-full bg-[#011345] px-4 py-2 text-sm text-white"
                      onClick={handleReset}
                    >
                      Retry
                    </button>
                  </div>
                )}
              >
                <Suspense
                  fallback={
                    <div className="rounded-3xl bg-white p-6 text-center text-[#5b6888]">
                      Loading Pokédex...
                    </div>
                  }
                >
                  <PokemonListSection
                    key={searchQuery}
                    searchValue={searchQuery}
                    isFavoritesView={isFavoritesView}
                  />
                </Suspense>
              </PokemonErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </div>
      </div>
    </div>
  );
};

const PokemonListSection = ({
  searchValue,
  isFavoritesView,
}: {
  searchValue: string;
  isFavoritesView: boolean;
}) => {
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["pokemon"],
    queryFn: ({ pageParam = 0 }) => fetchPokemon(pageParam),
    initialPageParam: 0,
    getNextPageParam: (_lastPage, pages) => {
      const nextOffset = pages.length * PAGE_SIZE;
      return nextOffset >= MAX_POKEMON ? undefined : nextOffset;
    },
    suspense: true,
    useErrorBoundary: true,
  });

  return (
    <PokemonList
      searchValue={searchValue}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isFavoritesView={isFavoritesView}
    />
  );
};

type PokemonErrorBoundaryProps = {
  children: ReactNode;
  fallback: (reset: () => void) => ReactNode;
  onReset?: () => void;
};

type PokemonErrorBoundaryState = {
  hasError: boolean;
};

class PokemonErrorBoundary extends Component<
  PokemonErrorBoundaryProps,
  PokemonErrorBoundaryState
> {
  state: PokemonErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): PokemonErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Pokemon list failed to load", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback(this.handleReset);
    }

    return this.props.children;
  }
}

export default PokemonApp;
