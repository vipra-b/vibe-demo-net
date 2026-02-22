import React, { useState, useEffect } from "react";
import { ReviewCard } from "../components/ReviewCard";
import { ContentCard } from "../components/ContentCard";
import {
  getUserById,
  getContentById,
  currentUser,
  friends,
  contentLibrary,
} from "../data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Sparkles, Loader2 } from "lucide-react";
import * as api from "../api/client";
import { toast } from "sonner";

export default function Home() {
  const [activeTab, setActiveTab] = useState("feed");
  const [reviews, setReviews] = useState<api.Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Initialize demo data on first load
      await api.initDemoData();
      // Load friend reviews
      const friendIds = friends.map((f) => f.id);
      const friendReviews = await api.getFriendReviewsFeed(friendIds);
      setReviews(friendReviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  // Get recommended content based on friend ratings
  const getRecommendedContent = () => {
    const contentWithRatings = contentLibrary.map((content) => {
      const contentReviews = reviews.filter((r) => r.contentId === content.id);
      const friendReviews = contentReviews.filter((r) =>
        friends.some((f) => f.id === r.userId)
      );
      
      let friendRating = null;
      if (friendReviews.length > 0) {
        friendRating =
          friendReviews.reduce((sum, r) => sum + r.rating, 0) /
          friendReviews.length;
      }

      let reason = "Recommended for you";
      if (friendReviews.length > 0 && friendRating && friendRating >= 4) {
        const friendNames = friendReviews
          .slice(0, 2)
          .map((r) => getUserById(r.userId)?.name.split(" ")[0])
          .join(" and ");
        reason = `${friendNames} ${friendReviews.length > 2 ? `and ${friendReviews.length - 2} other friends` : ""} loved this (${friendRating.toFixed(1)}★)`;
      } else if (content.genre.length > 0) {
        reason = `Popular in ${content.genre[0]}`;
      }

      return {
        content,
        friendRating,
        reason,
      };
    });

    return contentWithRatings
      .filter((item) => item.friendRating !== null || Math.random() > 0.5)
      .slice(0, 6);
  };

  const handleLike = async (reviewId: string) => {
    try {
      const updatedReview = await api.toggleReviewLike(reviewId, currentUser.id);
      setReviews(reviews.map((r) => (r.id === reviewId ? updatedReview : r)));
    } catch (error) {
      console.error("Error liking review:", error);
      toast.error("Failed to like review");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const recommendedContent = getRecommendedContent();

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          <h1 className="text-3xl md:text-4xl font-bold">Review & Connect</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Discover what your friends are watching and share your thoughts
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="feed" className="flex-1">
            Friends' Reviews
          </TabsTrigger>
          <TabsTrigger value="recommended" className="flex-1">
            Recommended
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6 mt-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <div className="space-y-4">
              {reviews.map((review) => {
                const user = getUserById(review.userId);
                const content = getContentById(review.contentId);
                if (!user || !content) return null;
                return (
                  <ReviewCard
                    key={review.id}
                    review={{
                      ...review,
                      timestamp: new Date(review.timestamp),
                    }}
                    user={user}
                    contentTitle={content.title}
                    showContent
                    onLike={handleLike}
                  />
                );
              })}
              {reviews.length === 0 && (
                <div className="text-center py-12 bg-zinc-900 rounded-lg">
                  <p className="text-gray-400">No reviews yet</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Start watching and share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recommended" className="space-y-6 mt-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Recommended for You</h2>
              <p className="text-sm text-gray-400 mt-1">
                Based on what your friends are watching
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedContent.map(({ content, friendRating, reason }) => (
                <ContentCard
                  key={content.id}
                  content={content}
                  friendRating={friendRating}
                  recommendationReason={reason}
                  showReason
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}