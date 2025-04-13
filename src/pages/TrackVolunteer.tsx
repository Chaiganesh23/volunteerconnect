import React from 'react';
import { useParams } from 'react-router-dom';

const TrackVolunteer = () => {
  const { eventId } = useParams();

  const handleScan = () => {
    // Scan QR or barcode for volunteer tracking
  };

  return (
    <div>
      <h1>Track Volunteer for Event {eventId}</h1>
      <button onClick={handleScan}>Scan QR Code</button>
    </div>
  );
};

export default TrackVolunteer;