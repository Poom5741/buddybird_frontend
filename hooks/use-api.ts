"use client";

import { useState, useEffect } from "react";
import {
  apiService,
  handleApiError,
  mockBirds,
  type Bird,
  type PredictionResponse,
} from "@/lib/api";

// Types for dashboard data
interface DashboardStats {
  total_species: number;
  active_users: number;
  locations: number;
  this_month_predictions: number;
  accuracy_rate: number;
  total_feedback: number;
  total_predictions: number;
  needs_review: number;
  recent_feedback: Array<{
    bird_name: string;
    notes: string;
    status: string;
    submitted_at: string;
  }>;
}

interface DashboardBird extends Bird {
  confidence: number;
  feedbackCount: number;
  needsFeedback: boolean;
  status: "active" | "inactive";
  sightings: number;
  recordings: number;
  firstRecorded: string;
  found: string;
}

// Hook for fetching all birds
export function useBirds() {
  const [birds, setBirds] = useState<Bird[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBirds = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try API first, fallback to mock data
        try {
          const data = await apiService.getAllBirds();
          setBirds(data);
        } catch (apiError) {
          // Only log in development, suppress in production
          if (process.env.NODE_ENV === "development") {
            console.warn("API not available, using mock data:", apiError);
          }
          setBirds(mockBirds);
        }
      } catch (err) {
        setError(handleApiError(err));
        setBirds(mockBirds); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchBirds();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllBirds();
      setBirds(data);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.warn("API refetch failed, keeping current data:", err);
      }
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return { birds, loading, error, refetch };
}

// Hook for fetching a single bird
export function useBird(id: string) {
  const [bird, setBird] = useState<Bird | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBird = async () => {
      try {
        setLoading(true);
        setError(null);

        try {
          const data = await apiService.getBirdById(id);
          setBird(data);
        } catch (apiError) {
          console.warn("API not available, using mock data:", apiError);
          const mockBird = mockBirds.find((b) => b.id === id);
          setBird(mockBird || null);
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBird();
    }
  }, [id]);

  return { bird, loading, error };
}

// Hook for audio prediction
export function useAudioPrediction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predictBird = async (
    file: File,
    metadata?: {
      latitude?: number;
      longitude?: number;
      recorded_at?: string;
      user_notes?: string;
    }
  ): Promise<PredictionResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiService.uploadAudioForPrediction(file, metadata);
      return result;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);

      // Return mock prediction for development
      if (process.env.NODE_ENV === "development") {
        console.warn("API not available, returning mock prediction");
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
        };
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  return { predictBird, loading, error };
}

// Hook for health check
export function useHealthCheck() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">(
    "checking"
  );

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await apiService.healthCheck();
        setStatus("online");
      } catch (error) {
        console.warn("API health check failed:", error);
        setStatus("offline");
      }
    };

    checkHealth();

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return status;
}

// Hook for submitting feedback
export function useFeedback() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitFeedback = async (predictionId: string, feedbackData: any) => {
    try {
      setLoading(true);
      setError(null);

      // Try API first
      try {
        await apiService.submitFeedback(predictionId, feedbackData);
      } catch (apiError) {
        console.warn(
          "Feedback API not available, logging locally:",
          feedbackData
        );
        // In development, just log the feedback
        console.log("Feedback submitted:", { predictionId, feedbackData });
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return { submitFeedback, loading, error };
}

// Hook for fetching dashboard-specific bird data
export function useDashboardBirds() {
  const [birds, setBirds] = useState<DashboardBird[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardBirds = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "http://localhost:5001/api/v1/birds/dashboard"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBirds(data);
      } catch (err) {
        console.error("Dashboard birds API error:", err);
        setError(handleApiError(err));
        // Fallback to mock data
        setBirds(mockBirds as DashboardBird[]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardBirds();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5001/api/v1/birds/dashboard"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBirds(data);
    } catch (err) {
      console.error("Dashboard birds refetch error:", err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return { birds, loading, error, refetch };
}

// Hook for fetching dashboard statistics
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "http://localhost:5001/api/v1/dashboard/stats"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Dashboard stats API error:", err);
        setError(handleApiError(err));
        // Fallback to mock stats
        setStats({
          total_species: 10,
          active_users: 8932,
          locations: 156,
          this_month_predictions: 48,
          accuracy_rate: 75.0,
          total_feedback: 5,
          total_predictions: 60,
          needs_review: 1,
          recent_feedback: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5001/api/v1/dashboard/stats"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Dashboard stats refetch error:", err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refetch };
}

// Hook for fetching bird sightings for map
export function useBirdSightings() {
  const [sightings, setSightings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSightings = async () => {
      try {
        setLoading(true);
        setError(null);

        try {
          const response = await fetch("http://localhost:5001/api/v1/sightings");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setSightings(data);
        } catch (apiError) {
          console.warn("Sightings API not available, using mock data:", apiError);
          // Fallback to mock sightings data
          setSightings([
            {
              id: 1,
              species: "Eastern Jungle Crow",
              location: "Bangkok",
              lat: 13.7563,
              lng: 100.5018,
              time: "2 hours ago",
              confidence: 94,
              count: 15,
              color: "red",
              analysis_id: "analysis_1",
              recorded_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 2,
              species: "Common Myna",
              location: "Pathum Thani",
              lat: 14.0208,
              lng: 100.5250,
              time: "4 hours ago",
              confidence: 89,
              count: 8,
              color: "emerald",
              analysis_id: "analysis_2",
              recorded_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 3,
              species: "Tree Sparrow",
              location: "Khlong Luang",
              lat: 14.0695,
              lng: 100.6569,
              time: "6 hours ago",
              confidence: 92,
              count: 12,
              color: "blue",
              analysis_id: "analysis_3",
              recorded_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 4,
              species: "Red Collared Dove",
              location: "Chiang Mai",
              lat: 18.7883,
              lng: 98.9853,
              time: "8 hours ago",
              confidence: 88,
              count: 6,
              color: "purple",
              analysis_id: "analysis_4",
              recorded_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 5,
              species: "Rock Pigeon",
              location: "Phuket",
              lat: 7.8804,
              lng: 98.3923,
              time: "1 day ago",
              confidence: 91,
              count: 9,
              color: "orange",
              analysis_id: "analysis_5",
              recorded_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 6,
              species: "Eurasian Tree Sparrow",
              location: "Nonthaburi",
              lat: 13.8621,
              lng: 100.5144,
              time: "2 days ago",
              confidence: 87,
              count: 4,
              color: "green",
              analysis_id: "analysis_6",
              recorded_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            },
          ]);
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchSightings();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5001/api/v1/sightings");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSightings(data);
    } catch (err) {
      console.error("Sightings refetch error:", err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return { sightings, loading, error, refetch };
}
