"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CheckCircle,
  Share2,
  Download,
  Volume2,
  MapPin,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import FeedbackModal from "@/components/feedback-modal";

// Dummy data for example – replace these with props or fetched result!
const audioUrl = "/api/mock/birdsound.mp3"; // Replace with your backend audio_url
const audioMimeType = "audio/mpeg"; // Replace with your backend mime_type if available

export default function ResultPage() {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const handleFeedback = (type: string) => {
    setFeedback(type);
    setTimeout(() => {}, 1000);
  };

  const handleFeedbackSubmit = (feedbackData: any) => {
    console.log("Feedback submitted:", feedbackData);
    setFeedback("submitted");
  };

  // ----> START: Audio Player rendering logic <----
  const renderAudioPlayer = () => {
    if (!audioUrl) return null;
    return (
      <div className="flex flex-col items-center mb-6">
        <audio
          controls
          preload="metadata"
          className="w-full max-w-xs rounded-lg shadow-lg border"
        >
          <source src={audioUrl} type={audioMimeType} />
          {/* Fallback for browsers that don't support the mime type */}
          Your browser does not support the audio element.
        </audio>
        <span className="text-xs text-slate-400 mt-2">
          {audioMimeType.replace("audio/", "").toUpperCase()} audio
        </span>
      </div>
    );
  };
  // ----> END: Audio Player rendering logic <----

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Result Card */}
          <div className="card-modern animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                <CheckCircle className="h-4 w-4 mr-2" />
                Analysis Complete
              </div>
              <h1 className="text-3xl font-bold gradient-text">
                Identification Result
              </h1>
            </div>

            {/* Bird Image */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="w-80 h-80 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  <Image
                    src="/placeholder.svg?height=320&width=320&query=eurasian tree sparrow bird detailed photo"
                    alt="Identified bird"
                    width={320}
                    height={320}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {/* Play button not needed – use the audio player below */}
              </div>
            </div>

            {/* --- AUDIO PLAYER --- */}
            {renderAudioPlayer()}
            {/* --- END AUDIO PLAYER --- */}

            {/* Bird Information */}
            <div className="space-y-6 mb-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Eurasian Tree Sparrow
                </h2>
                <p className="text-lg text-slate-600 mb-4">นกกระจอกบ้าน</p>
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-semibold text-lg">
                  <span className="mr-2">Confidence:</span>
                  <span className="text-2xl">75.43%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-700 mb-2">
                    Scientific Name
                  </h4>
                  <p className="text-slate-600 italic">Passer montanus</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-700 mb-2">
                    Common Locations
                  </h4>
                  <div className="flex items-center text-slate-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Pathum Thani, Khlong Luang</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {feedback === "submitted" ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="text-lg font-semibold text-emerald-700">
                    ขอบคุณสำหรับความคิดเห็น!
                  </p>
                  <p className="text-slate-600">Thank you for your feedback!</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <p className="text-slate-600 font-medium">
                      การระบุนกนี้ถูกต้องหรือไม่?
                    </p>
                    <p className="text-sm text-slate-500">
                      Was this identification correct?
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setShowFeedbackModal(true)}
                      className="btn-primary flex items-center justify-center"
                    >
                      <MessageSquare className="h-5 w-5 mr-2" />
                      ประเมินผลการระบุ
                    </button>
                    <Link
                      href="/feedback/result_001"
                      className="btn-outline flex items-center justify-center"
                    >
                      แบบประเมินแบบเต็ม
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Additional Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-slate-200">
              <button className="btn-outline flex items-center justify-center flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share Result
              </button>
              <button className="btn-outline flex items-center justify-center flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </button>
            </div>
          </div>

          {/* Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="card-modern text-center">
              <h3 className="text-xl font-semibold mb-4">Analyze Another</h3>
              <p className="text-slate-600 mb-4">
                Upload another audio file for identification
              </p>
              <Link href="/analyze" className="btn-primary">
                New Analysis
              </Link>
            </div>

            <div className="card-modern text-center">
              <h3 className="text-xl font-semibold mb-4">View on Map</h3>
              <p className="text-slate-600 mb-4">
                See where this species has been spotted
              </p>
              <Link href="/map" className="btn-outline">
                Open Map
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        birdData={{
          id: "b004",
          thaiName: "นกกระจอกบ้าน",
          commonName: "Eurasian Tree Sparrow",
          scientificName: "Passer montanus (Linnaeus, 1758)",
          confidence: 75.43,
        }}
        onSubmitFeedback={handleFeedbackSubmit}
      />
    </div>
  );
}
