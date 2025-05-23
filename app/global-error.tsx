"use client"

import Link from "next/link"
import { RefreshCw, Home, AlertOctagon } from "lucide-react"
import Image from "next/image"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
              {/* Error Illustration */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <div className="absolute inset-0 bg-red-100 rounded-full opacity-50 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <Image
                      src="/placeholder.svg?height=128&width=128&query=cute cartoon bird with a shocked expression"
                      alt="Shocked bird"
                      width={128}
                      height={128}
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-4">
                <AlertOctagon className="h-4 w-4 mr-2" />
                Critical Error
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-4">Application Error</h1>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                We're sorry, but something went seriously wrong. The application couldn't load properly.
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                <button
                  onClick={() => reset()}
                  className="py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium flex items-center justify-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Application
                </button>
                <Link
                  href="/"
                  className="py-3 px-6 border-2 border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl font-medium flex items-center justify-center"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Return Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
