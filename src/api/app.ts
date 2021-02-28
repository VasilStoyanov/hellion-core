export interface ProcessEnv {
  [key: string]: string | undefined;
}

import express from 'express';
import { join } from 'path';
import { ApolloServer } from 'apollo-server-express';
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas';
import handleError from './helpers/errorsMapper';
import defaultObserver from './helpers/defaultObserver';
import { QUERY_NAMES } from '../config/queries/queries';
import { MUTATION_NAMES } from '../config/mutations';

const { PORT, NODE_ENV }: ProcessEnv = process.env;

const server = express();

server.use('/_healthcheck', (_req, res) => {
  res.status(200).json({ uptime: process.uptime() });
});

server.listen(4004, () => {
  console.log('Running at localhost:4004');
});

// (async () => {

//   const {
//     handleQuery,
//     handleMutation,
//   } = await require("../middleware/request-broker");

//   const resolversArray = fileLoader(join(__dirname, "./resolvers/"), {
//     recursive: true,
//     extensions: [".js"],
//   });

//   const typesArray = fileLoader(join(__dirname, "./types/"), {
//     recursive: true,
//     extensions: [".gql", ".graphql"],
//   });

//   const typeDefs = mergeTypes(typesArray, { all: true });
//   const resolvers = mergeResolvers(
//     resolversArray.map((currResolver) => {
//       const queryResolversWithInjectedDependencies = currResolver.queryResolvers(
//         {
//           QUERY_NAMES,
//           handleQuery,
//           handleError,
//           defaultObserver,
//         }
//       );

//       const mutationResolversWithInjectedDependencies = currResolver.mutationResolvers(
//         {
//           MUTATION_NAMES,
//           handleMutation,
//           handleError,
//           defaultObserver,
//         }
//       );

//       return {
//         Query: queryResolversWithInjectedDependencies,
//         Mutation: mutationResolversWithInjectedDependencies,
//       };
//     })
//   );

//   const apolloServer = new ApolloServer({
//     typeDefs,
//     resolvers,
//     tracing: true,
//     debug: Boolean(workingEnvironment !== "production"),
//     context: ({ req: { headers } }) => {
//       const token = Boolean(
//         headers && headers.authorization && headers.authorization.length
//       )
//         ? headers.authorization.includes("Bearer")
//           ? headers.authorization.replace("Bearer", "").trim()
//           : headers.authorization
//         : "";

//       return { token };
//     },
//   });

//   const app = express();

//   app.all("/graphql", (req, res, next) => {
//     if (workingEnvironment === "production") {
//       res.redirect("/");
//       return;
//     }

//     next();
//   });

//   apolloServer.applyMiddleware({ app });

//   app.all("*", (req, res) => {
//     res.send(`
//     <a
//     style="padding: 20px; background-color: cyan; margin: 0 0 50% 45%;"
//     href="/graphql">GraphQL Playground</a>
//     `);
//   });

//   app.listen({ port: PORT }, () => {
//     console.info(`> Server online at port: ${PORT}`);

//     !Boolean(workingEnvironment === "production") &&
//       console.info(`> GraphQL Playground: http://localhost:${PORT}/graphql`);
//   });
// })();
