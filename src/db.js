const users = [
  {
    id: "1",
    name: "Andrew",
    email: "andrew@example.com",
    age: 27
  },
  {
    id: "2",
    name: "Sarah",
    email: "sarah@example.com"
  },
  {
    id: "3",
    name: "Mike",
    email: "mike@example.com"
  }
]

const posts = [
  {
    id: "1",
    title: "GraphQL 101",
    body: "This is how to use GraphQL...",
    published: true,
    author: "1"
  },
  {
    id: "2",
    title: "GraphQL 201",
    body: "This is advanced GraphQL...",
    published: true,
    author: "1"
  },
  {
    id: "3",
    title: "Programming Music",
    body: "La la la la... la la la .. la .. la LA LA LA",
    published: false,
    author: "2"
  }
]

const comments = [
  {
    id: "1",
    text: "This is great",
    author: "1",
    post: "3"
  },
  {
    id: "2",
    text: "The earth is flat, wake up sheeple",
    author: "3",
    post: "1"
  },
  {
    id: "3",
    text: "This post reminds me of something, or someone, long ago.",
    author: "2",
    post: "2"
  },
  {
    id: "4",
    text: "I just ate some toast",
    author: "1",
    post: "3"
  }
]

const db = {
  users,
  posts,
  comments
}

export { db as default }
