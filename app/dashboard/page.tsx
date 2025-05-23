"use client"

import React from "react"

import { useState } from "react"
import {
  Search,
  Filter,
  Download,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  Info,
  ChevronDown,
  ChevronUp,
  Volume2,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const router = useRouter()

  const stats = [
    { label: "Total Species", value: "1,247", icon: TrendingUp, color: "emerald" },
    { label: "Active Users", value: "8,932", icon: Users, color: "blue" },
    { label: "Locations", value: "156", icon: MapPin, color: "purple" },
    { label: "This Month", value: "2,341", icon: Calendar, color: "orange" },
  ]

  const birds = [
    {
      id: "b001",
      thaiName: "อีกา",
      commonName: "Eastern Jungle Crow",
      scientificName: "Corvus levaillantii (Lesson, 1831)",
      found: "Pathum Thani, Khlong Luang",
      confidence: "94.2%",
      lastSeen: "2 hours ago",
      status: "active",
      habitat: "Urban areas, agricultural lands",
      description: "Large, all-black bird with a thick bill. Common in urban and rural settings across Thailand.",
      sightings: 156,
      recordings: 42,
      firstRecorded: "Jan 15, 2023",
    },
    {
      id: "b002",
      thaiName: "นกเอี้ยงสาริกา",
      commonName: "Common Myna",
      scientificName: "Acridotheres tristis (Linnaeus, 1766)",
      found: "Pathum Thani, Khlong Luang",
      confidence: "89.7%",
      lastSeen: "5 hours ago",
      status: "active",
      habitat: "Urban parks, gardens, agricultural areas",
      description:
        "Medium-sized bird with brown body, black head and yellow bill and legs. Highly adaptable to human environments.",
      sightings: 203,
      recordings: 67,
      firstRecorded: "Dec 3, 2022",
    },
    {
      id: "b003",
      thaiName: "นกเขาไฟ",
      commonName: "Red Collared Dove",
      scientificName: "Streptopelia tranquebarica (Hermann, 1804)",
      found: "Pathum Thani, Khlong Luang",
      confidence: "87.3%",
      lastSeen: "1 day ago",
      status: "inactive",
      habitat: "Open woodlands, agricultural fields",
      description: "Small dove with distinctive red collar in males. Common in rural and suburban areas.",
      sightings: 89,
      recordings: 23,
      firstRecorded: "Mar 8, 2023",
    },
    {
      id: "b004",
      thaiName: "นกกระจอกบ้าน",
      commonName: "Eurasian Tree Sparrow",
      scientificName: "Passer montanus (Linnaeus, 1758)",
      found: "Pathum Thani, Khlong Luang",
      confidence: "92.1%",
      lastSeen: "3 hours ago",
      status: "active",
      habitat: "Urban areas, villages, agricultural lands",
      description: "Small, brown bird with chestnut crown and black cheek patch. Very common in human settlements.",
      sightings: 312,
      recordings: 98,
      firstRecorded: "Nov 12, 2022",
    },
    {
      id: "b005",
      thaiName: "นกพิราบป่า",
      commonName: "Rock Pigeon",
      scientificName: "Columba livia (Gmelin, 1789)",
      found: "Pathum Thani, Khlong Luang",
      confidence: "96.8%",
      lastSeen: "1 hour ago",
      status: "active",
      habitat: "Urban areas, cliffs, rocky areas",
      description: "Medium-sized pigeon with variable coloration. Extremely common in urban environments worldwide.",
      sightings: 427,
      recordings: 112,
      firstRecorded: "Oct 5, 2022",
    },
  ]

  const filteredBirds = birds.filter(
    (bird) => bird.commonName.toLowerCase().includes(searchTerm.toLowerCase()) || bird.thaiName.includes(searchTerm),
  )

  const handleRowClick = (id: string) => {
    router.push(`/birds/${id}`)
  }

  const toggleRowExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedRow(expandedRow === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
          <p className="text-slate-600">Monitor bird species and analyze identification data</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card-modern animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <div className={`p-3 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard */}
        <div className="card-modern animate-slide-up">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Species Database</h2>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search species..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex gap-2">
                <button className="btn-outline flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
                <button className="btn-primary flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Species</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Scientific Name</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Location</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Confidence</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Last Seen</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBirds.map((bird) => (
                  <React.Fragment key={bird.id}>
                    <tr
                      className="border-b border-slate-100 hover:bg-emerald-50 transition-all duration-200 cursor-pointer group"
                      onClick={() => handleRowClick(bird.id)}
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors duration-200">
                            {bird.commonName}
                          </p>
                          <p className="text-sm text-slate-500">{bird.thaiName}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">{bird.scientificName}</td>
                      <td className="py-4 px-4 text-sm text-slate-600">{bird.found}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full font-medium">
                          {bird.confidence}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 text-sm rounded-full font-medium ${
                            bird.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {bird.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-500">{bird.lastSeen}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
                            onClick={(e) => toggleRowExpand(bird.id, e)}
                          >
                            {expandedRow === bird.id ? (
                              <ChevronUp className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            )}
                          </button>
                          <button className="p-2 hover:bg-emerald-100 rounded-lg transition-colors duration-200">
                            <Volume2 className="h-4 w-4 text-slate-400" />
                          </button>
                          <button className="p-2 hover:bg-emerald-100 rounded-lg transition-colors duration-200">
                            <Info className="h-4 w-4 text-slate-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRow === bird.id && (
                      <tr className="bg-emerald-50/50">
                        <td colSpan={7} className="py-4 px-6 animate-fade-in">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <h4 className="font-semibold text-slate-700 mb-2">Habitat</h4>
                              <p className="text-sm text-slate-600">{bird.habitat}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-700 mb-2">Statistics</h4>
                              <div className="space-y-1">
                                <p className="text-sm text-slate-600">Total Sightings: {bird.sightings}</p>
                                <p className="text-sm text-slate-600">Audio Recordings: {bird.recordings}</p>
                                <p className="text-sm text-slate-600">First Recorded: {bird.firstRecorded}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-700 mb-2">Description</h4>
                              <p className="text-sm text-slate-600">{bird.description}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button className="btn-primary text-sm" onClick={() => handleRowClick(bird.id)}>
                              View Full Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Showing {filteredBirds.length} of {birds.length} species
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                Previous
              </button>
              <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200">
                1
              </button>
              <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                2
              </button>
              <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
