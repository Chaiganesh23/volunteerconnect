import React from 'react';
import { Award, Download, Share2 } from 'lucide-react';

export function Certificates() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Certificates</h1>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Download All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example certificate cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-lg">Community Service Excellence</h3>
                    <p className="text-sm text-gray-500">Issued on {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Hours Completed:</strong> 20
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Skills:</strong> Leadership, Communication, Teamwork
                </p>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {false && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No certificates yet</h3>
          <p className="mt-1 text-gray-500">
            Complete volunteer events to earn certificates
          </p>
        </div>
      )}
    </div>
  );
}