"use client"

import { useState } from "react"
import FileUpload from "@/components/file-upload"
import { Brain, Zap, Target, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAudioPrediction } from "@/hooks/use-api"

export default function AnalyzePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const router = useRouter()

  const analysisSteps = [
    "Processing audio file...",
    "Extracting audio features...",
    "Running AI analysis...",
    "Matching with database...",
    "Generating results...",
  ]

  const { predictBird, loading: predicting, error: predictionError } = useAudioPrediction()

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setAnalysisStep(0)

    const interval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev >= analysisSteps.length - 1) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 800)

    try {
      // This would be called from FileUpload component with actual file
      // For now, simulate the process
      setTimeout(async () => {
        clearInterval(interval)
        setIsAnalyzing(false)

        // Generate a mock analysis ID and redirect to results
        const analysisId = `analysis_${Date.now()}`
        router.push(`/analysis/${analysisId}`)
      }, 4000)
    } catch (error) {
      clearInterval(interval)
      setIsAnalyzing(false)
      console.error("Analysis failed:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold gradient-text mb-4">AI Audio Analysis</h1>
          <p className="text-xl text-slate-600">Upload your bird audio and let our advanced AI identify the species</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Brain, title: "AI Powered", desc: "Advanced neural networks" },
            { icon: Zap, title: "Fast Processing", desc: "Results in seconds" },
            { icon: Target, title: "High Accuracy", desc: "95%+ identification rate" },
            { icon: Clock, title: "Real-time", desc: "Instant analysis" },
          ].map((feature, index) => (
            <div
              key={index}
              className="card-modern text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Main Analysis Section */}
        <div className="max-w-4xl mx-auto">
          <div className="card-modern animate-slide-up">
            <h2 className="text-2xl font-bold text-center mb-8 gradient-text">Audio Analysis Engine</h2>

            {!isAnalyzing ? (
              <FileUpload onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Brain className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Analyzing Your Audio</h3>
                <p className="text-slate-600 mb-6">{analysisSteps[analysisStep]}</p>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((analysisStep + 1) / analysisSteps.length) * 100}%` }}
                  ></div>
                </div>

                <div className="flex justify-center space-x-2">
                  {analysisSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index <= analysisStep ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="card-modern">
              <h3 className="text-xl font-semibold mb-4">Previous Results</h3>
              <p className="text-slate-600 mb-4">View your recent bird identifications and analysis history</p>
              <Link href="/dashboard" className="btn-outline">
                View History
              </Link>
            </div>

            <div className="card-modern">
              <h3 className="text-xl font-semibold mb-4">Explore Map</h3>
              <p className="text-slate-600 mb-4">Discover bird sightings and hotspots in your area</p>
              <Link href="/map" className="btn-outline">
                Open Map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
