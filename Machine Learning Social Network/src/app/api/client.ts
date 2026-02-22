// API client for interacting with the backend server
import { projectId, publicAnonKey } from "/utils/supabase/info";
import {
  reviews as mockReviews,
  getReviewsForContent as mockGetReviewsForContent,
  getReviewsByUser as mockGetReviewsByUser,
  friends,
} from "../data/mockData";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a6ee9750`;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${publicAnonKey}`,
};

export interface Review {
  id: string;
  userId: string;
  contentId: string;
  rating: number;
  text: string;
  timestamp: string;
  likes: number;
  likedBy: string[];
}

// Convert mock review (Date timestamp) to API Review (string timestamp)
function toApiReview(r: {
  id: string;
  userId: string;
  contentId: string;
  rating: number;
  text: string;
  timestamp: Date;
  likes: number;
  likedBy: string[];
}): Review {
  return {
    ...r,
    timestamp:
      r.timestamp instanceof Date
        ? r.timestamp.toISOString()
        : String(r.timestamp),
  };
}

// Initialize demo data (no-op if backend unavailable)
export async function initDemoData(): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/init`, { headers });
    if (response.ok) await response.json();
  } catch {
    // Backend unavailable; app will use mock data
  }
}

// Get reviews for a specific content
export async function getReviewsForContent(
  contentId: string
): Promise<Review[]> {
  try {
    const response = await fetch(`${BASE_URL}/reviews/content/${contentId}`, {
      headers,
    });
    if (response.ok) {
      const data = await response.json();
      return data.reviews;
    }
  } catch {
    // Backend unavailable
  }
  return mockGetReviewsForContent(contentId).map(toApiReview);
}

// Get reviews by a specific user
export async function getReviewsByUser(userId: string): Promise<Review[]> {
  try {
    const response = await fetch(`${BASE_URL}/reviews/user/${userId}`, {
      headers,
    });
    if (response.ok) {
      const data = await response.json();
      return data.reviews;
    }
  } catch {
    // Backend unavailable
  }
  return mockGetReviewsByUser(userId).map(toApiReview);
}

// Get friend reviews feed
export async function getFriendReviewsFeed(
  friendIds: string[]
): Promise<Review[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/reviews/feed?friendIds=${friendIds.join(",")}`,
      { headers }
    );
    if (response.ok) {
      const data = await response.json();
      return data.reviews;
    }
  } catch {
    // Backend unavailable
  }
  const friendSet = new Set(friendIds);
  return mockReviews
    .filter((r) => friendSet.has(r.userId))
    .map(toApiReview);
}

// Create a new review
export async function createReview(reviewData: {
  userId: string;
  contentId: string;
  rating: number;
  text: string;
}): Promise<Review> {
  const response = await fetch(`${BASE_URL}/reviews`, {
    method: "POST",
    headers,
    body: JSON.stringify(reviewData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create review");
  }
  const data = await response.json();
  return data.review;
}

// Update a review
export async function updateReview(
  reviewId: string,
  updates: { rating?: number; text?: string }
): Promise<Review> {
  const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update review");
  }
  const data = await response.json();
  return data.review;
}

// Delete a review
export async function deleteReview(reviewId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) {
    throw new Error("Failed to delete review");
  }
}

// Like/unlike a review
export async function toggleReviewLike(
  reviewId: string,
  userId: string
): Promise<Review> {
  const response = await fetch(`${BASE_URL}/reviews/${reviewId}/like`, {
    method: "POST",
    headers,
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) {
    throw new Error("Failed to like/unlike review");
  }
  const data = await response.json();
  return data.review;
}

// Get user connections
export async function getUserConnections(userId: string): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/connections/${userId}`, {
    headers,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch connections");
  }
  const data = await response.json();
  return data.connections;
}

// Add a connection
export async function addConnection(
  userId: string,
  friendId: string
): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/connections`, {
    method: "POST",
    headers,
    body: JSON.stringify({ userId, friendId }),
  });
  if (!response.ok) {
    throw new Error("Failed to add connection");
  }
  const data = await response.json();
  return data.connections;
}

// Check server health
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/health`, {
      headers,
    });
    return response.ok;
  } catch {
    return false;
  }
}
