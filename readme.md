# Blog CMS Data Layer

Phase 6 Database Capstone Project

## Overview

A reusable data layer for a Blog Content Management System built using PostgreSQL, Prisma ORM, TypeScript, and Node.js.

## Technologies

- PostgreSQL
- Prisma ORM
- TypeScript
- Node.js

## Database Models

The application contains three models: User, Post, and Comment.

- One user can create multiple posts.
- One user can write multiple comments.
- One post can have multiple comments.

## Repository Functions

1. `findPostById(id)` — Returns a post with its author and comments, including comment authors, or null if not found.
2. `findPostsByUser(userId)` — Returns posts by a user, newest first.
3. `createPost(authorId, title, content)` — Creates a post.
4. `createComment(postId, authorId, text)` — Creates a comment.
5. `findUsersWithNoPosts()` — Returns users who have never posted.

## Setup

Install dependencies:

```bash
npm install
```

Create a PostgreSQL database named `blog_cms`.

Create a `.env` file:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/blog_cms"
```

Apply migrations:

```bash
npx prisma migrate deploy
```

Generate Prisma Client:

```bash
npx prisma generate
```

Seed the database:

```bash
npx prisma db seed
```

## Sample Data

The seed script generates:

- 12 users
- 36 posts
- 120 comments

Two users have no posts, and three posts have no comments to support edge-case testing.

## Testing

Check TypeScript:

```bash
npm run typecheck
```

Run repository tests:

```bash
npm run test:repo
```

## Project Structure

- `prisma/schema.prisma` — Database models
- `prisma/migrations/` — Database migrations
- `prisma/seed.ts` — Sample data
- `src/lib/prisma.ts` — Prisma connection
- `src/repositories/blog.repository.ts` — Repository functions
- `src/test-repository.ts` — Repository tests
- `docs/er-diagram.md` — ER diagram
- `docs/verification.md` — Migration and seed verification evidence

## Architecture

Database operations are encapsulated in the repository layer so future API routes and services can reuse the same functions without directly querying Prisma models.

## Future Scope

This data layer is designed to be reused in the Phase 9 Next.js full-stack Blog CMS project.