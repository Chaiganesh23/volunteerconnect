import React from 'react';
import { useParams } from 'react-router-dom';

export function EventDetails() {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Event Details</h1>
          <p className="text-gray-600">Loading event {id}...</p>
        </div>
      </div>
    </div>
  );
}