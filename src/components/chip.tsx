import { useQueryClient } from "@tanstack/react-query";
import { Pokemon } from "api/pokemon";
import Favorited from "src/assets/favorited.png";
import Unfavorited from "src/assets/unfavorited.png";

const Chip = ({
  pokemon,
  toggleFavorite,
  isFavorite,
}: {
  pokemon: Pokemon;
  toggleFavorite: (name: string) => void;
  isFavorite: boolean;
}) => {
  return (
    <div
      className={`${
        isFavorite ? "bg-[#e2e4f3]" : "bg-[#f1f2f9]"
      } cursor-pointer rounded-lg px-4 py-2 font-light text-[#0d0d0e] hover:bg-[#e2e4f3]`}
      onClick={() => toggleFavorite(pokemon.name)}
    >
      <span>{pokemon.name}</span>
      {isFavorite ? (
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
  );
};

export default Chip;
