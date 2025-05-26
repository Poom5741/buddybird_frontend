"use client"

import { useState } from "react"
import FileUpload from "@/components/file-upload"
import BirdTable from "@/components/bird-table"
import MapView from "@/components/map-view"
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const router = useRouter()

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      // Generate a mock analysis ID and redirect to results
      const analysisId = `analysis_${Date.now()}`
      router.push(`/analysis/${analysisId}`)
    }, 3000)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-stone-50 to-amber-50 py-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6 animate-float">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Bird Identification
            </div>
            <h1 className="text-6xl font-bold mb-6 gradient-text">
              Identify Birds with
              <br />
              Advanced AI Technology
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              โมเดลวิเคราะห์เสียงนกและรายงานด้านหนึ่ง ระบบปัญญาประดิษฐ์ที่ทันสมัยสำหรับการระบุนกจากเสียง
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/analyze" className="btn-primary inline-flex items-center">
                Start Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/dashboard" className="btn-outline">
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl font-bold mb-4 gradient-text">Why Choose BuddyBirds?</h2>
            <p className="text-xl text-slate-600">Advanced features for accurate bird identification</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-modern text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-slate-600">Get instant bird identification results with our optimized AI models</p>
            </div>

            <div className="card-modern text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">High Accuracy</h3>
              <p className="text-slate-600">Advanced machine learning algorithms ensure precise identification</p>
            </div>

            <div className="card-modern text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Easy to Use</h3>
              <p className="text-slate-600">Simple drag-and-drop interface for seamless user experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-stone-100">
        <div className="container mx-auto px-4">
          <div className="card-modern max-w-2xl mx-auto animate-slide-up">
            <h2 className="text-3xl font-bold text-center mb-4 gradient-text">Let's get started!</h2>
            <p className="text-center text-slate-600 mb-8">Upload your bird audio file and let our AI do the magic</p>
            <p className="text-center text-sm text-slate-500 mb-6">Supported formats: .wav, .mp3, .aac, .flac</p>
            <FileUpload onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            <p className="text-center text-sm text-slate-400 mt-4">Maximum file size: 10MB</p>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900 rounded-2xl p-8 shadow-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-cyan-700/50 animate-slide-up">
              <MapView />
              <div className="text-center mt-6">
                <h3 className="text-xl font-semibold mb-2 text-cyan-50">Interactive Map</h3>
                <p className="text-cyan-200">Explore bird sightings across Thailand</p>
                <Link href="/map" className="btn-primary mt-4 inline-block">
                  Explore Map
                </Link>
              </div>
            </div>

            <div className="card-modern animate-slide-up">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2 text-slate-800">Species Database</h3>
                <p className="text-slate-600">Recent bird identifications and analysis</p>
              </div>
              <BirdTable />
              <div className="text-center mt-6 pt-4 border-t border-slate-200">
                <Link href="/dashboard" className="btn-primary">
                  View Full Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
