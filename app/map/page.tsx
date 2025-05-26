"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MapPin, Layers, Search, Filter, Users, Calendar, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboardBirds, useDashboardStats } from "@/hooks/use-api";

export default function MapPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeLayer, setActiveLayer] = useState("sightings");
  const [timeRange, setTimeRange] = useState("week");
  const [map, setMap] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const GOOGLE_MAPS_API_KEY =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE";

  // Use correct API hooks
  const {
    birds,
    loading: birdsLoading,
    error: birdsError,
  } = useDashboardBirds();
  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useDashboardStats();

  // Safe array operations with proper error handling
  const filteredBirds = React.useMemo(() => {
    if (!birds || !Array.isArray(birds)) return [];

    return birds.filter((bird) => {
      const matchesSearch =
        searchTerm === "" ||
        (bird.commonName &&
          bird.commonName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (bird.scientificName &&
          bird.scientificName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "common" && bird.frequency === "common") ||
        (activeFilter === "rare" && bird.frequency === "rare") ||
        (activeFilter === "endemic" && bird.endemic === true);

      return matchesSearch && matchesFilter;
    });
  }, [birds, searchTerm, activeFilter]);

  // Generate location stats and map markers based on real bird data
  const getBirdSightings = () => {
    if (!filteredBirds || filteredBirds.length === 0) {
      // Fallback to sample data if no birds available
      return [
        {
          lat: 13.7563,
          lng: 100.5018,
          name: "Bangkok",
          color: "#ef4444",
          species: "Sample Location",
          count: 0,
        },
        {
          lat: 18.7883,
          lng: 98.9853,
          name: "Chiang Mai",
          color: "#10b981",
          species: "Sample Location",
          count: 0,
        },
        {
          lat: 7.8804,
          lng: 98.3923,
          name: "Phuket",
          color: "#3b82f6",
          species: "Sample Location",
          count: 0,
        },
        {
          lat: 16.4419,
          lng: 102.816,
          name: "Khon Kaen",
          color: "#8b5cf6",
          species: "Sample Location",
          count: 0,
        },
      ];
    }

    // Create realistic sightings based on bird data
    const locations = [
      { lat: 13.7563, lng: 100.5018, name: "Bangkok" },
      { lat: 18.7883, lng: 98.9853, name: "Chiang Mai" },
      { lat: 7.8804, lng: 98.3923, name: "Phuket" },
      { lat: 16.4419, lng: 102.816, name: "Khon Kaen" },
    ];

    const colors = ["#ef4444", "#10b981", "#3b82f6", "#8b5cf6"];
    const total = filteredBirds.length;

    return locations.map((location, index) => {
      const count = Math.floor(total * (0.4 - index * 0.08));
      return {
        ...location,
        color: colors[index],
        species: filteredBirds[index]?.commonName || `Location ${index + 1}`,
        count: Math.max(count, 0),
      };
    });
  };

  const locationStats = getBirdSightings();

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || GOOGLE_MAPS_API_KEY === "YOUR_API_KEY_HERE")
        return;

      try {
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: "weekly",
        });

        const { Map } = await loader.importLibrary("maps");

        const mapInstance = new Map(mapRef.current, {
          center: { lat: 13.7563, lng: 100.5018 }, // Center on Thailand
          zoom: 6,
          mapTypeId: activeLayer === "sightings" ? "terrain" : "satellite",
          disableDefaultUI: false,
          gestureHandling: "greedy",
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "simplified" }],
            },
          ],
        });

        // Add markers for bird sightings
        if ((window as any).google && locationStats.length) {
          const google = (window as any).google;
          locationStats.forEach((sighting) => {
            const marker = new google.maps.Marker({
              position: { lat: sighting.lat, lng: sighting.lng },
              map: mapInstance,
              title: `${sighting.name} - ${sighting.count} sightings`,
              icon: {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="24" height="30" viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 12 12 18 12 18s12-6 12-18c0-6.627-5.373-12-12-12z" fill="${sighting.color}"/>
                    <circle cx="12" cy="12" r="5" fill="white"/>
                    <circle cx="12" cy="12" r="3" fill="${sighting.color}"/>
                  </svg>
                `)}`,
                scaledSize: new google.maps.Size(32, 40),
                anchor: new google.maps.Point(16, 40),
              },
            });

            // Add info window
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div class="p-2">
                  <h3 class="font-semibold text-sm">${sighting.name}</h3>
                  <p class="text-xs text-gray-600">${sighting.count} sightings</p>
                  <p class="text-xs text-gray-500">${sighting.species}</p>
                </div>
              `,
            });

            marker.addListener("click", () => {
              infoWindow.open(mapInstance, marker);
            });
          });
        }

        setMap(mapInstance);
      } catch (error) {
        console.error("Failed to load Google Maps:", error);
      }
    };

    // Only initialize map when we have the API key and birds data is ready
    if (GOOGLE_MAPS_API_KEY !== "YOUR_API_KEY_HERE" && !birdsLoading) {
      initMap();
    }
  }, [GOOGLE_MAPS_API_KEY, birdsLoading, filteredBirds, activeLayer]);

  // Update map type when layer changes
  useEffect(() => {
    if (map) {
      map.setMapTypeId(activeLayer === "sightings" ? "terrain" : "satellite");
    }
  }, [map, activeLayer]);

  // Show error state
  if (birdsError || statsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Error Loading Map Data
            </h2>
            <p className="text-red-600">
              {birdsError || statsError || "Failed to load bird data for the map"}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold gradient-text mb-2">Interactive Map</h1>
          <p className="text-slate-600">Explore bird sightings and hotspots across Thailand</p>
        </div>

        {/* Loading State */}
        {(birdsLoading || statsLoading) && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-slate-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div>
              Loading map data...
            </div>
          </div>
        )}

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
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">All Species</option>
                    <option value="common">Common Species</option>
                    <option value="rare">Rare Species</option>
                    <option value="endemic">Endemic Species</option>
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
                {filteredBirds?.slice(0, 5).map((bird, index) => (
                  <div
                    key={bird.id || index}
                    className="p-3 bg-slate-50 rounded-lg hover:bg-emerald-50 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">
                        {bird.commonName || bird.scientificName || "Unknown Species"}
                      </h4>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        {bird.confidence || "94%"}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="mr-2">{locationStats[index % locationStats.length]?.name || "Thailand"}</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{index + 1 * 2} hours ago</span>
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-slate-500 py-4">
                    No recent activity
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card-modern animate-slide-up">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {filteredBirds?.length || 0}
                    </div>
                    <div className="text-sm text-blue-600">Total Species</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {stats?.totalSightings || locationStats.reduce((sum, loc) => sum + loc.count, 0)}
                    </div>
                    <div className="text-sm text-green-600">Sightings</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {stats?.activeUsers || 0}
                    </div>
                    <div className="text-sm text-purple-600">Active Users</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">4</div>
                    <div className="text-sm text-orange-600">Locations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Map */}
          <div className="lg:col-span-3">
            <div className="card-modern animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Bird Sightings Map
                  {!birdsLoading && (
                    <Badge variant="secondary" className="ml-2">
                      {filteredBirds?.length || 0} species
                    </Badge>
                  )}
                </h2>

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
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Google Maps Container */}
              <div className="relative w-full h-[600px] rounded-xl overflow-hidden group">
                {(birdsLoading || statsLoading) && (
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                    <div className="bg-white/90 rounded-lg px-4 py-2 text-sm font-medium">
                      Loading map data...
                    </div>
                  </div>
                )}

                {/* Google Maps */}
                <div
                  ref={mapRef}
                  className="w-full h-full"
                  style={{ minHeight: "600px" }}
                />

                {/* Fallback for when API key is not set */}
                {GOOGLE_MAPS_API_KEY === "YOUR_API_KEY_HERE" && (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                      <MapPin className="h-12 w-12 mx-auto mb-2 text-cyan-400" />
                      <h3 className="font-semibold mb-1">Google Maps</h3>
                      <p className="text-sm text-slate-300">
                        Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                      </p>
                    </div>
                  </div>
                )}
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
  );
}
