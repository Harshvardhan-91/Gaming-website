import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Shield,
  AlertCircle,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import api from "../utils/api";
import { toast } from "react-hot-toast";

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);

  // Mock data - replace with actual API call
  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/reports");
      setReports(response.data.reports);
    } catch (error) {
      toast.error("Error fetching reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolveReport = async (reportId, resolution) => {
    try {
      const response = await api.patch(`/admin/reports/${reportId}`, {
        status: resolution.status,
        adminNotes: resolution.notes,
      });

      setReports((prev) =>
        prev.map((report) =>
          report._id === reportId ? response.data.report : report
        )
      );

      toast.success("Report updated successfully");
      setShowResolveModal(false);
    } catch (error) {
      toast.error("Error updating report");
    }
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      // TODO: Replace with actual API call
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      );
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "resolved":
        return "bg-green-100 text-green-600";
      case "dismissed":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || report.status === filterStatus;
    const matchesType = filterType === "all" || report.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Add this component inside ReportManagement.jsx
  const ResolveModal = ({ report, onClose, onResolve }) => {
    const [notes, setNotes] = useState("");
    const [status, setStatus] = useState("resolved");

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Resolve Report</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Add any notes about the resolution..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={() => onResolve({ status, notes })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Resolution
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Report Management</h1>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="all">All Types</option>
              <option value="listing">Listings</option>
              <option value="user">Users</option>
              <option value="chat">Chat</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Reported Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            // Inside the table body of ReportManagement.jsx
            <tbody className="divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${
            report.type === "listing"
              ? "bg-blue-100 text-blue-800"
              : report.type === "user"
              ? "bg-purple-100 text-purple-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
                    >
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {report.type === "listing" && (
                        <img
                          src={
                            report.reportedItem.images[0] || "/placeholder.jpg"
                          }
                          alt="Item"
                          className="w-8 h-8 rounded-md mr-2"
                        />
                      )}
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {report.type === "listing"
                            ? report.reportedItem.title
                            : report.type === "user"
                            ? report.reportedItem.name
                            : "Chat Message"}
                        </div>
                        <div className="text-gray-500">
                          ID: {report.reportedItem._id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{report.reason}</div>
                    {report.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {report.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={report.reporter.avatar || "/placeholder.jpg"}
                        alt={report.reporter.name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {report.reporter.name}
                        </div>
                        <div className="text-gray-500">
                          {report.reporter.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={report.status}
                      onChange={(e) =>
                        handleStatusChange(report.id, e.target.value)
                      }
                      className={`px-2.5 py-1.5 rounded-full text-xs font-medium
            ${getStatusColor(report.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                      <option value="dismissed">Dismissed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setShowResolveModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(report.id, "dismissed")
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportManagement;
