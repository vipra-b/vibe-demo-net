import React from "react";
import { Play, Info } from "lucide-react";
import { Content } from "../data/mockData";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { RatingStars } from "./RatingStars";

interface ContentCardProps {
  content: Content;
  friendRating?: number | null;
  recommendationReason?: string;
  showReason?: boolean;
}

export function ContentCard({
  content,
  friendRating,
  recommendationReason,
  showReason = false,
}: ContentCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="group relative rounded-lg overflow-hidden cursor-pointer bg-zinc-900"
      onClick={() => navigate(`/content/${content.id}`)}
    >
      <div className="aspect-video relative">
        <img
          src={content.thumbnail}
          alt={content.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <Button size="sm" className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Play
            </Button>
            <Button size="sm" variant="outline">
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-white truncate">{content.title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>{content.year}</span>
          <span>•</span>
          <span>
            {content.type === "movie"
              ? content.duration
              : `${content.seasons} Season${content.seasons! > 1 ? "s" : ""}`}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {content.genre.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="text-xs px-2 py-1 bg-zinc-800 rounded text-gray-300"
            >
              {genre}
            </span>
          ))}
        </div>
        {friendRating && (
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
            <RatingStars rating={Math.round(friendRating)} readonly size="sm" />
            <span className="text-sm text-gray-300">
              {friendRating.toFixed(1)} from friends
            </span>
          </div>
        )}
        {showReason && recommendationReason && (
          <p className="text-xs text-gray-400 pt-1">{recommendationReason}</p>
        )}
      </div>
    </div>
  );
}
