"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, Home, MapPin } from "lucide-react"
import Image from "next/image"

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="card-modern text-center animate-fade-in">
          {/* Error Illustration */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <div className="absolute inset-0 bg-emerald-100 rounded-full opacity-50 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <Image
                  src="/confused-cartoon-bird.png"
                  alt="Bird looking confused"
                  width={128}
                  height={128}
                  className="animate-float"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-slate-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-slate-700 mb-6">Page Not Found</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Oops! It seems our bird-watching friend couldn't spot the page you're looking for. It might have flown away
            or never existed.
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8">
            <button onClick={() => router.back()} className="btn-outline flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
            <Link href="/" className="btn-primary flex items-center justify-center">
              <Home className="h-4 w-4 mr-2" />
              Home Page
            </Link>
          </div>

          {/* Suggestions */}
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="font-semibold text-slate-700 mb-4">You might want to try:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <Link
                href="/dashboard"
                className="p-4 rounded-lg hover:bg-emerald-50 transition-colors flex flex-col items-center"
              >
                <Search className="h-6 w-6 text-emerald-600 mb-2" />
                <span className="text-slate-700">Browse Dashboard</span>
              </Link>
              <Link
                href="/analyze"
                className="p-4 rounded-lg hover:bg-emerald-50 transition-colors flex flex-col items-center"
              >
                <Search className="h-6 w-6 text-emerald-600 mb-2" />
                <span className="text-slate-700">Analyze Audio</span>
              </Link>
              <Link
                href="/map"
                className="p-4 rounded-lg hover:bg-emerald-50 transition-colors flex flex-col items-center"
              >
                <MapPin className="h-6 w-6 text-emerald-600 mb-2" />
                <span className="text-slate-700">Explore Map</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
