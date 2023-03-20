import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { inferQueryResponse } from "./api/trpc/[trpc]";
import Image from "next/image";
import Link from "next/link";
const btn =
  "bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow";

export default function Home() {
  const [ids, updateIds] = useState(() => getOptionsForVote());
  const [first, second] = ids;
  const firstPokemon = trpc["get-pokemon-by-id"].useQuery({ id: first });
  const secondPokemon = trpc["get-pokemon-by-id"].useQuery({ id: second });

  const voteMutation = trpc["cast-vote"].useMutation();

  const dataLoaded =
    !firstPokemon.isLoading &&
    firstPokemon.data &&
    !secondPokemon.isLoading &&
    secondPokemon.data;

  // const dataLoaded = false;

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
      <div className="fixed top-0 left-0 text-2xl w-screen text-center pt-4">
        Which Pokemon is Rounder?
      </div>
      <div className="p-2" />
      {dataLoaded && (
        <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
          <PokemonListing
            pokemon={firstPokemon.data}
            vote={() => voteForRoundest(first)}
          />
          <div className="p-8">Vs</div>
          <PokemonListing
            pokemon={secondPokemon.data}
            vote={() => voteForRoundest(second)}
          />
        </div>
      )}
      {!dataLoaded && <img className="w-45" src="/rings.svg" />}
      <div className="fixed left-0 bottom-0 w-screen p-3 text-xl text-center">
        <a href="https://github.com/samkyuseo/roundest-mon">Github</a>
        {" | "}
        <Link href="/results">Results</Link>
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
      {/* Add image caching on the server */}
      <Image
        height={"200"}
        width={"200"}
        alt=""
        src={props.pokemon.spriteUrl as string}
      />
      <div className="p-3" />
      <div className="text-xl text-center capitalize mt-[-2rem]">
        {props.pokemon.name}
      </div>
      <button className={btn} onClick={() => props.vote()}>
        Rounder
      </button>
    </div>
  );
};
