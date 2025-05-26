"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  Download,
  Share2,
  RefreshCw,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import FeedbackModal from "@/components/feedback-modal";
import { apiService } from "@/lib/api";

export default function AnalysisResultPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // For audio player controls
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Fetch analysis data by ID
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    // Use the API service instead of direct fetch to ensure proper port 5001 usage
    apiService
      .getPredictionById(id)
      .then((data) => {
        setAnalysisData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch analysis:", err);
        setError("Analysis not found or server error.");
        setLoading(false);
      });
  }, [id]);

  // Audio controls
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="text-center py-32 text-slate-500">
        Loading analysis...
      </div>
    );
  }
  if (error || !analysisData) {
    return (
      <div className="text-center py-32 text-red-500">
        {error || "Analysis not found"}
      </div>
    );
  }

  // File info helpers
  const meta = analysisData.metadata || {};
  const confidence = analysisData.confidence || analysisData.confidence_score;
  const fileSizeMb = meta.file_size
    ? (meta.file_size / 1024 / 1024).toFixed(2)
    : analysisData.file_size
    ? (analysisData.file_size / 1024 / 1024).toFixed(2)
    : "—";

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

        {/* Audio/File Info */}
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="card-modern">
            <h2 className="text-xl font-bold mb-3">Audio File Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block font-semibold text-slate-700">
                  Filename
                </span>
                <span className="block text-slate-600">
                  {meta.file_name || analysisData.file_name || "—"}
                </span>
              </div>
              <div>
                <span className="block font-semibold text-slate-700">Size</span>
                <span className="block text-slate-600">{fileSizeMb} MB</span>
              </div>
              <div>
                <span className="block font-semibold text-slate-700">
                  Mime type
                </span>
                <span className="block text-slate-600">
                  {meta.mime_type || analysisData.mime_type || "—"}
                </span>
              </div>
              <div>
                <span className="block font-semibold text-slate-700">
                  Upload Time
                </span>
                <span className="block text-slate-600">
                  {meta.upload_time || analysisData.upload_time || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Audio Player */}
          <div className="card-modern">
            <h2 className="text-xl font-bold mb-3">Audio Player</h2>
            {analysisData.audio_url ? (
              <audio
                ref={audioRef}
                controls
                src={analysisData.audio_url}
                style={{ width: "100%" }}
                preload="metadata"
              >
                Your browser does not support the audio element.
              </audio>
            ) : (
              <div className="w-full bg-slate-900 text-red-600 rounded-xl text-center p-6">
                No audio file available
              </div>
            )}
          </div>

          {/* Prediction Result */}
          <div className="card-modern">
            <h2 className="text-xl font-bold mb-3">Prediction</h2>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-emerald-600">
                {analysisData.predicted_bird || "?"}
              </span>
              {confidence !== undefined && (
                <span className="ml-4 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                  {confidence}% confidence
                </span>
              )}
            </div>
            <div className="mt-4 flex gap-3">
              <button
                className="btn-primary flex items-center"
                onClick={() => setShowFeedbackModal(true)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                ประเมินผลการระบุ
              </button>
              <Link
                href={`/feedback/${id}`}
                className="btn-outline flex items-center"
              >
                แบบประเมินแบบเต็ม
              </Link>
            </div>
          </div>
        </div>

        {/* Feedback Modal */}
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          birdData={{
            id: analysisData.predicted_bird,
            thaiName: analysisData.thai_name || "",
            commonName: analysisData.predicted_bird || "",
            scientificName: analysisData.scientific_name || "",
            confidence: confidence,
          }}
          onSubmitFeedback={() => setShowFeedbackModal(false)}
        />
      </div>
    </div>
  );
}
