"use client";

import type React from "react";

import { useState } from "react";
import {
  ChevronRight,
  Volume2,
  Info,
  MapPin,
  Calendar,
  MessageSquare,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import FeedbackModal from "@/components/feedback-modal";
import { useBirds } from "@/hooks/use-api";

export default function BirdTable() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedBirdForFeedback, setSelectedBirdForFeedback] =
    useState<any>(null);
  const router = useRouter();

  const { birds, loading, error } = useBirds();

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-slate-100 border border-slate-200 animate-pulse"
          >
            <div className="h-4 bg-slate-200 rounded mb-2"></div>
            <div className="h-3 bg-slate-150 rounded mb-1"></div>
            <div className="h-3 bg-slate-150 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading birds: {error}</p>
        <p className="text-slate-500 text-sm">Using offline mode</p>
      </div>
    );
  }

  const handleRowClick = (id: string) => {
    router.push(`/birds/${id}`);
  };

  const handleFeedbackClick = (bird: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBirdForFeedback(bird);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = (feedbackData: any) => {
    console.log(
      "Feedback submitted for bird:",
      selectedBirdForFeedback?.id,
      feedbackData
    );
    setSelectedBirdForFeedback(null);
  };

  const handleFullFeedbackClick = (birdId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/feedback/bird_${birdId}`);
  };

  return (
    <>
      <div className="space-y-4">
        {birds?.slice(0, 5).map((bird, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer relative ${
              hoveredRow === index
                ? "bg-emerald-50 border-emerald-300 transform scale-105 shadow-lg"
                : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
            }`}
            onMouseEnter={() => setHoveredRow(index)}
            onMouseLeave={() => {
              setHoveredRow(null);
              setShowDetails(null);
            }}
            onClick={() => handleRowClick(bird.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-slate-800">{bird.name}</h4>
                  <span className="px-2 py-1 bg-emerald-600 text-emerald-50 text-xs rounded-full font-medium">
                    {bird.confidence}%
                  </span>
                  {bird.needs_feedback && (
                    <span className="px-2 py-1 bg-amber-500 text-amber-50 text-xs rounded-full font-medium animate-pulse">
                      Needs Feedback
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-1">{bird.thai_name}</p>
                <p className="text-xs text-slate-500">{bird.found}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <span>{bird.feedback_count} feedback</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{bird.last_seen}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
                  onClick={(e) => handleFeedbackClick(bird, e)}
                  title="Quick feedback"
                >
                  <MessageSquare className="h-4 w-4 text-emerald-600" />
                </button>
                <button
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(showDetails === index ? null : index);
                  }}
                  title="More info"
                >
                  <Info className="h-4 w-4 text-slate-600" />
                </button>
                <button
                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                  title="Play audio"
                >
                  <Volume2 className="h-4 w-4 text-blue-600" />
                </button>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            </div>

            {/* Quick Info Tooltip on Hover */}
            {hoveredRow === index && (
              <div
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-slate-900/95 backdrop-blur-sm text-white text-xs p-3 rounded-lg shadow-lg z-10 min-w-[200px] opacity-0 animate-fade-in"
                style={{
                  animationDelay: "0.2s",
                  animationFillMode: "forwards",
                }}
              >
                <p className="font-semibold mb-1">
                  Click for details • Quick feedback available
                </p>
                <div className="flex items-center gap-1 text-slate-200">
                  <Calendar className="h-3 w-3" />
                  <span>Last seen: {bird.last_seen}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-200">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {bird.sightings} sightings • {bird.feedback_count} feedback
                  </span>
                </div>
              </div>
            )}

            {/* Expanded Details Panel */}
            {showDetails === index && (
              <div className="mt-3 pt-3 border-t border-slate-200 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-slate-500 mb-1">Scientific Name:</p>
                    <p className="text-slate-700 italic">
                      {bird.scientific_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">Habitat:</p>
                    <p className="text-slate-700">{bird.habitats}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-slate-500 mb-1">Description:</p>
                    <p className="text-slate-700">{bird.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(bird.id);
                    }}
                  >
                    View Full Details
                  </button>
                  <button
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors flex items-center justify-center"
                    onClick={(e) => handleFeedbackClick(bird, e)}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Quick Feedback
                  </button>
                  <button
                    className="flex-1 py-2 bg-slate-600 hover:bg-slate-700 text-white text-xs rounded-lg transition-colors"
                    onClick={(e) => handleFullFeedbackClick(bird.id, e)}
                  >
                    Full Feedback
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Feedback Modal */}
      {selectedBirdForFeedback && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => {
            setShowFeedbackModal(false);
            setSelectedBirdForFeedback(null);
          }}
          birdData={{
            id: selectedBirdForFeedback.id,
            thaiName: selectedBirdForFeedback.thai_name,
            commonName: selectedBirdForFeedback.name,
            scientificName: selectedBirdForFeedback.scientific_name,
            confidence: selectedBirdForFeedback.confidence,
          }}
          onSubmitFeedback={handleFeedbackSubmit}
        />
      )}
    </>
  );
}
