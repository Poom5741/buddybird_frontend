"use client"

import { useState } from "react"
import { ChevronRight, Volume2, Info, MapPin, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BirdTable() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [showDetails, setShowDetails] = useState<number | null>(null)
  const router = useRouter()

  const birds = [
    {
      id: "b001",
      thaiName: "อีกา",
      commonName: "Eastern Jungle Crow",
      scientificName: "Corvus levaillantii (Lesson, 1831)",
      found: "Pathum Thani, Khlong Luang",
      confidence: "94.2%",
      lastSeen: "2 hours ago",
      habitat: "Urban areas, agricultural lands",
      description: "Large, all-black bird with a thick bill. Common in urban and rural settings across Thailand.",
      sightings: 156,
    },
    {
      id: "b002",
      thaiName: "นกเอี้ยงสาริกา",
      commonName: "Common Myna",
      scientificName: "Acridotheres tristis (Linnaeus, 1766)",
      found: "Pathum Thani, Khlong Luang",
      confidence: "89.7%",
      lastSeen: "5 hours ago",
      habitat: "Urban parks, gardens, agricultural areas",
      description:
        "Medium-sized bird with brown body, black head and yellow bill and legs. Highly adaptable to human environments.",
      sightings: 203,
    },
    {
      id: "b003",
      thaiName: "นกเขาไฟ",
      commonName: "Red Collared Dove",
      scientificName: "Streptopelia tranquebarica (Hermann, 1804)",
      found: "Pathum Thani, Khlong Luang",
      confidence: "87.3%",
      lastSeen: "1 day ago",
      habitat: "Open woodlands, agricultural fields",
      description: "Small dove with distinctive red collar in males. Common in rural and suburban areas.",
      sightings: 89,
    },
    {
      id: "b004",
      thaiName: "นกกระจอกบ้าน",
      commonName: "Eurasian Tree Sparrow",
      scientificName: "Passer montanus (Linnaeus, 1758)",
      found: "Pathum Thani, Khlong Luang",
      confidence: "92.1%",
      lastSeen: "3 hours ago",
      habitat: "Urban areas, villages, agricultural lands",
      description: "Small, brown bird with chestnut crown and black cheek patch. Very common in human settlements.",
      sightings: 312,
    },
  ]

  const handleRowClick = (id: string) => {
    router.push(`/birds/${id}`)
  }

  return (
    <div className="space-y-4">
      {birds.map((bird, index) => (
        <div
          key={index}
          className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer relative ${
            hoveredRow === index
              ? "bg-fuchsia-900/50 border-fuchsia-400 transform scale-105"
              : "bg-violet-900/30 border-violet-700/50 hover:bg-violet-900/50"
          }`}
          onMouseEnter={() => setHoveredRow(index)}
          onMouseLeave={() => {
            setHoveredRow(null)
            setShowDetails(null)
          }}
          onClick={() => handleRowClick(bird.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-semibold text-violet-50">{bird.commonName}</h4>
                <span className="px-2 py-1 bg-fuchsia-700 text-fuchsia-100 text-xs rounded-full font-medium">
                  {bird.confidence}
                </span>
              </div>
              <p className="text-sm text-violet-200 mb-1">{bird.thaiName}</p>
              <p className="text-xs text-violet-300">{bird.found}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-2 hover:bg-fuchsia-800 rounded-lg transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDetails(showDetails === index ? null : index)
                }}
              >
                <Info className="h-4 w-4 text-fuchsia-300" />
              </button>
              <button className="p-2 hover:bg-fuchsia-800 rounded-lg transition-colors duration-200">
                <Volume2 className="h-4 w-4 text-fuchsia-300" />
              </button>
              <ChevronRight className="h-5 w-5 text-violet-400" />
            </div>
          </div>

          {/* Quick Info Tooltip on Hover */}
          {hoveredRow === index && (
            <div
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-black/90 backdrop-blur-sm text-white text-xs p-3 rounded-lg shadow-lg z-10 min-w-[200px] opacity-0 animate-fade-in"
              style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            >
              <p className="font-semibold mb-1">Click for full details</p>
              <div className="flex items-center gap-1 text-violet-200">
                <Calendar className="h-3 w-3" />
                <span>Last seen: {bird.lastSeen}</span>
              </div>
              <div className="flex items-center gap-1 text-violet-200">
                <MapPin className="h-3 w-3" />
                <span>{bird.sightings} sightings recorded</span>
              </div>
            </div>
          )}

          {/* Expanded Details Panel */}
          {showDetails === index && (
            <div className="mt-3 pt-3 border-t border-violet-700/50 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-violet-300 mb-1">Scientific Name:</p>
                  <p className="text-violet-100 italic">{bird.scientificName}</p>
                </div>
                <div>
                  <p className="text-violet-300 mb-1">Habitat:</p>
                  <p className="text-violet-100">{bird.habitat}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-violet-300 mb-1">Description:</p>
                  <p className="text-violet-100">{bird.description}</p>
                </div>
              </div>
              <button
                className="mt-3 w-full py-2 bg-fuchsia-800/50 hover:bg-fuchsia-700/50 text-white text-xs rounded-lg transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRowClick(bird.id)
                }}
              >
                View Full Details
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
