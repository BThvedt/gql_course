import { GraphQLServer, PubSub } from "graphql-yoga"

import Query from "./resolvers/Query.js"
import Mutation from "./resolvers/Mutation.js"
import User from "./resolvers/User.js"
import Post from "./resolvers/Post.js"
import Comment from "./resolvers/Comment.js"
import Subscription from "./resolvers/Subscription"
import db from "./db"
import "./prisma"

// GraphQL Scalar Types = String, Boolean, Int, Float, ID
// Demo user data

// Type definitions (schema)

// Resolvers

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  context: {
    db
  },
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  },
  context: {
    db,
    pubsub
  }
})

server.start(() => {
  console.log("The server is up")
})
