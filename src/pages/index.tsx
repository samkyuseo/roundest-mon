import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

export default function Home() {
  const [ids, updateIds] = useState(() => getOptionsForVote());
  const [first, second] = ids;
  const firstPokemon = trpc["get-pokemon-by-id"].useQuery({ id: first });
  const secondPokemon = trpc["get-pokemon-by-id"].useQuery({ id: second });

  if (firstPokemon.isLoading || secondPokemon.isLoading) {
    return <div>Loading...</div>;
  }

  // console.log(data);
  return (
    <div className="h-screen w-screen flex flex-col justify-center align-middle items-center">
      <div className="text-2xl text-center">Which Pokemon is Rounder?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
        <div className="w-40 h-40">
          <img
            className="w-full h-full"
            src={firstPokemon.data?.sprites.front_default}
          />
        </div>
        <div className="p-8">Vs</div>
        <div className="w-40 h-40">
          {" "}
          <img
            className="w-full h-full"
            src={secondPokemon.data?.sprites.front_default}
          />
        </div>
      </div>
    </div>
  );
}
