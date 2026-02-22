import React from "react";
import { useNavigate } from "react-router";
import { Home } from "lucide-react";
import { Button } from "../components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-gray-600">404</h1>
        <h2 className="text-2xl font-semibold text-white">Page Not Found</h2>
        <p className="text-gray-400">
          The page you're looking for doesn't exist.
        </p>
        <Button onClick={() => navigate("/")} className="gap-2 mt-6">
          <Home className="w-4 h-4" />
          Go Home
        </Button>
      </div>
    </div>
  );
}
