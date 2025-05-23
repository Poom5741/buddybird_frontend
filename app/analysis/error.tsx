"use client"

import Link from "next/navigation"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileAudio, AlertCircle, HelpCircle, Upload } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function AnalysisErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [errorType, setErrorType] = useState<string>("unknown")
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)

    // Determine error type based on error message
    if (error.message?.includes("format")) {
      setErrorType("format")
    } else if (error.message?.includes("size")) {
      setErrorType("size")
    } else if (error.message?.includes("quality")) {
      setErrorType("quality")
    } else if (error.message?.includes("timeout")) {
      setErrorType("timeout")
    } else {
      setErrorType("unknown")
    }
  }, [error])

  // Error messages based on error type
  const errorMessages = {
    format: {
      title: "Unsupported Audio Format",
      description: "The audio file format you uploaded is not supported. Please use WAV, MP3, AAC, or FLAC formats.",
      suggestion: "Try converting your file to a supported format and upload again.",
    },
    size: {
      title: "File Size Exceeded",
      description: "The audio file you uploaded exceeds our 10MB size limit.",
      suggestion: "Try compressing your audio file or uploading a shorter recording.",
    },
    quality: {
      title: "Audio Quality Issue",
      description: "Our AI couldn't analyze the audio due to quality issues like excessive noise or low volume.",
      suggestion: "Try uploading a clearer recording with less background noise.",
    },
    timeout: {
      title: "Analysis Timeout",
      description: "The analysis took too long to complete and timed out.",
      suggestion: "Our servers might be busy. Please try again in a few minutes.",
    },
    unknown: {
      title: "Analysis Error",
      description: "We encountered an unexpected error while analyzing your audio file.",
      suggestion: "Our team has been notified. Please try again or contact support if the issue persists.",
    },
  }

  const currentError = errorMessages[errorType as keyof typeof errorMessages]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="card-modern text-center animate-fade-in">
          {/* Error Illustration */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <div className="absolute inset-0 bg-amber-100 rounded-full opacity-50 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <Image
                  src="/placeholder.svg?height=128&width=128&query=cute cartoon bird with headphones looking confused"
                  alt="Bird with audio problems"
                  width={128}
                  height={128}
                  className="animate-float"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            Audio Analysis Failed
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">{currentError.title}</h1>
          <p className="text-slate-600 mb-4 max-w-md mx-auto">{currentError.description}</p>
          <p className="text-slate-700 font-medium mb-8 max-w-md mx-auto">{currentError.suggestion}</p>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-8 p-4 bg-slate-100 rounded-lg text-left overflow-auto max-h-40">
              <p className="text-sm font-mono text-slate-700">{error.message || "Unknown error occurred"}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8">
            <button onClick={() => router.back()} className="btn-outline flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
            <Link href="/analyze" className="btn-primary flex items-center justify-center">
              <Upload className="h-4 w-4 mr-2" />
              Try Another File
            </Link>
          </div>

          {/* Troubleshooting Tips */}
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 mr-2 text-amber-600" />
              Troubleshooting Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="p-3 bg-white rounded-lg">
                <h4 className="font-medium text-slate-700 mb-2 flex items-center">
                  <FileAudio className="h-4 w-4 mr-2 text-emerald-600" />
                  Audio Format
                </h4>
                <p className="text-sm text-slate-600">
                  Ensure your file is in WAV, MP3, AAC, or FLAC format for best results.
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <h4 className="font-medium text-slate-700 mb-2 flex items-center">
                  <FileAudio className="h-4 w-4 mr-2 text-emerald-600" />
                  File Size
                </h4>
                <p className="text-sm text-slate-600">Keep your audio files under 10MB for faster processing.</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <h4 className="font-medium text-slate-700 mb-2 flex items-center">
                  <FileAudio className="h-4 w-4 mr-2 text-emerald-600" />
                  Audio Quality
                </h4>
                <p className="text-sm text-slate-600">Record in a quiet environment with minimal background noise.</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <h4 className="font-medium text-slate-700 mb-2 flex items-center">
                  <FileAudio className="h-4 w-4 mr-2 text-emerald-600" />
                  Recording Length
                </h4>
                <p className="text-sm text-slate-600">Aim for 5-30 seconds of clear bird sounds for optimal results.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
