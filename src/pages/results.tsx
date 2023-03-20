import { prisma } from "@/server/utils/prisma";
import { GetServerSideProps } from "next";
import { AsyncReturnType } from "@/utils/ts-bs";
import Image from "next/image";

const ResultsPage: React.FC<{
  pokemon: AsyncReturnType<typeof getPokemonInOrder>;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl p-4">Results</h2>
      <div className="flex flex-col w-full max-w-2xl border">
        {props.pokemon.map((currentPokemon, index) => {
          return <PokemonListing pokemon={currentPokemon} key={index} />;
        })}
      </div>
    </div>
  );
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = (
  props
) => {
  return (
    <div className="flex border-b p-2 items-center">
      <Image
        height={"64"}
        width={"64"}
        alt=""
        src={props.pokemon.spriteUrl as string}
      />
      <div className="capitalize">{props.pokemon.name}</div>
    </div>
  );
};

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      VoteFor: { _count: "desc" },
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true,
        },
      },
    },
  });
};

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();
  console.log("did i find pokemon?", pokemonOrdered);
  return { props: { pokemon: pokemonOrdered }, revalidate: 60 };
};

export default ResultsPage;
