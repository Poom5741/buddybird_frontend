"use client"

import type React from "react"
import { useState } from "react"
import { Upload, FileAudio, CheckCircle, Loader2 } from "lucide-react"
import { useAudioPrediction } from "@/hooks/use-api"

interface FileUploadProps {
  onAnalyze?: (result?: any) => void
  isAnalyzing?: boolean
}

export default function FileUpload({ onAnalyze, isAnalyzing }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const { predictBird, loading: predicting, error: predictionError } = useAudioPrediction()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleAnalyzeClick = async () => {
    if (file && onAnalyze) {
      try {
        const result = await predictBird(file, {
          recorded_at: new Date().toISOString(),
          user_notes: `Uploaded via web interface: ${file.name}`,
        })

        if (result) {
          // Call the original onAnalyze with the prediction result
          onAnalyze(result)
        }
      } catch (error) {
        console.error("Prediction failed:", error)
        // Still call onAnalyze for fallback behavior
        onAnalyze()
      }
    }
  }

  return (
    <div className="space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-emerald-400 bg-emerald-50 scale-105"
            : file
              ? "border-emerald-300 bg-emerald-50"
              : "border-slate-300 hover:border-emerald-400 hover:bg-emerald-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".wav,.mp3,.aac,.flac"
          onChange={handleFileChange}
        />

        <div className="space-y-4">
          {file ? (
            <>
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-emerald-700">File uploaded successfully!</p>
                <p className="text-sm text-slate-600 mt-1">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <Upload className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-700">Drop your audio file here</p>
                <p className="text-sm text-slate-500">or click to browse</p>
              </div>
            </>
          )}
        </div>
      </div>

      {file && (
        <div className="flex justify-center animate-fade-in">
          <button
            onClick={handleAnalyzeClick}
            disabled={isAnalyzing || predicting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isAnalyzing || predicting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FileAudio className="h-5 w-5 mr-2" />
                Analyze Audio
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
