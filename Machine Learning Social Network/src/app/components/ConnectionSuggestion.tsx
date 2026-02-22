import React from "react";
import { UserPlus, CheckCircle } from "lucide-react";
import { User, Connection } from "../data/mockData";
import { Button } from "./ui/button";

interface ConnectionSuggestionProps {
  user: User;
  connection: Connection;
  onConnect?: (userId: string) => void;
  isConnected?: boolean;
}

export function ConnectionSuggestion({
  user,
  connection,
  onConnect,
  isConnected = false,
}: ConnectionSuggestionProps) {
  return (
    <div className="bg-zinc-900 rounded-lg p-4 space-y-3">
      <div className="flex items-start gap-3">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{user.name}</h3>
          <p className="text-sm text-gray-400">{user.bio}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-zinc-800 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${connection.compatibilityScore}%` }}
            />
          </div>
          <span className="text-sm text-gray-300 whitespace-nowrap">
            {connection.compatibilityScore}% match
          </span>
        </div>

        <p className="text-sm text-gray-400">
          <span className="text-green-400">{connection.sharedInterests.length}</span> shared interests
        </p>

        <div className="flex flex-wrap gap-1">
          {connection.sharedInterests.slice(0, 2).map((interest) => (
            <span
              key={interest}
              className="text-xs px-2 py-1 bg-zinc-800 rounded text-gray-300"
            >
              {interest}
            </span>
          ))}
          {connection.sharedInterests.length > 2 && (
            <span className="text-xs px-2 py-1 bg-zinc-800 rounded text-gray-300">
              +{connection.sharedInterests.length - 2} more
            </span>
          )}
        </div>
      </div>

      <Button
        onClick={() => onConnect?.(user.id)}
        disabled={isConnected}
        className="w-full"
        variant={isConnected ? "outline" : "default"}
      >
        {isConnected ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Connected
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4 mr-2" />
            Connect
          </>
        )}
      </Button>
    </div>
  );
}
