import React, { useState } from "react";
import { X } from "lucide-react";
import { RatingStars } from "./RatingStars";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface ReviewPromptProps {
  contentTitle: string;
  onSubmit: (rating: number, review: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function ReviewPrompt({
  contentTitle,
  onSubmit,
  onClose,
  isOpen,
}: ReviewPromptProps) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, reviewText);
      setRating(0);
      setReviewText("");
      onClose();
    }
  };

  const charCount = reviewText.length;
  const maxChars = 250;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-zinc-900 rounded-lg p-6 max-w-md w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Rate & Review
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-300">
          How would you rate <span className="font-semibold">{contentTitle}</span>?
        </p>

        <div className="flex items-center gap-3">
          <RatingStars rating={rating} onRatingChange={setRating} size="lg" />
          {rating > 0 && (
            <span className="text-gray-300">{rating}/5</span>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-300">
            Write a review (optional)
          </label>
          <Textarea
            value={reviewText}
            onChange={(e) => {
              if (e.target.value.length <= maxChars) {
                setReviewText(e.target.value);
              }
            }}
            placeholder="Share your thoughts..."
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 resize-none"
            rows={4}
          />
          <p className="text-xs text-gray-400 text-right">
            {charCount}/{maxChars}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="flex-1"
          >
            Submit Review
          </Button>
        </div>
      </div>
    </div>
  );
}
