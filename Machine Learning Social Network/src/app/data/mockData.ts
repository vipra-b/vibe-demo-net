// Mock data for the Netflix social review platform

export interface User {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
}

export interface Content {
  id: string;
  title: string;
  type: "movie" | "series";
  thumbnail: string;
  description: string;
  year: number;
  genre: string[];
  duration?: string;
  seasons?: number;
}

export interface Review {
  id: string;
  userId: string;
  contentId: string;
  rating: number;
  text: string;
  timestamp: Date;
  likes: number;
  likedBy: string[];
}

export interface Connection {
  userId: string;
  sharedInterests: string[];
  compatibilityScore: number;
}

export const currentUser: User = {
  id: "user-1",
  name: "Alex Chen",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
  bio: "Film enthusiast and sci-fi lover",
};

export const friends: User[] = [
  {
    id: "user-2",
    name: "Sarah Martinez",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    bio: "Drama and thriller fan",
  },
  {
    id: "user-3",
    name: "Jordan Lee",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    bio: "Comedy and action enthusiast",
  },
  {
    id: "user-4",
    name: "Maya Patel",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    bio: "Documentary lover",
  },
  {
    id: "user-5",
    name: "Chris Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    bio: "Horror and mystery buff",
  },
];

export const contentLibrary: Content[] = [
  {
    id: "content-1",
    title: "Stellar Horizons",
    type: "movie",
    thumbnail: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800",
    description: "A thrilling space odyssey about humanity's first voyage to a distant galaxy.",
    year: 2024,
    genre: ["Sci-Fi", "Adventure"],
    duration: "2h 18m",
  },
  {
    id: "content-2",
    title: "The Last Detective",
    type: "series",
    thumbnail: "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800",
    description: "A retired detective is pulled back for one final case that will test everything he knows.",
    year: 2023,
    genre: ["Crime", "Drama", "Mystery"],
    seasons: 3,
  },
  {
    id: "content-3",
    title: "Laugh Track",
    type: "series",
    thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
    description: "Behind the scenes of a struggling comedy club and the comedians who call it home.",
    year: 2024,
    genre: ["Comedy"],
    seasons: 2,
  },
  {
    id: "content-4",
    title: "Midnight Protocol",
    type: "movie",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
    description: "A cybersecurity expert races against time to stop a global cyber attack.",
    year: 2024,
    genre: ["Thriller", "Action"],
    duration: "1h 54m",
  },
  {
    id: "content-5",
    title: "Ocean's Whisper",
    type: "movie",
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    description: "A marine biologist discovers an ancient secret beneath the waves.",
    year: 2023,
    genre: ["Drama", "Adventure"],
    duration: "2h 5m",
  },
  {
    id: "content-6",
    title: "The Forgotten Empire",
    type: "series",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
    description: "An epic historical drama about a lost civilization and the archaeologists who uncover its secrets.",
    year: 2024,
    genre: ["Historical", "Drama"],
    seasons: 1,
  },
  {
    id: "content-7",
    title: "Neon Nights",
    type: "series",
    thumbnail: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
    description: "Life, love, and drama in a futuristic megacity.",
    year: 2024,
    genre: ["Sci-Fi", "Drama"],
    seasons: 2,
  },
  {
    id: "content-8",
    title: "The Art of Silence",
    type: "movie",
    thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800",
    description: "A deaf pianist's journey to international recognition and self-discovery.",
    year: 2023,
    genre: ["Drama", "Biography"],
    duration: "2h 12m",
  },
];

export const reviews: Review[] = [
  {
    id: "review-1",
    userId: "user-2",
    contentId: "content-1",
    rating: 5,
    text: "Absolutely breathtaking! The visuals are stunning and the story kept me on the edge of my seat. Best sci-fi film in years!",
    timestamp: new Date("2026-02-20T19:30:00"),
    likes: 12,
    likedBy: ["user-1", "user-3"],
  },
  {
    id: "review-2",
    userId: "user-3",
    contentId: "content-1",
    rating: 4,
    text: "Great film with amazing special effects. The plot could have been tighter, but overall a solid watch.",
    timestamp: new Date("2026-02-19T21:15:00"),
    likes: 8,
    likedBy: ["user-1"],
  },
  {
    id: "review-3",
    userId: "user-4",
    contentId: "content-2",
    rating: 5,
    text: "Season 3 finale was incredible! The character development throughout this series has been phenomenal. Can't wait for season 4!",
    timestamp: new Date("2026-02-21T14:20:00"),
    likes: 15,
    likedBy: ["user-1", "user-2", "user-5"],
  },
  {
    id: "review-4",
    userId: "user-5",
    contentId: "content-4",
    rating: 4,
    text: "Intense thriller that kept me guessing. The hacking scenes felt authentic and the tension was real throughout.",
    timestamp: new Date("2026-02-20T22:45:00"),
    likes: 10,
    likedBy: ["user-1", "user-3"],
  },
  {
    id: "review-5",
    userId: "user-2",
    contentId: "content-3",
    rating: 5,
    text: "Hilarious and heartwarming! The ensemble cast has amazing chemistry. I've rewatched this series three times already.",
    timestamp: new Date("2026-02-18T18:00:00"),
    likes: 20,
    likedBy: ["user-1", "user-3", "user-4"],
  },
  {
    id: "review-6",
    userId: "user-3",
    contentId: "content-5",
    rating: 3,
    text: "Beautiful cinematography but the pacing was slow. Worth watching for the underwater scenes alone.",
    timestamp: new Date("2026-02-17T20:30:00"),
    likes: 5,
    likedBy: ["user-4"],
  },
  {
    id: "review-7",
    userId: "user-1",
    contentId: "content-8",
    rating: 5,
    text: "A masterpiece! The performances are outstanding and the story is deeply moving. One of the best films I've seen this year.",
    timestamp: new Date("2026-02-21T16:45:00"),
    likes: 18,
    likedBy: ["user-2", "user-4", "user-5"],
  },
  {
    id: "review-8",
    userId: "user-4",
    contentId: "content-6",
    rating: 4,
    text: "Fascinating historical details and great production value. Looking forward to season 2!",
    timestamp: new Date("2026-02-19T15:30:00"),
    likes: 9,
    likedBy: ["user-1", "user-2"],
  },
];

export const connectionSuggestions: Connection[] = [
  {
    userId: "user-6",
    sharedInterests: ["Stellar Horizons", "Neon Nights", "Midnight Protocol"],
    compatibilityScore: 92,
  },
  {
    userId: "user-7",
    sharedInterests: ["The Last Detective", "Midnight Protocol"],
    compatibilityScore: 85,
  },
  {
    userId: "user-8",
    sharedInterests: ["The Art of Silence", "Ocean's Whisper"],
    compatibilityScore: 78,
  },
];

export const suggestedUsers: User[] = [
  {
    id: "user-6",
    name: "Emma Rodriguez",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    bio: "Sci-fi and tech thriller fan",
  },
  {
    id: "user-7",
    name: "Tyler Brooks",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    bio: "Crime drama enthusiast",
  },
  {
    id: "user-8",
    name: "Priya Singh",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
    bio: "Art house cinema lover",
  },
];

// Helper functions
export const getUserById = (id: string): User | undefined => {
  if (id === currentUser.id) return currentUser;
  const friend = friends.find((f) => f.id === id);
  if (friend) return friend;
  return suggestedUsers.find((u) => u.id === id);
};

export const getContentById = (id: string): Content | undefined => {
  return contentLibrary.find((c) => c.id === id);
};

export const getReviewsForContent = (contentId: string): Review[] => {
  return reviews.filter((r) => r.contentId === contentId);
};

export const getReviewsByUser = (userId: string): Review[] => {
  return reviews.filter((r) => r.userId === userId);
};

export const getFriendReviewsForContent = (contentId: string): Review[] => {
  const friendIds = friends.map((f) => f.id);
  return reviews.filter(
    (r) => r.contentId === contentId && friendIds.includes(r.userId)
  );
};

export const getAverageFriendRating = (contentId: string): number | null => {
  const friendReviews = getFriendReviewsForContent(contentId);
  if (friendReviews.length === 0) return null;
  const sum = friendReviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / friendReviews.length;
};

export const getRecommendationReason = (contentId: string): string => {
  const friendReviews = getFriendReviewsForContent(contentId);
  const avgRating = getAverageFriendRating(contentId);
  
  if (friendReviews.length > 0 && avgRating && avgRating >= 4) {
    const friendNames = friendReviews
      .slice(0, 2)
      .map((r) => getUserById(r.userId)?.name.split(" ")[0])
      .join(" and ");
    return `${friendNames} ${friendReviews.length > 2 ? `and ${friendReviews.length - 2} other friends` : ""} loved this (${avgRating.toFixed(1)}★)`;
  }
  
  const content = getContentById(contentId);
  if (content) {
    return `Popular in ${content.genre[0]}`;
  }
  
  return "Recommended for you";
};
