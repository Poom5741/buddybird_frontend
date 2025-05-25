"use client"

import { useState, useEffect } from "react"
import { apiService, handleApiError, mockBirds, type Bird, type PredictionResponse } from "@/lib/api"

// Hook for fetching all birds
export function useBirds() {
  const [birds, setBirds] = useState<Bird[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBirds = async () => {
      try {
        setLoading(true)
        setError(null)

        // Try API first, fallback to mock data
        try {
          const data = await apiService.getAllBirds()
          setBirds(data)
        } catch (apiError) {
          // Only log in development, suppress in production
          if (process.env.NODE_ENV === "development") {
            console.warn("API not available, using mock data:", apiError)
          }
          setBirds(mockBirds)
        }
      } catch (err) {
        setError(handleApiError(err))
        setBirds(mockBirds) // Fallback to mock data
      } finally {
        setLoading(false)
      }
    }

    fetchBirds()
  }, [])

  const refetch = async () => {
    try {
      setLoading(true)
      const data = await apiService.getAllBirds()
      setBirds(data)
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.warn("API refetch failed, keeping current data:", err)
      }
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return { birds, loading, error, refetch }
}

// Hook for fetching a single bird
export function useBird(id: string) {
  const [bird, setBird] = useState<Bird | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBird = async () => {
      try {
        setLoading(true)
        setError(null)

        try {
          const data = await apiService.getBirdById(id)
          setBird(data)
        } catch (apiError) {
          console.warn("API not available, using mock data:", apiError)
          const mockBird = mockBirds.find((b) => b.id === id)
          setBird(mockBird || null)
        }
      } catch (err) {
        setError(handleApiError(err))
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBird()
    }
  }, [id])

  return { bird, loading, error }
}

// Hook for audio prediction
export function useAudioPrediction() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const predictBird = async (
    file: File,
    metadata?: {
      latitude?: number
      longitude?: number
      recorded_at?: string
      user_notes?: string
    },
  ): Promise<PredictionResponse | null> => {
    try {
      setLoading(true)
      setError(null)

      const result = await apiService.uploadAudioForPrediction(file, metadata)
      return result
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)

      // Return mock prediction for development
      if (process.env.NODE_ENV === "development") {
        console.warn("API not available, returning mock prediction")
        return {
          id: `prediction_${Date.now()}`,
          predicted_bird: "Eurasian Tree Sparrow",
          confidence: 92.1,
          metadata: {
            file_name: file.name,
            file_size: file.size,
            duration: "00:45",
            format: "WAV",
            sample_rate: "44.1 kHz",
            bit_depth: "16-bit",
            ...metadata,
          },
          alternative_predictions: [
            { bird_name: "Common Myna", confidence: 78.3 },
            { bird_name: "Eastern Jungle Crow", confidence: 65.7 },
            { bird_name: "Red Collared Dove", confidence: 45.2 },
          ],
          audio_analysis: {
            dominant_frequency: "2.8 kHz",
            frequency_range: "1.2 - 8.5 kHz",
            call_duration: "0.8 seconds",
            calls_detected: 12,
            noise_level: "Low",
            quality: "High",
          },
          processing_time: "2.3 seconds",
          analysis_date: new Date().toISOString(),
        }
      }

      return null
    } finally {
      setLoading(false)
    }
  }

  return { predictBird, loading, error }
}

// Hook for health check
export function useHealthCheck() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking")

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await apiService.healthCheck()
        setStatus("online")
      } catch (error) {
        console.warn("API health check failed:", error)
        setStatus("offline")
      }
    }

    checkHealth()

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  return status
}

// Hook for submitting feedback
export function useFeedback() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitFeedback = async (predictionId: string, feedbackData: any) => {
    try {
      setLoading(true)
      setError(null)

      // Try API first
      try {
        await apiService.submitFeedback(predictionId, feedbackData)
      } catch (apiError) {
        console.warn("Feedback API not available, logging locally:", feedbackData)
        // In development, just log the feedback
        console.log("Feedback submitted:", { predictionId, feedbackData })
      }
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return { submitFeedback, loading, error }
}
