import React, { useState } from "react";
import {
  connectionSuggestions,
  suggestedUsers,
  friends,
  currentUser,
} from "../data/mockData";
import { ConnectionSuggestion } from "../components/ConnectionSuggestion";
import { Users, UserCheck, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function Connections() {
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("suggested");

  const handleConnect = (userId: string) => {
    setConnectedUsers([...connectedUsers, userId]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl md:text-4xl font-bold">Connections</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Connect with people who share your taste in content
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="suggested" className="flex-1 gap-2">
            <Sparkles className="w-4 h-4" />
            Suggested
          </TabsTrigger>
          <TabsTrigger value="friends" className="flex-1 gap-2">
            <UserCheck className="w-4 h-4" />
            Friends ({friends.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggested" className="space-y-6 mt-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Suggested Connections</h2>
              <p className="text-sm text-gray-400 mt-1">
                Based on your viewing preferences and ratings
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectionSuggestions.map((connection, index) => {
                const user = suggestedUsers[index];
                if (!user) return null;
                return (
                  <ConnectionSuggestion
                    key={user.id}
                    user={user}
                    connection={connection}
                    onConnect={handleConnect}
                    isConnected={connectedUsers.includes(user.id)}
                  />
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="friends" className="space-y-6 mt-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Friends</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-zinc-900 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">
                        {friend.name}
                      </h3>
                      <p className="text-sm text-gray-400">{friend.bio}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <UserCheck className="w-4 h-4" />
                    <span>Connected</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
