// API Configuration - Easy to switch between development and production
const API_CONFIG = {
  development: {
    baseUrl: "http://localhost:5000/api/v1",
  },
  production: {
    baseUrl: "https://your-actual-api-domain.com/api/v1", // ← Update this
  },
}

const isDevelopment = process.env.NODE_ENV === "development"
const config = isDevelopment ? API_CONFIG.development : API_CONFIG.production

export const API_BASE_URL = config.baseUrl

// API Response Types
export interface Bird {
  id: string
  name: string
  thai_name?: string
  scientific_name: string
  description: string
  habitats: string
  physical_length_cm: string
  physical_wingspan_cm: string
  physical_weight_g: string
  diet: string
  image_url?: string
  conservation_status: string
  confidence?: number
  found?: string
  last_seen?: string
  status?: "active" | "inactive"
  sightings?: number
  recordings?: number
  first_recorded?: string
  feedback_count?: number
  needs_feedback?: boolean
  accuracy_rate?: number
}

export interface PredictionResponse {
  id: string
  predicted_bird: string
  confidence: number
  spectrogram_url?: string
  audio_url?: string
  metadata: {
    latitude?: number
    longitude?: number
    recorded_at?: string
    user_notes?: string
    file_name?: string
    file_size?: number
    duration?: string
    format?: string
    sample_rate?: string
    bit_depth?: string
  }
  alternative_predictions?: Array<{
    bird_name: string
    confidence: number
  }>
  audio_analysis?: {
    dominant_frequency?: string
    frequency_range?: string
    call_duration?: string
    calls_detected?: number
    noise_level?: string
    quality?: string
  }
  processing_time?: string
  analysis_date?: string
}

export interface FeedbackData {
  rating: "correct" | "unsure" | "incorrect"
  confidence: number
  comments?: string
  actual_species?: string
  location?: string
}

// API Service Class
class ApiService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed for ${url}:`, error)
      throw error
    }
  }

  // Health Check
  async healthCheck(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/health`)
      return await response.text()
    } catch (error) {
      console.error("Health check failed:", error)
      throw error
    }
  }

  // Bird Catalog Operations
  async getAllBirds(): Promise<Bird[]> {
    return this.request<Bird[]>("/birds")
  }

  async getBirdById(id: string): Promise<Bird> {
    return this.request<Bird>(`/birds/${id}`)
  }

  async createBird(birdData: Partial<Bird>): Promise<Bird> {
    return this.request<Bird>("/birds", {
      method: "POST",
      body: JSON.stringify(birdData),
    })
  }

  async updateBird(id: string, birdData: Partial<Bird>): Promise<Bird> {
    return this.request<Bird>(`/birds/${id}`, {
      method: "PUT",
      body: JSON.stringify(birdData),
    })
  }

  async deleteBird(id: string): Promise<void> {
    return this.request<void>(`/birds/${id}`, {
      method: "DELETE",
    })
  }

  // Audio Prediction
  async uploadAudioForPrediction(
    file: File,
    metadata?: {
      latitude?: number
      longitude?: number
      recorded_at?: string
      user_notes?: string
    },
  ): Promise<PredictionResponse> {
    const formData = new FormData()
    formData.append("file", file)

    if (metadata) {
      if (metadata.latitude) formData.append("latitude", metadata.latitude.toString())
      if (metadata.longitude) formData.append("longitude", metadata.longitude.toString())
      if (metadata.recorded_at) formData.append("recorded_at", metadata.recorded_at)
      if (metadata.user_notes) formData.append("user_notes", metadata.user_notes)
    }

    const url = `${this.baseUrl}/predictions`

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Audio upload failed:", error)
      throw error
    }
  }

  // Prediction History (if implemented)
  async getAllPredictions(): Promise<PredictionResponse[]> {
    return this.request<PredictionResponse[]>("/predictions")
  }

  async getPredictionById(id: string): Promise<PredictionResponse> {
    return this.request<PredictionResponse>(`/predictions/${id}`)
  }

  async deletePrediction(id: string): Promise<void> {
    return this.request<void>(`/predictions/${id}`, {
      method: "DELETE",
    })
  }

  // Feedback (if implemented)
  async submitFeedback(predictionId: string, feedbackData: FeedbackData): Promise<void> {
    return this.request<void>(`/predictions/${predictionId}/feedback`, {
      method: "POST",
      body: JSON.stringify(feedbackData),
    })
  }
}

// Export singleton instance
export const apiService = new ApiService(API_BASE_URL)

// Utility function for error handling
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return "An unexpected error occurred"
}

// Mock data fallback for development (when API is not available)
export const mockBirds: Bird[] = [
  {
    id: "b001",
    name: "Eastern Jungle Crow",
    thai_name: "อีกา",
    scientific_name: "Corvus levaillantii (Lesson, 1831)",
    description: "Large, all-black bird with a thick bill. Common in urban and rural settings across Thailand.",
    habitats: "Urban areas, agricultural lands",
    physical_length_cm: "45-50",
    physical_wingspan_cm: "85-100",
    physical_weight_g: "350-450",
    diet: "Omnivorous - insects, small animals, fruits, garbage",
    conservation_status: "Least Concern",
    confidence: 94.2,
    found: "Pathum Thani, Khlong Luang",
    last_seen: "2 hours ago",
    status: "active",
    sightings: 156,
    recordings: 42,
    first_recorded: "Jan 15, 2023",
    feedback_count: 23,
    needs_feedback: true,
    accuracy_rate: 89.5,
  },
  {
    id: "b002",
    name: "Common Myna",
    thai_name: "นกเอี้ยงสาริกา",
    scientific_name: "Acridotheres tristis (Linnaeus, 1766)",
    description:
      "Medium-sized bird with brown body, black head and yellow bill and legs. Highly adaptable to human environments.",
    habitats: "Urban parks, gardens, agricultural areas",
    physical_length_cm: "23-26",
    physical_wingspan_cm: "40-45",
    physical_weight_g: "82-143",
    diet: "Insects, fruits, nectar, small reptiles",
    conservation_status: "Least Concern",
    confidence: 89.7,
    found: "Pathum Thani, Khlong Luang",
    last_seen: "5 hours ago",
    status: "active",
    sightings: 203,
    recordings: 67,
    first_recorded: "Dec 3, 2022",
    feedback_count: 45,
    needs_feedback: false,
    accuracy_rate: 92.1,
  },
  {
    id: "b003",
    name: "Red Collared Dove",
    thai_name: "นกเขาไฟ",
    scientific_name: "Streptopelia tranquebarica (Hermann, 1804)",
    description: "Small dove with distinctive red collar in males. Common in rural and suburban areas.",
    habitats: "Open woodlands, agricultural fields",
    physical_length_cm: "20-23",
    physical_wingspan_cm: "32-35",
    physical_weight_g: "90-120",
    diet: "Seeds, grains, small fruits",
    conservation_status: "Least Concern",
    confidence: 87.3,
    found: "Pathum Thani, Khlong Luang",
    last_seen: "1 day ago",
    status: "inactive",
    sightings: 89,
    recordings: 23,
    first_recorded: "Mar 8, 2023",
    feedback_count: 12,
    needs_feedback: true,
    accuracy_rate: 78.5,
  },
  {
    id: "b004",
    name: "Eurasian Tree Sparrow",
    thai_name: "นกกระจอกบ้าน",
    scientific_name: "Passer montanus (Linnaeus, 1758)",
    description: "Small, brown bird with chestnut crown and black cheek patch. Very common in human settlements.",
    habitats: "Urban areas, villages, agricultural lands",
    physical_length_cm: "12.5-14",
    physical_wingspan_cm: "20-22",
    physical_weight_g: "19-25",
    diet: "Seeds, grains, insects, and some fruits",
    conservation_status: "Least Concern",
    confidence: 92.1,
    found: "Pathum Thani, Khlong Luang",
    last_seen: "3 hours ago",
    status: "active",
    sightings: 312,
    recordings: 98,
    first_recorded: "Nov 12, 2022",
    feedback_count: 67,
    needs_feedback: false,
    accuracy_rate: 94.2,
  },
  {
    id: "b005",
    name: "Rock Pigeon",
    thai_name: "นกพิราบป่า",
    scientific_name: "Columba livia (Gmelin, 1789)",
    description: "Medium-sized pigeon with variable coloration. Extremely common in urban environments worldwide.",
    habitats: "Urban areas, cliffs, rocky areas",
    physical_length_cm: "29-37",
    physical_wingspan_cm: "64-72",
    physical_weight_g: "300-500",
    diet: "Seeds, grains, bread, small insects",
    conservation_status: "Least Concern",
    confidence: 96.8,
    found: "Pathum Thani, Khlong Luang",
    last_seen: "1 hour ago",
    status: "active",
    sightings: 427,
    recordings: 112,
    first_recorded: "Oct 5, 2022",
    feedback_count: 89,
    needs_feedback: true,
    accuracy_rate: 91.7,
  },
]
