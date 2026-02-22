import React, { useState } from "react";
import { ContentCard } from "../components/ContentCard";
import {
  contentLibrary,
  getAverageFriendRating,
  getRecommendationReason,
} from "../data/mockData";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Get all unique genres
  const allGenres = Array.from(
    new Set(contentLibrary.flatMap((content) => content.genre))
  ).sort();

  // Filter content
  const filteredContent = contentLibrary.filter((content) => {
    const matchesSearch =
      searchQuery === "" ||
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre =
      selectedGenre === "all" || content.genre.includes(selectedGenre);
    const matchesType =
      selectedType === "all" || content.type === selectedType;
    return matchesSearch && matchesGenre && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Browse Content</h1>
        <p className="text-gray-400 text-lg">
          Explore movies and series, see what your friends think
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles..."
            className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-500"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="movie">Movies</SelectItem>
              <SelectItem value="series">Series</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {allGenres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <p className="text-gray-400">
          Showing {filteredContent.length} results
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredContent.map((content) => (
            <ContentCard
              key={content.id}
              content={content}
              friendRating={getAverageFriendRating(content.id)}
              recommendationReason={getRecommendationReason(content.id)}
            />
          ))}
        </div>
        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No content found</p>
            <p className="text-gray-500 text-sm mt-2">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
