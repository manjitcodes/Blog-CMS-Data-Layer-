
import { prisma } from "../src/lib/prisma.js";

async function main() {
  // Clear old sample data in dependency order.
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const names = [
    "Manjit",
    "Sita",
    "Ram",
    "Anita",
    "Hari",
    "Gita",
    "Bikash",
    "Nisha",
    "Prakash",
    "Rita",
    "Suman",
    "Puja",
  ];

  // Create 12 users.
  const users = [];

  for (let i = 0; i < names.length; i++) {
    const user = await prisma.user.create({
      data: {
        name: names[i],
        email: `bloguser${i + 1}@example.com`,
      },
    });

    users.push(user);
  }

  const topics = [
    "PostgreSQL Basics",
    "Prisma ORM",
    "Node.js Streams",
    "REST API Design",
    "MongoDB Aggregation",
    "Database Indexing",
    "TypeScript Fundamentals",
    "Backend Authentication",
    "SQL Joins",
    "Express Middleware",
    "Database Transactions",
    "API Error Handling",
  ];

  // Create 36 posts across 10 users.
  // The final 2 users intentionally have no posts.
  const posts = [];

  const baseDate = new Date("2026-09-01T12:00:00Z");

  for (let i = 0; i < 36; i++) {
    const author = users[i % 10];
    const topic = topics[i % topics.length];

    const createdAt = new Date(
      baseDate.getTime() + i * 24 * 60 * 60 * 1000
    );

    const post = await prisma.post.create({
      data: {
        title: `${topic} - Article ${i + 1}`,

        content:
          `This article explains ${topic.toLowerCase()} ` +
          "with practical examples for backend developers.",

        authorId: author.id,
        createdAt,
      },
    });

    posts.push(post);
  }

  const commentTexts = [
    "Great explanation!",
    "This helped me understand the topic.",
    "Very useful example.",
    "Can you explain this further?",
    "Thanks for sharing!",
    "I tried this in my project.",
    "Clear and practical article.",
    "Looking forward to more content.",
  ];

  // Create 120 comments across 33 posts.
  // The final 3 posts intentionally have zero comments.
  for (let i = 0; i < 120; i++) {
    const post = posts[i % 33];
    const author = users[(i + 3) % users.length];

    const createdAt = new Date(
      baseDate.getTime() + i * 60 * 60 * 1000
    );

    await prisma.comment.create({
      data: {
        text: commentTexts[i % commentTexts.length],
        postId: post.id,
        authorId: author.id,
        createdAt,
      },
    });
  }

  console.log("Seed successful!");

  console.log("Users:", await prisma.user.count());
  console.log("Posts:", await prisma.post.count());
  console.log("Comments:", await prisma.comment.count());
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
