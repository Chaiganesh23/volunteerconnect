import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2 } from 'lucide-react';

interface EventDetails {
  title: string;
  description: string;
  date: string;
  timeSlot: string;
  venue: string;
  city: string;
  contactName: string;
  contactInfo: string;
  interests: string;
  skills: string;
  volunteersNeeded: number;
  imageUrl?: string;
}

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, 'events', id || '');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEvent(docSnap.data() as EventDetails);
        } else {
          setError('Event not found.');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Error fetching event details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-500">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
        Loading event details...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6">
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt="Event"
            className="w-full h-64 object-cover rounded-xl mb-6"
          />
        )}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{event.title}</h1>
        <p className="text-gray-600 mb-4">{event.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
          <div>
            <strong>Date:</strong> {event.date}
          </div>
          <div>
            <strong>Time:</strong> {event.timeSlot}
          </div>
          <div>
            <strong>Venue:</strong> {event.venue}
          </div>
          <div>
            <strong>City:</strong> {event.city}
          </div>
          <div>
            <strong>Volunteers Needed:</strong> {event.volunteersNeeded}
          </div>
          <div>
            <strong>Interests:</strong> {event.interests}
          </div>
          <div>
            <strong>Skills Required:</strong> {event.skills}
          </div>
          <div>
            <strong>Contact Person:</strong> {event.contactName} ({event.contactInfo})
          </div>
        </div>

        <button
          onClick={() => alert('Apply button clicked!')} // Replace with your logic
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Apply to Volunteer
        </button>
      </div>
    </div>
  );
};

export default EventDetails;