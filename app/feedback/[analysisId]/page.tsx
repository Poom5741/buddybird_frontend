"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, HelpCircle, XCircle, MessageSquare, Star, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function FeedbackPage() {
  const params = useParams()
  const router = useRouter()
  const { analysisId } = params

  const [selectedRating, setSelectedRating] = useState<"correct" | "unsure" | "incorrect" | null>(null)
  const [confidence, setConfidence] = useState(5)
  const [comments, setComments] = useState("")
  const [actualSpecies, setActualSpecies] = useState("")
  const [location, setLocation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Mock data - in real app this would come from API
  const analysisData = {
    id: analysisId,
    birdData: {
      id: "b004",
      thaiName: "นกกระจอกบ้าน",
      commonName: "Eurasian Tree Sparrow",
      scientificName: "Passer montanus (Linnaeus, 1758)",
      confidence: 75.43,
      imageUrl: "/placeholder.svg?height=200&width=300&query=eurasian tree sparrow bird detailed photo",
    },
    audioFile: {
      name: "bird_recording_001.wav",
      duration: "00:45",
      uploadTime: "2024-01-15 14:30:25",
    },
  }

  const handleSubmit = async () => {
    if (!selectedRating) return

    setIsSubmitting(true)

    const feedbackData = {
      analysisId,
      rating: selectedRating,
      confidence,
      comments: comments.trim() || undefined,
      actualSpecies: actualSpecies.trim() || undefined,
      location: location.trim() || undefined,
      timestamp: new Date().toISOString(),
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Feedback submitted:", feedbackData)
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="card-modern text-center animate-fade-in">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-4">ขอบคุณสำหรับความคิดเห็น!</h1>
              <p className="text-xl text-slate-600 mb-2">Thank you for your feedback!</p>
              <p className="text-slate-500 mb-8">ข้อมูลของคุณช่วยให้เราปรับปรุงระบบ AI ให้แม่นยำยิ่งขึ้น</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/analyze" className="btn-primary">
                  วิเคราะห์เสียงใหม่
                </Link>
                <Link href="/dashboard" className="btn-outline">
                  กลับไปแดชบอร์ด
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ
          </button>
          <div className="text-sm text-slate-500">Analysis ID: {analysisId}</div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="card-modern animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold gradient-text mb-2">ประเมินผลการระบุนก</h1>
              <p className="text-slate-600">กรุณาช่วยประเมินความถูกต้องของการระบุนกเพื่อปรับปรุงระบบ</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Analysis Result */}
              <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-6">ผลการวิเคราะห์</h2>

                {/* Result Card - Matching the design */}
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-slate-700 mb-4 text-center">Result</h3>

                  <div className="flex flex-col items-center">
                    <div className="w-64 h-40 rounded-xl overflow-hidden mb-4 shadow-lg bg-emerald-500 p-2">
                      <Image
                        src={analysisData.birdData.imageUrl || "/placeholder.svg"}
                        alt={analysisData.birdData.commonName}
                        width={256}
                        height={160}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="text-center space-y-2 text-slate-700">
                      <p>
                        <span className="font-medium">Thai Name:</span> {analysisData.birdData.thaiName}
                      </p>
                      <p>
                        <span className="font-medium">Common Name:</span> {analysisData.birdData.commonName}
                      </p>
                      <p>
                        <span className="font-medium">Accurate:</span> {analysisData.birdData.confidence}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Audio Info */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-700 mb-3">ข้อมูลไฟล์เสียง</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">ชื่อไฟล์:</span> {analysisData.audioFile.name}
                    </p>
                    <p>
                      <span className="font-medium">ระยะเวลา:</span> {analysisData.audioFile.duration}
                    </p>
                    <p>
                      <span className="font-medium">อัปโหลดเมื่อ:</span> {analysisData.audioFile.uploadTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Feedback Form */}
              <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-6">แบบประเมิน</h2>

                {/* Rating Buttons - Matching the design */}
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-700 mb-4">การระบุนกนี้ถูกต้องหรือไม่?</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => setSelectedRating("correct")}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${
                        selectedRating === "correct"
                          ? "border-green-500 bg-green-500 text-white shadow-lg"
                          : "border-green-500 text-green-600 hover:bg-green-50"
                      }`}
                    >
                      <CheckCircle className="h-5 w-5 mr-3" />
                      <span className="font-medium text-lg">ถูกต้อง</span>
                    </button>

                    <button
                      onClick={() => setSelectedRating("unsure")}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${
                        selectedRating === "unsure"
                          ? "border-gray-500 bg-gray-500 text-white shadow-lg"
                          : "border-gray-500 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <HelpCircle className="h-5 w-5 mr-3" />
                      <span className="font-medium text-lg">ไม่ทราบ</span>
                    </button>

                    <button
                      onClick={() => setSelectedRating("incorrect")}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${
                        selectedRating === "incorrect"
                          ? "border-red-600 bg-red-600 text-white shadow-lg"
                          : "border-red-600 text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <XCircle className="h-5 w-5 mr-3" />
                      <span className="font-medium text-lg">ไม่ถูกต้อง</span>
                    </button>
                  </div>
                </div>

                {/* Confidence Rating */}
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-700 mb-3">ความมั่นใจในการประเมิน</h4>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500">1</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={confidence}
                      onChange={(e) => setConfidence(Number(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-slate-500">10</span>
                    <div className="flex items-center gap-1 min-w-[60px]">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span className="font-medium text-slate-700">{confidence}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Information for Incorrect */}
                {selectedRating === "incorrect" && (
                  <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
                    <h4 className="font-semibold text-red-700 mb-3">ข้อมูลเพิ่มเติม</h4>
                    <div>
                      <label className="block text-sm font-medium text-red-600 mb-2">นกชนิดที่ถูกต้อง (ถ้าทราบ)</label>
                      <input
                        type="text"
                        value={actualSpecies}
                        onChange={(e) => setActualSpecies(e.target.value)}
                        placeholder="เช่น นกกระจอกบ้าน, Common Myna"
                        className="w-full p-3 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-600 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    สถานที่บันทึกเสียง (ไม่บังคับ)
                  </label>
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
                    rows={4}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!selectedRating || isSubmitting}
                  className="w-full py-4 px-6 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      กำลังส่งความคิดเห็น...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-5 w-5 mr-2" />
                      ส่งความคิดเห็น
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
