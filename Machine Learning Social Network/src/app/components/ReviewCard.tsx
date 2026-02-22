import React from "react";
import { Heart, MoreVertical } from "lucide-react";
import { RatingStars } from "./RatingStars";
import { Review, User } from "../data/mockData";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface ReviewCardProps {
  review: Review;
  user: User;
  contentTitle?: string;
  showContent?: boolean;
  onLike?: (reviewId: string) => void;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
  isOwnReview?: boolean;
}

export function ReviewCard({
  review,
  user,
  contentTitle,
  showContent = false,
  onLike,
  onEdit,
  onDelete,
  isOwnReview = false,
}: ReviewCardProps) {
  const timeAgo = getTimeAgo(review.timestamp);

  return (
    <div className="bg-zinc-900 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-white">{user.name}</p>
            <p className="text-sm text-gray-400">{timeAgo}</p>
          </div>
        </div>
        {isOwnReview && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(review.id)}>
                Edit Review
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(review.id)}
                className="text-red-600"
              >
                Delete Review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {showContent && contentTitle && (
        <p className="text-sm text-gray-400">Reviewed: {contentTitle}</p>
      )}

      <div className="flex items-center gap-2">
        <RatingStars rating={review.rating} readonly size="sm" />
        <span className="text-sm text-gray-300">{review.rating}/5</span>
      </div>

      <p className="text-gray-200">{review.text}</p>

      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={() => onLike?.(review.id)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${
              review.likedBy.includes("user-1")
                ? "fill-red-500 text-red-500"
                : ""
            }`}
          />
          <span>{review.likes}</span>
        </button>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
}
