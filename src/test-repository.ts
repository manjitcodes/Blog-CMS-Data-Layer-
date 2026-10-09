
import assert from "node:assert/strict";

import {
  findPostById,
  findPostsByUser,
  createPost,
  createComment,
  findUsersWithNoPosts,
} from "./repositories/blog-repository.js";

import { prisma } from "./lib/prisma.js";

async function main() {
  console.log("Testing Blog CMS Repository...\n");

  // TEST 1: Users who have no posts.
  const usersWithoutPosts = await findUsersWithNoPosts();

  console.log("1. Users without posts:");
  console.log(usersWithoutPosts);

  assert.ok(
    usersWithoutPosts.length >= 2,
    "Expected at least two users without posts"
  );

  const userId = usersWithoutPosts[0].id;

  // TEST 2: User with zero posts.
  const initialPosts = await findPostsByUser(userId);

  assert.equal(initialPosts.length, 0);

  console.log("2. User with zero posts: PASS");

  // TEST 3: Create a post.
  const newPost = await createPost(
    userId,
    "My First CMS Post",
    "This is a test article created through the repository."
  );

  assert.equal(newPost.authorId, userId);

  console.log("3. Create post: PASS");

  // TEST 4: Find a post with zero comments.
  const emptyPost = await findPostById(newPost.id);

  assert.ok(emptyPost);
  assert.equal(emptyPost.comments.length, 0);

  console.log("4. Post with zero comments: PASS");

  // TEST 5: Create a comment.
  const newComment = await createComment(
    newPost.id,
    userId,
    "My first comment!"
  );

  assert.equal(newComment.postId, newPost.id);

  console.log("5. Create comment: PASS");

  // TEST 6: Retrieve post with author and comments.
  const postWithComments = await findPostById(newPost.id);

  assert.ok(postWithComments);
  assert.equal(postWithComments.author.id, userId);
  assert.equal(postWithComments.comments.length, 1);
  assert.equal(
    postWithComments.comments[0].author.id,
    userId
  );

  console.log("6. Post with related authors: PASS");

  // TEST 7: Find posts by user.
  const userPosts = await findPostsByUser(userId);

  assert.ok(
    userPosts.some((post) => post.id === newPost.id)
  );

  console.log("7. Find posts by user: PASS");

  // TEST 8: Missing post returns null.
  const missingPost = await findPostById(999999999);

  assert.equal(missingPost, null);

  console.log("8. Missing post returns null: PASS");

  console.log("\nAll repository tests passed!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
