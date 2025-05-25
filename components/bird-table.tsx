"use client"

import type React from "react"

import { useState } from "react"
import { ChevronRight, Volume2, Info, MapPin, Calendar, MessageSquare, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import FeedbackModal from "@/components/feedback-modal"
import { useBirds } from "@/hooks/use-api"

export default function BirdTable() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [showDetails, setShowDetails] = useState<number | null>(null)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [selectedBirdForFeedback, setSelectedBirdForFeedback] = useState<any>(null)
  const router = useRouter()

  const { birds, loading, error } = useBirds()

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="p-4 rounded-xl bg-violet-900/30 border border-violet-700/50 animate-pulse">
            <div className="h-4 bg-violet-700/50 rounded mb-2"></div>
            <div className="h-3 bg-violet-700/30 rounded mb-1"></div>
            <div className="h-3 bg-violet-700/30 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-4">Error loading birds: {error}</p>
        <p className="text-violet-300 text-sm">Using offline mode</p>
      </div>
    )
  }

  const handleRowClick = (id: string) => {
    router.push(`/birds/${id}`)
  }

  const handleFeedbackClick = (bird: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedBirdForFeedback(bird)
    setShowFeedbackModal(true)
  }

  const handleFeedbackSubmit = (feedbackData: any) => {
    console.log("Feedback submitted for bird:", selectedBirdForFeedback?.id, feedbackData)
    setSelectedBirdForFeedback(null)
  }

  const handleFullFeedbackClick = (birdId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/feedback/bird_${birdId}`)
  }

  return (
    <>
      <div className="space-y-4">
        {birds?.map((bird, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer relative ${
              hoveredRow === index
                ? "bg-fuchsia-900/50 border-fuchsia-400 transform scale-105"
                : "bg-violet-900/30 border-violet-700/50 hover:bg-violet-900/50"
            }`}
            onMouseEnter={() => setHoveredRow(index)}
            onMouseLeave={() => {
              setHoveredRow(null)
              setShowDetails(null)
            }}
            onClick={() => handleRowClick(bird.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-violet-50">{bird.commonName}</h4>
                  <span className="px-2 py-1 bg-fuchsia-700 text-fuchsia-100 text-xs rounded-full font-medium">
                    {bird.confidence}%
                  </span>
                  {bird.needsFeedback && (
                    <span className="px-2 py-1 bg-amber-600 text-amber-100 text-xs rounded-full font-medium animate-pulse">
                      Needs Feedback
                    </span>
                  )}
                </div>
                <p className="text-sm text-violet-200 mb-1">{bird.thaiName}</p>
                <p className="text-xs text-violet-300">{bird.found}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-violet-300">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <span>{bird.feedbackCount} feedback</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{bird.lastSeen}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 hover:bg-fuchsia-800 rounded-lg transition-colors duration-200"
                  onClick={(e) => handleFeedbackClick(bird, e)}
                  title="Quick feedback"
                >
                  <MessageSquare className="h-4 w-4 text-fuchsia-300" />
                </button>
                <button
                  className="p-2 hover:bg-fuchsia-800 rounded-lg transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDetails(showDetails === index ? null : index)
                  }}
                  title="More info"
                >
                  <Info className="h-4 w-4 text-fuchsia-300" />
                </button>
                <button
                  className="p-2 hover:bg-fuchsia-800 rounded-lg transition-colors duration-200"
                  title="Play audio"
                >
                  <Volume2 className="h-4 w-4 text-fuchsia-300" />
                </button>
                <ChevronRight className="h-5 w-5 text-violet-400" />
              </div>
            </div>

            {/* Quick Info Tooltip on Hover */}
            {hoveredRow === index && (
              <div
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-black/90 backdrop-blur-sm text-white text-xs p-3 rounded-lg shadow-lg z-10 min-w-[200px] opacity-0 animate-fade-in"
                style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
              >
                <p className="font-semibold mb-1">Click for details • Quick feedback available</p>
                <div className="flex items-center gap-1 text-violet-200">
                  <Calendar className="h-3 w-3" />
                  <span>Last seen: {bird.lastSeen}</span>
                </div>
                <div className="flex items-center gap-1 text-violet-200">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {bird.sightings} sightings • {bird.feedbackCount} feedback
                  </span>
                </div>
              </div>
            )}

            {/* Expanded Details Panel */}
            {showDetails === index && (
              <div className="mt-3 pt-3 border-t border-violet-700/50 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-violet-300 mb-1">Scientific Name:</p>
                    <p className="text-violet-100 italic">{bird.scientificName}</p>
                  </div>
                  <div>
                    <p className="text-violet-300 mb-1">Habitat:</p>
                    <p className="text-violet-100">{bird.habitat}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-violet-300 mb-1">Description:</p>
                    <p className="text-violet-100">{bird.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    className="flex-1 py-2 bg-fuchsia-800/50 hover:bg-fuchsia-700/50 text-white text-xs rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRowClick(bird.id)
                    }}
                  >
                    View Full Details
                  </button>
                  <button
                    className="flex-1 py-2 bg-blue-800/50 hover:bg-blue-700/50 text-white text-xs rounded-lg transition-colors flex items-center justify-center"
                    onClick={(e) => handleFeedbackClick(bird, e)}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Quick Feedback
                  </button>
                  <button
                    className="flex-1 py-2 bg-violet-800/50 hover:bg-violet-700/50 text-white text-xs rounded-lg transition-colors"
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
            setShowFeedbackModal(false)
            setSelectedBirdForFeedback(null)
          }}
          birdData={{
            id: selectedBirdForFeedback.id,
            thaiName: selectedBirdForFeedback.thaiName,
            commonName: selectedBirdForFeedback.commonName,
            scientificName: selectedBirdForFeedback.scientificName,
            confidence: selectedBirdForFeedback.confidence,
          }}
          onSubmitFeedback={handleFeedbackSubmit}
        />
      )}
    </>
  )
}
