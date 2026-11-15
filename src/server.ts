
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Check whether the API is running
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Blog CMS API is running",
  });
});

// GET all posts, including authors and comments
app.get("/api/posts", async (_req, res) => {
  try {
    const posts = await prisma.post.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
});

// GET all comments, including their authors and posts
app.get("/api/comments", async (_req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        author: true,
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
    });
  }
});

// GET all users with their post and comment counts
app.get("/api/users", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Blog CMS API running at http://localhost:${PORT}`);
});
