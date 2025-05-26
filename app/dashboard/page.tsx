"use client";

import React from "react";
import { useState } from "react";
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
  MessageSquare,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import FeedbackModal from "@/components/feedback-modal";
import {
  useDashboardBirds,
  useDashboardStats,
  useHealthCheck,
} from "@/hooks/use-api";

// CSV export utility function
const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  // Define CSV headers
  const headers = [
    "ID",
    "Common Name",
    "Thai Name",
    "Scientific Name",
    "Location",
    "Confidence",
    "Status",
    "Habitat",
    "Sightings",
    "Recordings",
    "First Recorded",
    "Feedback Count",
    "Description",
  ];

  // Convert data to CSV format
  const csvContent = [
    headers.join(","), // Header row
    ...data.map((bird) =>
      [
        bird.id || "",
        `"${(bird.commonName || bird.name || "").replace(/"/g, '""')}"`,
        `"${(bird.thaiName || bird.localName || "").replace(/"/g, '""')}"`,
        `"${(bird.scientificName || "").replace(/"/g, '""')}"`,
        `"${(bird.found || "").replace(/"/g, '""')}"`,
        bird.confidence || "",
        bird.status || "",
        `"${(bird.habitat || bird.habitats || "").replace(/"/g, '""')}"`,
        bird.sightings || "",
        bird.recordings || "",
        bird.firstRecorded || "",
        bird.feedbackCount || "",
        `"${(bird.description || "").replace(/"/g, '""')}"`,
      ].join(",")
    ),
  ].join("\n");

  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    // Fallback for older browsers
    const csvData = `data:text/csv;charset=utf-8,${encodeURIComponent(
      csvContent
    )}`;
    window.open(csvData);
  }
};

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedBirdForFeedback, setSelectedBirdForFeedback] =
    useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const router = useRouter();

  // Use the new API hooks
  const {
    birds,
    loading: birdsLoading,
    error: birdsError,
    refetch,
  } = useDashboardBirds();
  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useDashboardStats();
  const apiStatus = useHealthCheck();

  if (birdsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (birdsError || statsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-4">
                Error loading data: {birdsError || statsError}
              </p>
              <button onClick={refetch} className="btn-primary">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create stats array from real API data
  const dashboardStats = stats
    ? [
        {
          label: "Total Species",
          value: stats.total_species.toLocaleString(),
          icon: TrendingUp,
          color: "emerald",
        },
        {
          label: "Active Users",
          value: stats.active_users.toLocaleString(),
          icon: Users,
          color: "blue",
        },
        {
          label: "Locations",
          value: stats.locations.toString(),
          icon: MapPin,
          color: "purple",
        },
        {
          label: "This Month",
          value: stats.this_month_predictions.toString(),
          icon: Calendar,
          color: "orange",
        },
      ]
    : [];

  const filteredBirds = birds?.filter((bird: any) => {
    // Provide safe fallbacks for each property
    const commonName = (bird.commonName || bird.name || "").toLowerCase();
    const thaiName = (bird.thaiName || bird.localName || "").toLowerCase();
    return (
      commonName.includes(searchTerm.toLowerCase()) ||
      thaiName.includes(searchTerm.toLowerCase())
    );
  });

  const handleRowClick = (id: string) => {
    router.push(`/birds/${id}`);
  };

  const toggleRowExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleFeedbackClick = (bird: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBirdForFeedback(bird);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = (feedbackData: any) => {
    console.log(
      "Feedback submitted for bird:",
      selectedBirdForFeedback?.id,
      feedbackData
    );
    // Here you would typically send the feedback to your backend
    setSelectedBirdForFeedback(null);
  };

  const handleFullFeedbackClick = (birdId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/feedback/bird_${birdId}`);
  };

  // Handle CSV export
  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Use filtered data if search/filter is active, otherwise use all birds
      const dataToExport =
        filteredBirds && filteredBirds.length > 0 ? filteredBirds : birds || [];

      if (dataToExport.length === 0) {
        alert("No data available to export");
        return;
      }

      // Generate filename with current date
      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `bird_species_data_${currentDate}.csv`;

      // Export the data
      exportToCSV(dataToExport, filename);

      // Show success message
      console.log(`Exported ${dataToExport.length} records to ${filename}`);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Get feedback status icon
  const getFeedbackStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "correct":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "incorrect":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "unsure":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
            <div className="flex items-center gap-4">
              <p className="text-slate-600">
                Monitor bird species and analyze identification data
              </p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    apiStatus === "online"
                      ? "bg-green-500"
                      : apiStatus === "offline"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                ></div>
                <span className="text-xs text-slate-500">
                  API{" "}
                  {apiStatus === "online"
                    ? "Online"
                    : apiStatus === "offline"
                    ? "Offline"
                    : "Checking"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div
              key={index}
              className="card-modern animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-3 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl`}
                >
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
            <h2 className="text-2xl font-bold text-slate-800">
              Species Database
            </h2>

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
                <button
                  className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleExport}
                  disabled={isExporting || !birds || birds.length === 0}
                  title={
                    !birds || birds.length === 0
                      ? "No data to export"
                      : "Export filtered data to CSV"
                  }
                >
                  <Download
                    className={`h-4 w-4 mr-2 ${
                      isExporting ? "animate-bounce" : ""
                    }`}
                  />
                  {isExporting ? "Exporting..." : "Export"}
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">
                    Species
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">
                    Scientific Name
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">
                    Location
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">
                    Confidence
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">
                    Feedback
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBirds?.map((bird: any) => (
                  <React.Fragment key={bird.id}>
                    <tr
                      className="border-b border-slate-100 hover:bg-emerald-50 transition-all duration-200 cursor-pointer group"
                      onClick={() => handleRowClick(bird.id)}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors duration-200">
                              {bird.commonName || bird.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {bird.thaiName || bird.localName}
                            </p>
                          </div>
                          {bird.needsFeedback && (
                            <div
                              className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"
                              title="Needs feedback"
                            />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">
                        {bird.scientificName}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">
                        {bird.found}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full font-medium">
                          {bird.confidence}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 text-sm rounded-full font-medium ${
                            bird.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {bird.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500" />
                          <span className="text-sm text-slate-600">
                            {bird.feedbackCount}
                          </span>
                          {bird.needsFeedback && (
                            <span className="text-xs text-amber-600 ml-1">
                              (needs more)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
                            onClick={(e) => toggleRowExpand(bird.id, e)}
                            title="Expand details"
                          >
                            {expandedRow === bird.id ? (
                              <ChevronUp className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            )}
                          </button>
                          <button
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                            onClick={(e) => handleFeedbackClick(bird, e)}
                            title="Quick feedback"
                          >
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            className="p-2 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
                            title="Play audio"
                          >
                            <Volume2 className="h-4 w-4 text-slate-400" />
                          </button>
                          <button
                            className="p-2 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
                            title="More info"
                          >
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
                              <h4 className="font-semibold text-slate-700 mb-2">
                                Habitat
                              </h4>
                              <p className="text-sm text-slate-600">
                                {bird.habitat || bird.habitats}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-700 mb-2">
                                Statistics
                              </h4>
                              <div className="space-y-1">
                                <p className="text-sm text-slate-600">
                                  Total Sightings: {bird.sightings}
                                </p>
                                <p className="text-sm text-slate-600">
                                  Audio Recordings: {bird.recordings}
                                </p>
                                <p className="text-sm text-slate-600">
                                  First Recorded: {bird.firstRecorded}
                                </p>
                                <p className="text-sm text-slate-600">
                                  Feedback Received: {bird.feedbackCount}
                                </p>
                                <p className="text-sm text-slate-600">
                                  Conservation: {bird.conservation_status}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-700 mb-2">
                                Description
                              </h4>
                              <p className="text-sm text-slate-600">
                                {bird.description}
                              </p>
                              {bird.diet && (
                                <div className="mt-2">
                                  <h5 className="font-medium text-slate-700 text-xs mb-1">
                                    Diet
                                  </h5>
                                  <p className="text-xs text-slate-500">
                                    {bird.diet}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-6 flex gap-4">
                            <button
                              className="btn-primary text-sm flex items-center"
                              onClick={() => handleRowClick(bird.id)}
                            >
                              View Full Details
                            </button>
                            <button
                              className="btn-outline text-sm flex items-center"
                              onClick={(e) => handleFeedbackClick(bird, e)}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Quick Feedback
                            </button>
                            <button
                              className="btn-outline text-sm flex items-center"
                              onClick={(e) =>
                                handleFullFeedbackClick(bird.id, e)
                              }
                            >
                              Full Feedback Form
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
              Showing {filteredBirds?.length} of {birds?.length} species
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

        {/* Feedback Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card-modern">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Feedback Needed
            </h3>
            <div className="space-y-2">
              {birds
                ?.filter((bird: any) => bird.needsFeedback)
                .slice(0, 3)
                .map((bird: any) => (
                  <div
                    key={bird.id}
                    className="flex items-center justify-between p-2 bg-amber-50 rounded-lg"
                  >
                    <span className="text-sm text-slate-700">
                      {bird.commonName || bird.name}
                    </span>
                    <button
                      onClick={(e) => handleFeedbackClick(bird, e)}
                      className="text-xs bg-amber-500 text-white px-2 py-1 rounded hover:bg-amber-600 transition-colors"
                    >
                      Feedback
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <div className="card-modern">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Recent Feedback
            </h3>
            <div className="space-y-2">
              {stats?.recent_feedback.slice(0, 3).map((feedback, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-slate-700">
                    {feedback.bird_name}
                  </span>
                  <div className="flex items-center gap-1">
                    {getFeedbackStatusIcon(feedback.status)}
                    <span className="text-xs text-slate-600 capitalize">
                      {feedback.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-modern">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Feedback Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Total Feedback</span>
                <span className="font-semibold">{stats?.total_feedback}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Accuracy Rate</span>
                <span className="font-semibold text-green-600">
                  {stats?.accuracy_rate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Needs Review</span>
                <span className="font-semibold text-amber-600">
                  {stats?.needs_review}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">
                  Total Predictions
                </span>
                <span className="font-semibold">
                  {stats?.total_predictions}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {selectedBirdForFeedback && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => {
            setShowFeedbackModal(false);
            setSelectedBirdForFeedback(null);
          }}
          birdData={{
            id: selectedBirdForFeedback.id,
            thaiName:
              selectedBirdForFeedback.thaiName ||
              selectedBirdForFeedback.localName,
            commonName:
              selectedBirdForFeedback.commonName ||
              selectedBirdForFeedback.name,
            scientificName: selectedBirdForFeedback.scientificName,
            confidence: selectedBirdForFeedback.confidence,
          }}
          onSubmitFeedback={handleFeedbackSubmit}
        />
      )}
    </div>
  );
}
