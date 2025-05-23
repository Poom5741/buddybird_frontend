"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Layers, Filter, Search, Calendar, TrendingUp } from "lucide-react"

export default function MapPage() {
  const [activeLayer, setActiveLayer] = useState("sightings")
  const [selectedSpecies, setSelectedSpecies] = useState("all")
  const [timeRange, setTimeRange] = useState("week")

  const species = [
    "All Species",
    "Eastern Jungle Crow",
    "Common Myna",
    "Red Collared Dove",
    "Eurasian Tree Sparrow",
    "Rock Pigeon",
  ]

  const recentSightings = [
    { species: "Eastern Jungle Crow", location: "Bangkok", time: "2 hours ago", confidence: "94%" },
    { species: "Common Myna", location: "Pathum Thani", time: "4 hours ago", confidence: "89%" },
    { species: "Tree Sparrow", location: "Khlong Luang", time: "6 hours ago", confidence: "92%" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold gradient-text mb-2">Interactive Map</h1>
          <p className="text-slate-600">Explore bird sightings and hotspots across Thailand</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filters */}
            <div className="card-modern animate-slide-up">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Species</label>
                  <select
                    value={selectedSpecies}
                    onChange={(e) => setSelectedSpecies(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {species.map((species, index) => (
                      <option key={index} value={species.toLowerCase().replace(" ", "-")}>
                        {species}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Time Range</label>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="day">Last 24 Hours</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Map Layer</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="layer"
                        value="sightings"
                        checked={activeLayer === "sightings"}
                        onChange={(e) => setActiveLayer(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Sightings</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="layer"
                        value="density"
                        checked={activeLayer === "density"}
                        onChange={(e) => setActiveLayer(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Density Heatmap</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Sightings */}
            <div className="card-modern animate-slide-up">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Recent Sightings
              </h3>

              <div className="space-y-3">
                {recentSightings.map((sighting, index) => (
                  <div
                    key={index}
                    className="p-3 bg-slate-50 rounded-lg hover:bg-emerald-50 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{sighting.species}</h4>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        {sighting.confidence}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="mr-2">{sighting.location}</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{sighting.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Map */}
          <div className="lg:col-span-3">
            <div className="card-modern animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Bird Sightings Map</h2>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveLayer(activeLayer === "sightings" ? "density" : "sightings")}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200"
                  >
                    <Layers className="h-4 w-4 text-slate-600" />
                  </button>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search location..."
                      className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Map Container */}
              <div className="relative w-full h-[600px] rounded-xl overflow-hidden group">
                <Image
                  src="/placeholder.svg?height=600&width=800&query=detailed interactive map of Thailand with multiple bird location markers and heat zones"
                  alt="Interactive Bird Sightings Map"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />

                {/* Map Markers */}
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative group/marker">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute"></div>
                    <MapPin className="h-6 w-6 text-red-600 relative z-10" />
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover/marker:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Bangkok - 15 sightings
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/4 left-1/3">
                  <div className="relative group/marker">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse absolute"></div>
                    <MapPin className="h-5 w-5 text-emerald-600 relative z-10" />
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover/marker:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Pathum Thani - 8 sightings
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-1/3 right-1/3">
                  <div className="relative group/marker">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce absolute"></div>
                    <MapPin className="h-5 w-5 text-blue-600 relative z-10" />
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover/marker:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Khlong Luang - 12 sightings
                    </div>
                  </div>
                </div>

                <div className="absolute top-2/3 left-1/4">
                  <div className="relative group/marker">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse absolute"></div>
                    <MapPin className="h-5 w-5 text-purple-600 relative z-10" />
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover/marker:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Chiang Mai - 6 sightings
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Legend */}
              <div className="mt-6 flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-slate-600">High Activity (10+ sightings)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                    <span className="text-slate-600">Medium Activity (5-10 sightings)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600">Low Activity (1-5 sightings)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>Last updated: 2 minutes ago</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
