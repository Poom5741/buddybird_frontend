"use client";

import { useState, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MapPin, Layers } from "lucide-react";
import { useDashboardBirds } from "@/hooks/use-api";

export default function MapView() {
  const [activeLayer, setActiveLayer] = useState("sightings");
  const [map, setMap] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const { birds, loading, error } = useDashboardBirds();

  const GOOGLE_MAPS_API_KEY =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE";

  // Generate bird sightings from real bird data
  const getBirdSightings = () => {
    if (!birds || birds.length === 0) {
      // Fallback to sample data if no birds available
      return [
        {
          lat: 13.7563,
          lng: 100.5018,
          name: "Bangkok",
          color: "#ef4444",
          species: "Sample Location",
        },
        {
          lat: 18.7883,
          lng: 98.9853,
          name: "Chiang Mai",
          color: "#06b6d4",
          species: "Sample Location",
        },
        {
          lat: 7.8804,
          lng: 98.3923,
          name: "Phuket",
          color: "#f59e0b",
          species: "Sample Location",
        },
      ];
    }

    // Create realistic sightings based on bird data
    return birds.slice(0, 6).map((bird, index) => {
      const locations = [
        { lat: 13.7563, lng: 100.5018, name: "Bangkok" },
        { lat: 18.7883, lng: 98.9853, name: "Chiang Mai" },
        { lat: 7.8804, lng: 98.3923, name: "Phuket" },
        { lat: 16.4419, lng: 102.816, name: "Khon Kaen" },
        { lat: 9.1367, lng: 99.3333, name: "Surat Thani" },
        { lat: 14.993, lng: 102.1048, name: "Ubon Ratchathani" },
      ];

      const colors = [
        "#ef4444",
        "#06b6d4",
        "#f59e0b",
        "#10b981",
        "#8b5cf6",
        "#f43f5e",
      ];
      const location = locations[index % locations.length];

      return {
        ...location,
        color: colors[index % colors.length],
        species: bird.commonName || bird.name || "Unknown Species",
      };
    });
  };

  const birdSightings = getBirdSightings();

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
          mapTypeId: "terrain",
          disableDefaultUI: true, // Clean look for preview
          gestureHandling: "cooperative", // Better mobile experience
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#1e293b" }, { lightness: -10 }],
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [{ color: "#334155" }, { lightness: 5 }],
            },
            {
              featureType: "road",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        // Add markers for bird sightings
        if ((window as any).google && birdSightings.length) {
          const google = (window as any).google;
          birdSightings.forEach((sighting) => {
            new google.maps.Marker({
              position: { lat: sighting.lat, lng: sighting.lng },
              map: mapInstance,
              title: `${sighting.species} - ${sighting.name}`,
              icon: {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="20" height="26" viewBox="0 0 20 26" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0C4.477 0 0 4.477 0 10c0 10 10 16 10 16s10-6 10-16c0-5.523-4.477-10-10-10z" fill="${sighting.color}"/>
                    <circle cx="10" cy="10" r="4" fill="white"/>
                    <circle cx="10" cy="10" r="2" fill="${sighting.color}"/>
                  </svg>
                `)}`,
                scaledSize: new google.maps.Size(24, 30),
                anchor: new google.maps.Point(12, 30),
              },
            });
          });
        }

        setMap(mapInstance);
      } catch (error) {
        console.error("Failed to load Google Maps:", error);
      }
    };

    // Only initialize map when we have the API key and birds data is ready
    if (GOOGLE_MAPS_API_KEY !== "YOUR_API_KEY_HERE" && !loading) {
      initMap();
    }
  }, [GOOGLE_MAPS_API_KEY, loading, birds]); // Fixed dependencies

  // Show error state
  if (error) {
    return (
      <div className="relative w-full h-[300px] rounded-xl overflow-hidden bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
        <div className="text-center text-red-800 p-4">
          <MapPin className="h-12 w-12 mx-auto mb-2 text-red-600" />
          <h3 className="font-semibold mb-1">Map Error</h3>
          <p className="text-sm">Failed to load bird data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="bg-white/90 rounded-lg px-4 py-2 text-sm font-medium">
            Loading bird data...
          </div>
        </div>
      )}

      <div className="relative w-full h-[300px] rounded-xl overflow-hidden group">
        {/* Google Maps Container */}
        <div
          ref={mapRef}
          className="w-full h-full transition-transform duration-500 group-hover:scale-105"
          style={{ minHeight: "300px" }}
        />

        {/* Fallback for when API key is not set */}
        {GOOGLE_MAPS_API_KEY === "YOUR_API_KEY_HERE" && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <MapPin className="h-12 w-12 mx-auto mb-2 text-cyan-400" />
              <h3 className="font-semibold mb-1">Interactive Map</h3>
              <p className="text-sm text-slate-300">
                {loading
                  ? "Loading bird data..."
                  : `Showing ${birds?.length || 0} species locations`}
              </p>
            </div>
          </div>
        )}

        {/* Map Overlay Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <button
            onClick={() => {
              setActiveLayer(
                activeLayer === "sightings" ? "density" : "sightings"
              );
              // Toggle map type for visual feedback
              if (map) {
                const currentType = map.getMapTypeId();
                map.setMapTypeId(
                  currentType === "terrain" ? "satellite" : "terrain"
                );
              }
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-all duration-200"
            title="Toggle Map Layer"
          >
            <Layers className="h-4 w-4 text-indigo-600" />
          </button>
        </div>

        {/* Activity indicator overlay */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-white">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>
                {loading
                  ? "Loading..."
                  : `${birdSightings.length} Active Locations`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
            <span className="text-cyan-100">Recent Sightings</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
            <span className="text-cyan-100">Common Species</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
            <span className="text-cyan-100">Rare Species</span>
          </div>
        </div>
      </div>
    </div>
  );
}
