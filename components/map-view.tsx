"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Layers } from "lucide-react"

export default function MapView() {
  const [activeLayer, setActiveLayer] = useState("sightings")

  return (
    <div className="relative">
      <div className="relative w-full h-[300px] rounded-xl overflow-hidden group">
        <Image
          src="/thailand-bird-map.png"
          alt="Interactive Map of Thailand"
          width={400}
          height={300}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Map Overlay Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <button
            onClick={() => setActiveLayer(activeLayer === "sightings" ? "density" : "sightings")}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-all duration-200"
          >
            <Layers className="h-4 w-4 text-indigo-600" />
          </button>
        </div>

        {/* Sample Markers */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <MapPin className="h-6 w-6 text-rose-500 animate-bounce" />
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Bangkok
            </div>
          </div>
        </div>

        <div className="absolute top-1/4 left-1/3">
          <MapPin className="h-5 w-5 text-cyan-400 animate-pulse" />
        </div>

        <div className="absolute bottom-1/3 right-1/3">
          <MapPin className="h-5 w-5 text-amber-400 animate-bounce" style={{ animationDelay: "0.5s" }} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
            <span className="text-cyan-100">High Activity</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
            <span className="text-cyan-100">Medium Activity</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
            <span className="text-cyan-100">Low Activity</span>
          </div>
        </div>
      </div>
    </div>
  )
}
