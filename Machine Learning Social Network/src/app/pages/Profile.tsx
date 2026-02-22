import React, { useState, useEffect } from "react";
import {
  currentUser,
  getContentById,
  friends,
} from "../data/mockData";
import { ReviewCard } from "../components/ReviewCard";
import { Edit2, Settings, Users, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import * as api from "../api/client";
import { toast } from "sonner";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("reviews");
  const [userReviews, setUserReviews] = useState<api.Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserReviews();
  }, []);

  const loadUserReviews = async () => {
    try {
      setLoading(true);
      const reviews = await api.getReviewsByUser(currentUser.id);
      setUserReviews(reviews);
    } catch (error) {
      console.error("Error loading user reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    reviews: userReviews.length,
    friends: friends.length,
    averageRating:
      userReviews.length > 0
        ? (
            userReviews.reduce((sum, r) => sum + r.rating, 0) /
            userReviews.length
          ).toFixed(1)
        : "0",
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8">
      {/* Profile Header */}
      <div className="bg-zinc-900 rounded-lg p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold">{currentUser.name}</h1>
              <p className="text-gray-400 mt-1">{currentUser.bio}</p>
            </div>
            <div className="flex gap-6">
              <div>
                <div className="text-2xl font-bold">{stats.reviews}</div>
                <div className="text-sm text-gray-400">Reviews</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.friends}</div>
                <div className="text-sm text-gray-400">Friends</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.averageRating}</div>
                <div className="text-sm text-gray-400">Avg Rating</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="reviews">
            My Reviews ({userReviews.length})
          </TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4 mt-6">
          {userReviews.length > 0 ? (
            userReviews.map((review) => {
              const content = getContentById(review.contentId);
              if (!content) return null;
              return (
                <ReviewCard
                  key={review.id}
                  review={{
                    ...review,
                    timestamp: new Date(review.timestamp),
                  }}
                  user={currentUser}
                  contentTitle={content.title}
                  showContent
                  isOwnReview
                />
              );
            })
          ) : (
            <div className="text-center py-12 bg-zinc-900 rounded-lg">
              <p className="text-gray-400">You haven't written any reviews yet</p>
              <p className="text-gray-500 text-sm mt-2">
                Start watching and share your thoughts!
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4 mt-6">
          <div className="bg-zinc-900 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {userReviews.slice(0, 5).map((review) => {
                const content = getContentById(review.contentId);
                if (!content) return null;
                const date = new Date(review.timestamp).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                return (
                  <div
                    key={review.id}
                    className="flex items-center gap-4 py-3 border-b border-zinc-800 last:border-0"
                  >
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-16 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">
                        Reviewed <span className="font-semibold">{content.title}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {date} • {review.rating}★
                      </p>
                    </div>
                  </div>
                );
              })}
              {userReviews.length === 0 && (
                <p className="text-center text-gray-400 py-4">No recent activity</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}