import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { inferQueryResponse } from "./api/trpc/[trpc]";
import Image from "next/image";
const btn =
  "bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow";

export default function Home() {
  const [ids, updateIds] = useState(() => getOptionsForVote());
  const [first, second] = ids;
  const firstPokemon = trpc["get-pokemon-by-id"].useQuery({ id: first });
  const secondPokemon = trpc["get-pokemon-by-id"].useQuery({ id: second });

  const voteMutation = trpc["cast-vote"].useMutation();

  if (firstPokemon.isLoading || secondPokemon.isLoading) {
    return <div>Loading...</div>;
  }

  const voteForRoundest = (selected: number) => {
    // fire mutation to persist changes
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }
    updateIds(getOptionsForVote());
  };
  return (
    <div className="h-screen w-screen flex flex-col justify-center align-middle items-center">
      <div className="text-2xl text-center">Which Pokemon is Rounder?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
        {!firstPokemon.isLoading &&
          firstPokemon.data &&
          !secondPokemon.isLoading &&
          secondPokemon.data && (
            <>
              <PokemonListing
                pokemon={firstPokemon.data}
                vote={() => voteForRoundest(first)}
              />
              <div className="p-8">Vs</div>
              <PokemonListing
                pokemon={secondPokemon.data}
                vote={() => voteForRoundest(second)}
              />
            </>
          )}
      </div>
      <div className="fixed left-0 bottom-0 w-screen p-3">
        <a href="https://github.com/samkyuseo/roundest-mon" target="_blank">
          Github
        </a>
      </div>
    </div>
  );
}

type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">;

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <div className="w-64 h-64 flex flex-col items-center">
      <Image
        height={"200"}
        width={"200"}
        alt=""
        src={props.pokemon.sprites.front_default as string}
      />
      <div className="text-xl text-center capitalize mt-[-2rem]">
        {props.pokemon.name}
      </div>
      <button className={btn} onClick={() => props.vote()}>
        Rounder
      </button>
    </div>
  );
};
