
import { prisma } from "../lib/prisma.js";

// 1. Find a post by ID with author and comments.
export async function findPostById(id: number) {
  return prisma.post.findUnique({
    where: {
      id,
    },

    include: {
      author: true,

      comments: {
        include: {
          author: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

// 2. Find all posts by a user, newest first.
export async function findPostsByUser(userId: number) {
  return prisma.post.findMany({
    where: {
      authorId: userId,
    },

    orderBy: [
      { createdAt: "desc" },
      { id: "desc" },
    ],
  });
}

// 3. Create a new post.
export async function createPost(
  authorId: number,
  title: string,
  content: string
) {
  return prisma.post.create({
    data: {
      authorId,
      title,
      content,
    },
  });
}

// 4. Create a comment.
export async function createComment(
  postId: number,
  authorId: number,
  text: string
) {
  return prisma.comment.create({
    data: {
      postId,
      authorId,
      text,
    },
  });
}

// 5. Find users who have never posted.
export async function findUsersWithNoPosts() {
  return prisma.user.findMany({
    where: {
      posts: {
        none: {},
      },
    },

    orderBy: {
      id: "asc",
    },
  });
}
