import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use("*", cors());
app.use("*", logger(console.log));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Helper to get user from token
async function getUserFromToken(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error) {
    console.log(`Authorization error while validating user token: ${error.message}`);
    return null;
  }
  return user;
}

// Initialize demo data if not exists
app.get("/make-server-a6ee9750/init", async (c) => {
  try {
    // Check if demo data already exists
    const existingReviews = await kv.getByPrefix("review-");
    if (existingReviews.length > 0) {
      return c.json({ message: "Demo data already initialized" });
    }

    // Create demo reviews
    const demoReviews = [
      {
        id: "review-1",
        userId: "user-2",
        contentId: "content-1",
        rating: 5,
        text: "Absolutely breathtaking! The visuals are stunning and the story kept me on the edge of my seat. Best sci-fi film in years!",
        timestamp: new Date("2026-02-20T19:30:00").toISOString(),
        likes: 12,
        likedBy: ["user-1", "user-3"],
      },
      {
        id: "review-2",
        userId: "user-3",
        contentId: "content-1",
        rating: 4,
        text: "Great film with amazing special effects. The plot could have been tighter, but overall a solid watch.",
        timestamp: new Date("2026-02-19T21:15:00").toISOString(),
        likes: 8,
        likedBy: ["user-1"],
      },
      {
        id: "review-3",
        userId: "user-4",
        contentId: "content-2",
        rating: 5,
        text: "Season 3 finale was incredible! The character development throughout this series has been phenomenal. Can't wait for season 4!",
        timestamp: new Date("2026-02-21T14:20:00").toISOString(),
        likes: 15,
        likedBy: ["user-1", "user-2", "user-5"],
      },
    ];

    // Store reviews
    await kv.mset(
      demoReviews.map((review) => ({ key: review.id, value: review }))
    );

    return c.json({ message: "Demo data initialized", count: demoReviews.length });
  } catch (error) {
    console.log(`Error initializing demo data: ${error}`);
    return c.json({ error: "Failed to initialize demo data" }, 500);
  }
});

// Get all reviews for a specific content
app.get("/make-server-a6ee9750/reviews/content/:contentId", async (c) => {
  try {
    const contentId = c.req.param("contentId");
    const allReviews = await kv.getByPrefix("review-");

    const contentReviews = allReviews.filter(
      (review: any) => review.contentId === contentId
    );

    return c.json({ reviews: contentReviews });
  } catch (error) {
    console.log(`Error fetching reviews for content: ${error}`);
    return c.json({ error: "Failed to fetch reviews" }, 500);
  }
});

// Get all reviews by a user
app.get("/make-server-a6ee9750/reviews/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const allReviews = await kv.getByPrefix("review-");

    const userReviews = allReviews.filter(
      (review: any) => review.userId === userId
    );

    return c.json({ reviews: userReviews });
  } catch (error) {
    console.log(`Error fetching reviews by user: ${error}`);
    return c.json({ error: "Failed to fetch reviews" }, 500);
  }
});

// Get recent reviews from friends
app.get("/make-server-a6ee9750/reviews/feed", async (c) => {
  try {
    const friendIds = c.req.query("friendIds")?.split(",") || [];
    const allReviews = await kv.getByPrefix("review-");

    const friendReviews = allReviews
      .filter((review: any) => friendIds.includes(review.userId))
      .sort(
        (a: any, b: any) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

    return c.json({ reviews: friendReviews });
  } catch (error) {
    console.log(`Error fetching friend reviews: ${error}`);
    return c.json({ error: "Failed to fetch friend reviews" }, 500);
  }
});

// Create a new review
app.post("/make-server-a6ee9750/reviews", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, contentId, rating, text } = body;

    if (!userId || !contentId || !rating) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    if (rating < 1 || rating > 5) {
      return c.json({ error: "Rating must be between 1 and 5" }, 400);
    }

    if (text && text.length > 250) {
      return c.json({ error: "Review text must be 250 characters or less" }, 400);
    }

    const reviewId = `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const review = {
      id: reviewId,
      userId,
      contentId,
      rating,
      text: text || "",
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
    };

    await kv.set(reviewId, review);

    return c.json({ review }, 201);
  } catch (error) {
    console.log(`Error creating review: ${error}`);
    return c.json({ error: "Failed to create review" }, 500);
  }
});

// Update a review
app.put("/make-server-a6ee9750/reviews/:reviewId", async (c) => {
  try {
    const reviewId = c.req.param("reviewId");
    const body = await c.req.json();
    const { rating, text } = body;

    const existingReview = await kv.get(reviewId);
    if (!existingReview) {
      return c.json({ error: "Review not found" }, 404);
    }

    if (rating && (rating < 1 || rating > 5)) {
      return c.json({ error: "Rating must be between 1 and 5" }, 400);
    }

    if (text && text.length > 250) {
      return c.json({ error: "Review text must be 250 characters or less" }, 400);
    }

    const updatedReview = {
      ...existingReview,
      ...(rating && { rating }),
      ...(text !== undefined && { text }),
    };

    await kv.set(reviewId, updatedReview);

    return c.json({ review: updatedReview });
  } catch (error) {
    console.log(`Error updating review: ${error}`);
    return c.json({ error: "Failed to update review" }, 500);
  }
});

// Delete a review
app.delete("/make-server-a6ee9750/reviews/:reviewId", async (c) => {
  try {
    const reviewId = c.req.param("reviewId");

    const existingReview = await kv.get(reviewId);
    if (!existingReview) {
      return c.json({ error: "Review not found" }, 404);
    }

    await kv.del(reviewId);

    return c.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.log(`Error deleting review: ${error}`);
    return c.json({ error: "Failed to delete review" }, 500);
  }
});

// Like/unlike a review
app.post("/make-server-a6ee9750/reviews/:reviewId/like", async (c) => {
  try {
    const reviewId = c.req.param("reviewId");
    const body = await c.req.json();
    const { userId } = body;

    if (!userId) {
      return c.json({ error: "Missing userId" }, 400);
    }

    const review = await kv.get(reviewId);
    if (!review) {
      return c.json({ error: "Review not found" }, 404);
    }

    const likedBy = review.likedBy || [];
    const isLiked = likedBy.includes(userId);

    const updatedReview = {
      ...review,
      likedBy: isLiked
        ? likedBy.filter((id: string) => id !== userId)
        : [...likedBy, userId],
      likes: isLiked ? review.likes - 1 : review.likes + 1,
    };

    await kv.set(reviewId, updatedReview);

    return c.json({ review: updatedReview });
  } catch (error) {
    console.log(`Error liking/unliking review: ${error}`);
    return c.json({ error: "Failed to like/unlike review" }, 500);
  }
});

// Get user connections (friends)
app.get("/make-server-a6ee9750/connections/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const connectionKey = `connections-${userId}`;
    const connections = await kv.get(connectionKey);

    return c.json({ connections: connections || [] });
  } catch (error) {
    console.log(`Error fetching connections: ${error}`);
    return c.json({ error: "Failed to fetch connections" }, 500);
  }
});

// Add a connection
app.post("/make-server-a6ee9750/connections", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, friendId } = body;

    if (!userId || !friendId) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Get existing connections
    const connectionKey = `connections-${userId}`;
    const connections = (await kv.get(connectionKey)) || [];

    if (!connections.includes(friendId)) {
      connections.push(friendId);
      await kv.set(connectionKey, connections);
    }

    return c.json({ connections }, 201);
  } catch (error) {
    console.log(`Error adding connection: ${error}`);
    return c.json({ error: "Failed to add connection" }, 500);
  }
});

// Health check
app.get("/make-server-a6ee9750/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);
