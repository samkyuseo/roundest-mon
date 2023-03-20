import { z } from "zod";
import { procedure, router } from "../trpc";
import { PokemonClient } from "pokenode-ts";
import { prisma } from "@/server/utils/prisma";

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input.text}`,
      };
    }),
  "get-pokemon-by-id": procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      // const pokeApiConnection = new PokemonClient();
      // const pokemon = await pokeApiConnection.getPokemonById(input.id);
      const pokemon = await prisma.pokemon.findFirst({
        where: { id: input.id },
      });
      if (!pokemon) throw new Error("lol doesn't exist");
      return pokemon;
    }),
  "cast-vote": procedure
    .input(z.object({ votedFor: z.number(), votedAgainst: z.number() }))
    .mutation(async ({ input }) => {
      const voteInDB = await prisma.vote.create({
        data: {
          ...input,
        },
      });
      return { success: true, vote: voteInDB };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
