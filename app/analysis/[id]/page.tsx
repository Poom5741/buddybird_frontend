"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Play, Pause, Volume2, Download, Share2, RefreshCw, CheckCircle, MessageSquare } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import FeedbackModal from "@/components/feedback-modal"

export default function AnalysisResultPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  // Mock analysis data - in real app this would come from API
  const analysisData = {
    id: id,
    audioFile: {
      name: "bird_recording_001.wav",
      size: "2.4 MB",
      duration: "00:45",
      format: "WAV",
      sampleRate: "44.1 kHz",
      bitDepth: "16-bit",
      uploadTime: "2024-01-15 14:30:25",
    },
    primaryResult: {
      id: "b004",
      thaiName: "นกกระจอกบ้าน",
      commonName: "Eurasian Tree Sparrow",
      scientificName: "Passer montanus (Linnaeus, 1758)",
      confidence: 92.1,
      matchedFeatures: ["Frequency pattern", "Call duration", "Harmonic structure"],
      description: "Small, brown bird with chestnut crown and black cheek patch. Very common in human settlements.",
    },
    alternativeResults: [
      {
        id: "b002",
        thaiName: "นกเอี้ยงสาริกา",
        commonName: "Common Myna",
        scientificName: "Acridotheres tristis",
        confidence: 78.3,
      },
      {
        id: "b001",
        thaiName: "อีกา",
        commonName: "Eastern Jungle Crow",
        scientificName: "Corvus levaillantii",
        confidence: 65.7,
      },
      {
        id: "b003",
        thaiName: "นกเขาไฟ",
        commonName: "Red Collared Dove",
        scientificName: "Streptopelia tranquebarica",
        confidence: 45.2,
      },
    ],
    audioAnalysis: {
      dominantFrequency: "2.8 kHz",
      frequencyRange: "1.2 - 8.5 kHz",
      callDuration: "0.8 seconds",
      callsDetected: 12,
      noiseLevel: "Low",
      quality: "High",
    },
    processingTime: "2.3 seconds",
    analysisDate: "January 15, 2024 at 2:30 PM",
  }

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime)
      const updateDuration = () => setDuration(audio.duration)

      audio.addEventListener("timeupdate", updateTime)
      audio.addEventListener("loadedmetadata", updateDuration)
      audio.addEventListener("ended", () => setIsPlaying(false))

      return () => {
        audio.removeEventListener("timeupdate", updateTime)
        audio.removeEventListener("loadedmetadata", updateDuration)
        audio.removeEventListener("ended", () => setIsPlaying(false))
      }
    }
  }, [])

  const handleFeedbackSubmit = (feedbackData: any) => {
    console.log("Feedback submitted:", feedbackData)
    // Here you would typically send the feedback to your backend
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
            Back to Analysis
          </button>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full font-medium">
              <CheckCircle className="h-4 w-4 inline mr-1" />
              Analysis Complete
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-8">
            {/* Audio File Information */}
            <div className="card-modern animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Audio File Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3">File Details</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Filename:</span>{" "}
                      <span className="text-slate-700">{analysisData.audioFile.name}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Size:</span>{" "}
                      <span className="text-slate-700">{analysisData.audioFile.size}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Duration:</span>{" "}
                      <span className="text-slate-700">{analysisData.audioFile.duration}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Format:</span>{" "}
                      <span className="text-slate-700">{analysisData.audioFile.format}</span>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3">Technical Specs</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Sample Rate:</span>{" "}
                      <span className="text-slate-700">{analysisData.audioFile.sampleRate}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Bit Depth:</span>{" "}
                      <span className="text-slate-700">{analysisData.audioFile.bitDepth}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Upload Time:</span>{" "}
                      <span className="text-slate-700">{analysisData.audioFile.uploadTime}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Processing Time:</span>{" "}
                      <span className="text-slate-700">{analysisData.processingTime}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Waveform and Player */}
            <div className="card-modern animate-slide-up">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Audio Waveform</h2>

              {/* Waveform Visualization */}
              <div className="bg-slate-900 rounded-xl p-6 mb-6">
                <div className="relative h-32 flex items-end justify-center space-x-1">
                  {/* Mock waveform bars */}
                  {Array.from({ length: 100 }).map((_, i) => {
                    const height = Math.random() * 80 + 20
                    const isActive = (currentTime / duration) * 100 > i
                    return (
                      <div
                        key={i}
                        className={`w-1 transition-all duration-200 ${isActive ? "bg-emerald-400" : "bg-slate-600"}`}
                        style={{ height: `${height}%` }}
                      />
                    )
                  })}

                  {/* Playhead */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg transition-all duration-100"
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                  />
                </div>

                {/* Time indicators */}
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>0:00</span>
                  <span>0:15</span>
                  <span>0:30</span>
                  <span>0:45</span>
                </div>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlayback}
                    className="w-12 h-12 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                  </button>
                  <div className="text-sm text-slate-600">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <Volume2 className="h-4 w-4 text-slate-600" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <Download className="h-4 w-4 text-slate-600" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <Share2 className="h-4 w-4 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Hidden audio element */}
              <audio ref={audioRef} src="/placeholder-audio.mp3" preload="metadata" />
            </div>

            {/* Primary Result */}
            <div className="card-modern animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Primary Identification</h2>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-emerald-600">{analysisData.primaryResult.confidence}%</span>
                  <span className="text-sm text-slate-500">confidence</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={`/abstract-geometric-shapes.png?height=200&width=200&query=${encodeURIComponent(analysisData.primaryResult.commonName)} bird`}
                      alt={analysisData.primaryResult.commonName}
                      width={200}
                      height={200}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>

                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{analysisData.primaryResult.commonName}</h3>
                  <p className="text-lg text-slate-600 mb-4">{analysisData.primaryResult.thaiName}</p>
                  <p className="text-sm text-slate-500 italic mb-4">{analysisData.primaryResult.scientificName}</p>
                  <p className="text-slate-700 mb-4">{analysisData.primaryResult.description}</p>

                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Matched Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.primaryResult.matchedFeatures.map((feature, index) => (
                        <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Actions */}
                  <div className="mt-6 flex gap-4">
                    <button onClick={() => setShowFeedbackModal(true)} className="btn-primary flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      ประเมินผลการระบุ
                    </button>
                    <Link href={`/feedback/${id}`} className="btn-outline flex items-center">
                      แบบประเมินแบบเต็ม
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative Results */}
            <div className="card-modern animate-slide-up">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Alternative Matches</h2>
              <div className="space-y-4">
                {analysisData.alternativeResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                    onClick={() => router.push(`/birds/${result.id}`)}
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{result.commonName}</h4>
                      <p className="text-sm text-slate-600">{result.thaiName}</p>
                      <p className="text-xs text-slate-500 italic">{result.scientificName}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-slate-700">{result.confidence}%</span>
                      <p className="text-xs text-slate-500">confidence</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Audio Analysis Details */}
            <div className="card-modern animate-slide-up">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Audio Analysis</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-600">Dominant Frequency</p>
                  <p className="text-slate-800">{analysisData.audioAnalysis.dominantFrequency}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Frequency Range</p>
                  <p className="text-slate-800">{analysisData.audioAnalysis.frequencyRange}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Call Duration</p>
                  <p className="text-slate-800">{analysisData.audioAnalysis.callDuration}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Calls Detected</p>
                  <p className="text-slate-800">{analysisData.audioAnalysis.callsDetected}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Noise Level</p>
                  <p className="text-slate-800">{analysisData.audioAnalysis.noiseLevel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Audio Quality</p>
                  <p className="text-slate-800">{analysisData.audioAnalysis.quality}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card-modern animate-slide-up">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn-primary flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Re-analyze Audio
                </button>
                <Link href="/analyze" className="w-full btn-outline flex items-center justify-center">
                  Analyze New Audio
                </Link>
                <Link href="/map" className="w-full btn-outline flex items-center justify-center">
                  View on Map
                </Link>
              </div>
            </div>

            {/* Feedback */}
            <div className="card-modern animate-slide-up">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Feedback</h3>
              <p className="text-sm text-slate-600 mb-4">Help us improve our AI model</p>
              <div className="space-y-2">
                <button className="w-full py-2 px-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm">
                  ✓ Correct Identification
                </button>
                <button className="w-full py-2 px-4 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm">
                  ? Partially Correct
                </button>
                <button className="w-full py-2 px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm">
                  ✗ Incorrect Identification
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Feedback Modal */}
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          birdData={{
            id: analysisData.primaryResult.id,
            thaiName: analysisData.primaryResult.thaiName,
            commonName: analysisData.primaryResult.commonName,
            scientificName: analysisData.primaryResult.scientificName,
            confidence: analysisData.primaryResult.confidence,
          }}
          onSubmitFeedback={handleFeedbackSubmit}
        />
      </div>
    </div>
  )
}
