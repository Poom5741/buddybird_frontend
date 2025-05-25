"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Calendar, Volume2, Download, Share2, MessageSquare, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import FeedbackModal from "@/components/feedback-modal"
import { useBird } from "@/hooks/use-api"

export default function BirdDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  // Replace the static birdData with:
  const { bird: birdData, loading, error } = useBird(id as string)

  // Add loading and error states:
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading bird details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !birdData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-4">Bird not found or error loading data</p>
              <Link href="/dashboard" className="btn-primary">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleFeedbackSubmit = (feedbackData: any) => {
    console.log("Feedback submitted for bird:", birdData.id, feedbackData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-slate-600 hover:text-emerald-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="card-modern animate-fade-in">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Bird Image */}
            <div className="md:w-1/3">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={`/abstract-geometric-shapes.png?height=400&width=400&query=${encodeURIComponent(birdData.name)} bird detailed photo`}
                  alt={birdData.name}
                  width={400}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="mt-4 flex justify-center gap-2">
                <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                  <Volume2 className="h-5 w-5 text-slate-600" />
                </button>
                <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                  <Download className="h-5 w-5 text-slate-600" />
                </button>
                <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                  <Share2 className="h-5 w-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Bird Details */}
            <div className="md:w-2/3">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-slate-800">{birdData.name}</h1>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full font-medium">
                  {birdData.confidence}%
                </span>
              </div>

              <p className="text-xl text-slate-600 mb-6">{birdData.thai_name}</p>

              {/* Feedback Stats */}
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-3">Community Feedback</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-xs text-slate-500">Total Feedback</p>
                      <p className="text-sm font-medium">{birdData.feedbackCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Accuracy Rate</p>
                      <p className="text-sm font-medium text-green-600">{birdData.accuracyRate}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-xs text-slate-500">Status</p>
                      <p className="text-sm font-medium">
                        {birdData.needsFeedback ? "Needs More Feedback" : "Well Documented"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-3">Classification</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Scientific Name:</span>{" "}
                      <span className="text-slate-700 italic">{birdData.scientificName}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Conservation Status:</span>{" "}
                      <span className="text-slate-700">{birdData.conservation}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-3">Physical Characteristics</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Length:</span>{" "}
                      <span className="text-slate-700">{birdData.length}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Wingspan:</span>{" "}
                      <span className="text-slate-700">{birdData.wingspan}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Weight:</span>{" "}
                      <span className="text-slate-700">{birdData.weight}</span>
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-slate-700 mb-3">Habitat & Ecology</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Habitat:</span>{" "}
                      <span className="text-slate-700">{birdData.habitat}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Diet:</span>{" "}
                      <span className="text-slate-700">{birdData.diet}</span>
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-slate-700 mb-3">Description</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{birdData.description}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-3">Sighting Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-xs text-slate-500">First Recorded</p>
                      <p className="text-sm font-medium">{birdData.firstRecorded}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-xs text-slate-500">Total Sightings</p>
                      <p className="text-sm font-medium">{birdData.sightings}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-xs text-slate-500">Audio Recordings</p>
                      <p className="text-sm font-medium">{birdData.recordings}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback Actions */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-3">Help Improve Our AI</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Your feedback helps us improve bird identification accuracy for everyone.
                </p>
                <div className="flex gap-4">
                  <button onClick={() => setShowFeedbackModal(true)} className="btn-primary flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Quick Feedback
                  </button>
                  <Link href={`/feedback/bird_${birdData.id}`} className="btn-outline flex items-center">
                    Detailed Feedback Form
                  </Link>
                </div>
              </div>

              <div className="flex gap-4">
                <Link href="/map" className="btn-outline">
                  View on Map
                </Link>
                <Link href="/analyze" className="btn-primary">
                  Analyze Similar Audio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        birdData={{
          id: birdData.id,
          thaiName: birdData.thai_name,
          commonName: birdData.name,
          scientificName: birdData.scientificName,
          confidence: birdData.confidence,
        }}
        onSubmitFeedback={handleFeedbackSubmit}
      />
    </div>
  )
}
