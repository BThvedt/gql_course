import { Prisma } from "prisma-binding"

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466"
})

// prisma.query
// prisma.mutation
// prisma.subscriopion
// prisma.query.users(null, "{ id name email posts {id title} }").then((data) => {
//   console.log(data)
//   console.log(JSON.stringify(data, undefined, 2))
// })

// prisma.query.comments(null, "{id, text}").then((data) => {
//   console.log(JSON.stringify(data, undefined, 2))
// })

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: "101 GraphQL",
//         body: "You can find the new course here",
//         published: false,
//         author: {
//           connect: {
//             id: "ckkdge4hl00bt08894m7tm0g2"
//           }
//         }
//       }
//     },
//     "{id title body published}"
//   )
//   .then((data) => {
//     console.log(data)
//     return prisma.query.users(null, "{ id name email posts {id title} }")
//   })
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2))
//   })

// prisma.mutation
//   .updatePost({
//     where: {
//       id: "ckkdkbl03015c08891xtue3kz"
//     },
//     data: {
//       title: "A TITLE",
//       body: "POST BODY",
//       published: false
//     }
//   })
//   .then((data) => {
//     return prisma.query.posts(null, "{id, body}")
//   })
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2))
//   })

// 1. Create a new post
// 2. Fetch all of the info about the user

// const createPostForUser = async (authorId, data) => {
//   const userExists = await prisma.exists.User({ id: authorId })

//   if (!userExists) {
//     throw new Error("User not found")
//   }

//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorId
//           }
//         }
//       }
//     },
//     "{ author {id name email posts {id title published}} }"
//   )
//   // const user = await prisma.query.user(
//   //   {
//   //     where: {
//   //       id: authorId
//   //     }
//   //   },
//   //   "{id name email posts {id title published}}"
//   // )
//   return post.author
// }

// createPostForUser("ckkdge4hl00bt08894m7tm0g2", {
//   title: "Great books to read",
//   body: "the war of art",
//   published: true
// })
//   .then((user) => {
//     // console.log("--------------------------")
//     console.log(JSON.stringify(user, undefined, 2))
//   })
//   .catch((error) => {
//     console.log(error)
//   })

const updatePostForUser = async (postId, data) => {
  //console.log("UPDATING POST FOR USER")
  const postExists = await prisma.exists.Post({ id: postId })

  if (!postExists) {
    throw new Error("Post not found")
  }

  const post = await prisma.mutation.updatePost(
    {
      where: {
        id: postId
      },
      data
    },
    "{author {id name email posts {id title published}} }"
  )
  // const user = await prisma.query.user(
  //   {
  //     where: {
  //       id: post.author.id
  //     }
  //   },
  //   "{id name email posts {id title published}}"
  // )
  // return user
  return post.author
}

updatePostForUser("ckkdkbl03015c08891xtue3kz", { published: false })
  .then((user) => {
    console.log(JSON.stringify(user, undefined, 2))
  })
  .catch((error) => {
    console.log(error.meassage)
  })

// prisma.exists
//   .Comment({
//     id: "ckkdlkydk01nc0889w301xhc6"
//   })
//   .then((exists) => {
//     console.log(exists)
//   })
