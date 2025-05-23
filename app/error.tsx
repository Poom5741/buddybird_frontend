"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, RefreshCw, Home, AlertTriangle } from "lucide-react"
import Image from "next/image"
import { useEffect } from "react"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="card-modern text-center animate-fade-in">
          {/* Error Illustration */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-100 rounded-full opacity-50 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <Image
                  src="/placeholder.svg?height=128&width=128&query=cute cartoon bird with a surprised expression"
                  alt="Surprised bird"
                  width={128}
                  height={128}
                  className="animate-float"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-4">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Server Error
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Something Went Wrong</h1>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Our servers encountered an unexpected error. Our team has been notified and is working to fix the issue.
          </p>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-8 p-4 bg-slate-100 rounded-lg text-left overflow-auto max-h-40">
              <p className="text-sm font-mono text-slate-700">{error.message || "Unknown error occurred"}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            <button onClick={() => router.back()} className="btn-outline flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
            <button onClick={() => reset()} className="btn-primary flex items-center justify-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
            <Link href="/" className="btn-outline flex items-center justify-center">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </div>

          {/* Support Information */}
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="font-semibold text-slate-700 mb-2">Need Help?</h3>
            <p className="text-slate-600 text-sm mb-4">
              If the problem persists, please contact our support team or try again later.
            </p>
            <Link href="mailto:support@buddybirds.com" className="text-emerald-600 hover:text-emerald-700 font-medium">
              support@buddybirds.com
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
