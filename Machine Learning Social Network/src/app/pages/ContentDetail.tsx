import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Play, Plus, ThumbsUp, Share2, Info, Loader2 } from "lucide-react";
import {
  getContentById,
  getUserById,
  currentUser,
} from "../data/mockData";
import { Button } from "../components/ui/button";
import { ReviewCard } from "../components/ReviewCard";
import { ReviewPrompt } from "../components/ReviewPrompt";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import * as api from "../api/client";
import { toast } from "sonner";

export default function ContentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState("friends");
  const [reviews, setReviews] = useState<api.Review[]>([]);
  const [loading, setLoading] = useState(true);

  const content = id ? getContentById(id) : null;

  useEffect(() => {
    if (id) {
      loadReviews();
    }
  }, [id]);

  const loadReviews = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const contentReviews = await api.getReviewsForContent(id);
      setReviews(contentReviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  // Get friend reviews
  const getFriendReviews = () => {
    return reviews.filter((r) => {
      const user = getUserById(r.userId);
      return user && user.id !== currentUser.id;
    });
  };

  const friendReviews = getFriendReviews();
  
  // Calculate friend rating
  const friendRating = friendReviews.length > 0
    ? friendReviews.reduce((sum, r) => sum + r.rating, 0) / friendReviews.length
    : null;

  const userReview = reviews.find((r) => r.userId === currentUser.id);

  if (!content) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-400 text-lg">Content not found</p>
        <Button onClick={() => navigate("/browse")} className="mt-4">
          Browse Content
        </Button>
      </div>
    );
  }

  const handleSubmitReview = async (rating: number, reviewText: string) => {
    try {
      if (userReview) {
        // Update existing review
        await api.updateReview(userReview.id, { rating, text: reviewText });
        toast.success("Review updated!");
      } else {
        // Create new review
        await api.createReview({
          userId: currentUser.id,
          contentId: content.id,
          rating,
          text: reviewText,
        });
        toast.success("Review posted!");
      }
      // Reload reviews
      await loadReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
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

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await api.deleteReview(reviewId);
      toast.success("Review deleted");
      await loadReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] -mt-20">
        <img
          src={content.thumbnail}
          alt={content.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-8 space-y-4">
          <div className="max-w-7xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              {content.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-gray-300">
              <span>{content.year}</span>
              <span>•</span>
              <span>
                {content.type === "movie"
                  ? content.duration
                  : `${content.seasons} Season${content.seasons! > 1 ? "s" : ""}`}
              </span>
              <span>•</span>
              <div className="flex gap-2">
                {content.genre.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
            <p className="text-lg max-w-2xl text-gray-300">
              {content.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Play
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Plus className="w-5 h-5" />
                My List
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowReviewPrompt(true)}
                className="gap-2"
              >
                <ThumbsUp className="w-5 h-5" />
                {userReview ? "Edit Review" : "Rate & Review"}
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Share2 className="w-5 h-5" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Friend Rating Section */}
      {friendRating && (
        <div className="px-4 md:px-8">
          <div className="bg-zinc-900 rounded-lg p-6 max-w-3xl">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-4xl font-bold text-yellow-400">
                  {friendRating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">out of 5</div>
              </div>
              <div className="flex-1">
                <p className="text-lg">
                  <span className="font-semibold">
                    {friendReviews.length} friend{friendReviews.length !== 1 ? "s" : ""}
                  </span>{" "}
                  reviewed this
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Based on ratings from people you follow
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="px-4 md:px-8 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="friends">
                Friends' Reviews ({friendReviews.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                All Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="friends" className="space-y-4 mt-6">
              {friendReviews.length > 0 ? (
                friendReviews.map((review) => {
                  const user = getUserById(review.userId);
                  if (!user) return null;
                  return (
                    <ReviewCard
                      key={review.id}
                      review={{
                        ...review,
                        timestamp: new Date(review.timestamp),
                      }}
                      user={user}
                      onLike={handleLike}
                      isOwnReview={review.userId === currentUser.id}
                      onDelete={handleDeleteReview}
                    />
                  );
                })
              ) : (
                <div className="text-center py-12 bg-zinc-900 rounded-lg">
                  <Info className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    None of your friends have reviewed this yet
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Be the first to share your thoughts!
                  </p>
                  <Button
                    onClick={() => setShowReviewPrompt(true)}
                    className="mt-4"
                  >
                    Write a Review
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4 mt-6">
              {reviews.length > 0 ? (
                reviews.map((review) => {
                  const user = getUserById(review.userId);
                  if (!user) return null;
                  return (
                    <ReviewCard
                      key={review.id}
                      review={{
                        ...review,
                        timestamp: new Date(review.timestamp),
                      }}
                      user={user}
                      onLike={handleLike}
                      isOwnReview={review.userId === currentUser.id}
                      onDelete={handleDeleteReview}
                    />
                  );
                })
              ) : (
                <div className="text-center py-12 bg-zinc-900 rounded-lg">
                  <p className="text-gray-400">No reviews yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <ReviewPrompt
        contentTitle={content.title}
        onSubmit={handleSubmitReview}
        onClose={() => setShowReviewPrompt(false)}
        isOpen={showReviewPrompt}
      />
    </div>
  );
}