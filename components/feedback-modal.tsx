"use client"

import { useState } from "react"
import { X, CheckCircle, HelpCircle, XCircle, MessageSquare, Star } from "lucide-react"
import Image from "next/image"
import { useFeedback } from "@/hooks/use-api"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  birdData: {
    id: string
    thaiName: string
    commonName: string
    scientificName: string
    confidence: number
    imageUrl?: string
  }
  onSubmitFeedback: (feedback: FeedbackData) => void
}

interface FeedbackData {
  rating: "correct" | "unsure" | "incorrect"
  confidence: number
  comments?: string
  actualSpecies?: string
  location?: string
}

export default function FeedbackModal({ isOpen, onClose, birdData, onSubmitFeedback }: FeedbackModalProps) {
  const [selectedRating, setSelectedRating] = useState<"correct" | "unsure" | "incorrect" | null>(null)
  const [confidence, setConfidence] = useState(5)
  const [comments, setComments] = useState("")
  const [actualSpecies, setActualSpecies] = useState("")
  const [location, setLocation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)

  const { submitFeedback, loading: submittingFeedback, error: feedbackError } = useFeedback()

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!selectedRating) return

    setIsSubmitting(true)

    const feedbackData = {
      rating: selectedRating,
      confidence,
      comments: comments.trim() || undefined,
      actual_species: actualSpecies.trim() || undefined,
      location: location.trim() || undefined,
    }

    try {
      await submitFeedback(birdData.id, feedbackData)
      onSubmitFeedback(feedbackData)
      setIsSubmitting(false)
      setShowThankYou(true)

      // Auto close after showing thank you
      setTimeout(() => {
        setShowThankYou(false)
        onClose()
        // Reset form
        setSelectedRating(null)
        setConfidence(5)
        setComments("")
        setActualSpecies("")
        setLocation("")
      }, 2000)
    } catch (error) {
      setIsSubmitting(false)
      console.error("Feedback submission failed:", error)
      // Still show success for better UX in development
      if (process.env.NODE_ENV === "development") {
        setShowThankYou(true)
        setTimeout(() => {
          setShowThankYou(false)
          onClose()
        }, 2000)
      }
    }
  }

  if (showThankYou) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-fade-in">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">ขอบคุณสำหรับความคิดเห็น!</h3>
          <p className="text-slate-600">Thank you for your feedback!</p>
          <p className="text-sm text-slate-500 mt-2">ข้อมูลของคุณช่วยปรับปรุง AI ของเรา</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">ประเมินผลการระบุนก</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Bird Result Card */}
          <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-4 text-center">ผลการระบุ (Result)</h3>

            <div className="flex flex-col items-center">
              <div className="w-48 h-32 rounded-xl overflow-hidden mb-4 shadow-lg">
                <Image
                  src={
                    birdData.imageUrl ||
                    `/placeholder.svg?height=128&width=192&query=${encodeURIComponent(birdData.commonName) || "/placeholder.svg"} bird`
                  }
                  alt={birdData.commonName}
                  width={192}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center space-y-2">
                <p className="text-slate-700">
                  <span className="font-medium">Thai Name:</span> {birdData.thaiName}
                </p>
                <p className="text-slate-700">
                  <span className="font-medium">Common Name:</span> {birdData.commonName}
                </p>
                <p className="text-slate-700">
                  <span className="font-medium">Accurate:</span> {birdData.confidence}%
                </p>
              </div>
            </div>
          </div>

          {/* Rating Buttons */}
          <div className="mb-6">
            <h4 className="font-semibold text-slate-700 mb-4">การระบุนกนี้ถูกต้องหรือไม่?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setSelectedRating("correct")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${
                  selectedRating === "correct"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-slate-200 hover:border-green-300 hover:bg-green-50"
                }`}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">ถูกต้อง</span>
              </button>

              <button
                onClick={() => setSelectedRating("unsure")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${
                  selectedRating === "unsure"
                    ? "border-gray-500 bg-gray-50 text-gray-700"
                    : "border-slate-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <HelpCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">ไม่ทราบ</span>
              </button>

              <button
                onClick={() => setSelectedRating("incorrect")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${
                  selectedRating === "incorrect"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-slate-200 hover:border-red-300 hover:bg-red-50"
                }`}
              >
                <XCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">ไม่ถูกต้อง</span>
              </button>
            </div>
          </div>

          {/* Confidence Rating */}
          <div className="mb-6">
            <h4 className="font-semibold text-slate-700 mb-3">ความมั่นใจในการประเมิน (1-10)</h4>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">ไม่มั่นใจ</span>
              <input
                type="range"
                min="1"
                max="10"
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-slate-500">มั่นใจมาก</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500" />
                <span className="font-medium text-slate-700">{confidence}</span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {selectedRating === "incorrect" && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl">
              <h4 className="font-semibold text-red-700 mb-3">ข้อมูลเพิ่มเติม</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-red-600 mb-1">นกชนิดที่ถูกต้อง (ถ้าทราบ)</label>
                  <input
                    type="text"
                    value={actualSpecies}
                    onChange={(e) => setActualSpecies(e.target.value)}
                    placeholder="เช่น นกกระจอกบ้าน, Common Myna"
                    className="w-full p-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Location */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-600 mb-2">สถานที่บันทึกเสียง (ไม่บังคับ)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="เช่น ปทุมธานี, คลองหลวง"
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Comments */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-600 mb-2">ความคิดเห็นเพิ่มเติม (ไม่บังคับ)</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="แบ่งปันประสบการณ์หรือข้อเสนอแนะ..."
              rows={3}
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedRating || isSubmitting}
              className="flex-1 py-3 px-6 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  กำลังส่ง...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  ส่งความคิดเห็น
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
