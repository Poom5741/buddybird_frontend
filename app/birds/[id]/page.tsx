"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Calendar, Volume2, Download, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function BirdDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params

  // This would normally come from an API or database
  const birdData = {
    id: id,
    thaiName: "นกกระจอกบ้าน",
    commonName: "Eurasian Tree Sparrow",
    scientificName: "Passer montanus (Linnaeus, 1758)",
    found: "Pathum Thani, Khlong Luang",
    confidence: "92.1%",
    lastSeen: "3 hours ago",
    status: "active",
    habitat: "Urban areas, villages, agricultural lands",
    description:
      "The Eurasian tree sparrow is a passerine bird in the sparrow family with a rich chestnut crown and nape, and a black patch on each pure white cheek. The sexes are similarly plumaged, and young birds are a duller version of the adult. This sparrow breeds over most of temperate Eurasia and Southeast Asia, where it is known as the tree sparrow, and it has been introduced elsewhere including the United States, where it is known as the Eurasian tree sparrow or German sparrow to differentiate it from the native American tree sparrow.",
    sightings: 312,
    recordings: 98,
    firstRecorded: "Nov 12, 2022",
    diet: "Seeds, grains, insects, and some fruits",
    conservation: "Least Concern",
    length: "12.5-14 cm",
    wingspan: "20-22 cm",
    weight: "19-25 g",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-slate-600 hover:text-emerald-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="card-modern animate-fade-in">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Bird Image */}
            <div className="md:w-1/3">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={`/abstract-geometric-shapes.png?height=400&width=400&query=${encodeURIComponent(birdData.commonName)} bird detailed photo`}
                  alt={birdData.commonName}
                  width={400}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="mt-4 flex justify-center gap-2">
                <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                  <Volume2 className="h-5 w-5 text-slate-600" />
                </button>
                <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                  <Download className="h-5 w-5 text-slate-600" />
                </button>
                <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                  <Share2 className="h-5 w-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Bird Details */}
            <div className="md:w-2/3">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-slate-800">{birdData.commonName}</h1>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full font-medium">
                  {birdData.confidence}
                </span>
              </div>

              <p className="text-xl text-slate-600 mb-6">{birdData.thaiName}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-3">Classification</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Scientific Name:</span>{" "}
                      <span className="text-slate-700 italic">{birdData.scientificName}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Conservation Status:</span>{" "}
                      <span className="text-slate-700">{birdData.conservation}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-3">Physical Characteristics</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Length:</span>{" "}
                      <span className="text-slate-700">{birdData.length}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Wingspan:</span>{" "}
                      <span className="text-slate-700">{birdData.wingspan}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Weight:</span>{" "}
                      <span className="text-slate-700">{birdData.weight}</span>
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-slate-700 mb-3">Habitat & Ecology</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Habitat:</span>{" "}
                      <span className="text-slate-700">{birdData.habitat}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-slate-600">Diet:</span>{" "}
                      <span className="text-slate-700">{birdData.diet}</span>
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-slate-700 mb-3">Description</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{birdData.description}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-3">Sighting Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-xs text-slate-500">First Recorded</p>
                      <p className="text-sm font-medium">{birdData.firstRecorded}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-xs text-slate-500">Total Sightings</p>
                      <p className="text-sm font-medium">{birdData.sightings}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-xs text-slate-500">Audio Recordings</p>
                      <p className="text-sm font-medium">{birdData.recordings}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Link href="/map" className="btn-outline">
                  View on Map
                </Link>
                <Link href="/analyze" className="btn-primary">
                  Analyze Similar Audio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
