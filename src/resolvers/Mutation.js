import { v4 as uuidv4 } from "uuid"

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => {
      return user.email === args.data.email
    })

    if (emailTaken) {
      throw new Error("Email taken.")
    }

    const user = {
      id: uuidv4(),
      ...args.data
    }

    db.users.push(user)

    return user
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    const deletedUsers = db.users.splice(userIndex, 1)

    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id

      if (match) {
        db.comments = db.comments.filter((comment) => {
          return comment.post !== post.id
        })
      }

      return !match
    })

    db.comments = db.comments.filter((comment) => comment.author !== args.id)

    return deletedUsers[0]
  },
  updateUser(parent, { id, data }, { db }, info) {
    const user = db.users.find((user) => user.id === id)

    if (!user) {
      throw new Error("User not found")
    }

    if (typeof data.email === "string") {
      const emailTaken = db.users.some((user) => user.email === data.email)
    }

    if (emailTaken) {
      throw new Error("Email taken")
    }

    if (typeof data.name === "string") {
      user.name = data.name
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age
    }

    return user
  },
  createPost(parent, args, { db, pubsub }, info) {
    // "22811b1a-570e-4cb4-a6b6-47d710d2ed6f"
    const userExists = db.users.some((user) => user.id === args.data.author)

    if (!userExists) {
      throw new Error("User not found")
    }

    const post = {
      id: uuidv4(),
      ...args.data
    }

    db.posts.push(post)

    if (post.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: "Created",
          data: post
        }
      })
    }

    return post
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.find((post) => post.id === args.id)

    if (postIndex === -1) {
      throw new Error("Post not found")
    }

    db.comments = db.comments.filter((comment) => {
      return comment.post !== args.id
    })

    const [post] = db.posts.splice(postIndex, 1)

    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: post
        }
      })
    }

    return post
  },
  // updatePost(id: ID!, data: UpdatePostInput): Post!
  updatePost(parent, { id, data }, { db, pubsub }, info) {
    let { title, body, published } = data
    const post = db.posts.find((post) => post.id === id)
    const origionalPost = { ...post }

    if (!post) {
      throw new Error("Post not found")
    }

    if (typeof title === "string") {
      post.title = title
    }

    if (typeof body === "string") {
      post.body = body
    }
    if (typeof published === "boolean") {
      post.published = published

      console.log("here")

      if (origionalPost.published && !post.published) {
        // deleted
        pubsub.publish("post", {
          post: {
            mutation: "Deleted",
            data: origionalPost
          }
        })
      } else if (!origionalPost.published && post.published) {
        // created
        pubsub.publish("post", {
          post: {
            mutation: "Created",
            data: post
          }
        })
      } else if (post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "Updated",
            data: post
          }
        })
      }
    } else if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "Updated",
          data: post
        }
      })
    }

    return post
  },
  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author)

    if (!userExists) {
      throw new Error("User not found!")
    }

    const postExists = db.posts.some(
      (post) => post.id === args.data.post && post.published
    )

    if (!postExists) {
      throw new Error("Unable to find post")
    }

    const comment = {
      id: uuidv4(),
      ...args.data
    }

    db.comments.push(comment)
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment
      }
    })

    return comment
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    )

    if (commentIndex === -1) {
      throw new Error("Unable to find comment")
    }

    const [deletedComment] = db.comments.splice(commentIndex, 1)
    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment
      }
    })

    return deletedComment
  },
  //updateComment(id: ID!, data: UpdateCommentInput): Comment!
  updateComment(parent, { id, data, pubsub }, { db }, info) {
    let { text } = data
    const comment = db.comments.find((comment) => comment.id === id)

    if (!comment) {
      return "comment not found"
    }

    if (typeof text === "string") {
      comment.text = text
    }

    pubsub.publish(`comment ${commment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment
      }
    })

    return comment
  }
}

export default Mutation
