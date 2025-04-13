import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const RequestManagement = () => {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [volunteers, setVolunteers] = useState({
    registered: [] as any[],
    accepted: [] as any[],
    rejected: [] as any[],
  });
  const [selectedVolunteer, setSelectedVolunteer] = useState<any | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (eventId) {
        const eventRef = doc(db, 'events', eventId);
        const eventSnap = await getDoc(eventRef);
        if (eventSnap.exists()) {
          setEventDetails(eventSnap.data());
        }
      }
    };

    const fetchVolunteerStatus = async () => {
      if (eventId) {
        const ref = doc(db, 'eventvolunteer', eventId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          const registered = data.registered || [];
          const accepted = data.accepted || [];
          const rejected = data.rejected || [];

          const fetchDetails = async (uids: string[]) => {
            const details = await Promise.all(
              uids.map(async (uid) => {
                const ref = doc(db, 'volunteers', uid);
                const snap = await getDoc(ref);
                return snap.exists() ? { uid: snap.id, ...snap.data() } : null;
              })
            );
            return details.filter((v) => v !== null);
          };

          const registeredDetails = await fetchDetails(registered);
          const acceptedDetails = await fetchDetails(accepted);
          const rejectedDetails = await fetchDetails(rejected);

          setVolunteers({
            registered: registeredDetails,
            accepted: acceptedDetails,
            rejected: rejectedDetails,
          });
        }
      }
    };

    fetchEventDetails();
    fetchVolunteerStatus();
  }, [eventId]);

  const handleRequestAction = async (uid: string, action: 'accept' | 'reject') => {
    if (!eventId || !eventDetails) return;
    const ref = doc(db, 'eventvolunteer', eventId);

    const newRegistered = volunteers.registered.filter((v) => v.uid !== uid);
    const newAccepted = action === 'accept' ? [...volunteers.accepted.map(v => v.uid), uid] : volunteers.accepted.map(v => v.uid);
    const newRejected = action === 'reject' ? [...volunteers.rejected.map(v => v.uid), uid] : volunteers.rejected.map(v => v.uid);

    // Update the eventvolunteer document
    await updateDoc(ref, {
      registered: newRegistered.map(v => v.uid),
      accepted: Array.from(new Set(newAccepted)),
      rejected: Array.from(new Set(newRejected)),
    });

    // Update the volunteers state locally
    setVolunteers((prev) => ({
      registered: newRegistered,
      accepted: action === 'accept' ? [...prev.accepted, prev.registered.find(v => v.uid === uid)!] : prev.accepted,
      rejected: action === 'reject' ? [...prev.rejected, prev.registered.find(v => v.uid === uid)!] : prev.rejected,
    }));

    // Prepare the notification message
    const notificationMessage =
      action === 'accept'
        ? `Your request has been accepted for the event '${eventDetails.title}' by the organization '${eventDetails.organizationName}'.`
        : `We appreciate your interest, but unfortunately your request for the event '${eventDetails.title}' could not be accepted by the organization '${eventDetails.organizationName}'. We hope you’ll consider volunteering for future events!`;

    // Add the notification to Firestore
    const notificationRef = await addDoc(collection(db, 'notifications'), {
      eventUid: eventId,
      organizationUid: eventDetails.organizationId,
      volunteerUid: uid,
      message: notificationMessage,
      createdAt: serverTimestamp(),
    });
    console.log('Notification added with ID: ', notificationRef.id);

    // If the action is accept, add the volunteer to upcoming events
    if (action === 'accept') {
      const upcomingEventRef = await addDoc(collection(db, 'upcomingevents'), {
        volunteerUid: uid,
        eventUid: eventId,
        eventName: eventDetails.title,
        eventDate: eventDetails.date,
        eventTime: eventDetails.time,
        organizationUid: eventDetails.organizationId,
        createdAt: serverTimestamp(),
      });
      console.log('Upcoming Event added with ID: ', upcomingEventRef.id);
    }
  };

  const renderVolunteer = (volunteer: any) => {
    const isAccepted = volunteers.accepted.some((v) => v.uid === volunteer.uid);
    const isRejected = volunteers.rejected.some((v) => v.uid === volunteer.uid);

    return (
      <li
        key={volunteer.uid}
        className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex justify-between items-center"
      >
        <div>
          <div className="font-semibold text-lg text-gray-800">{volunteer.name}</div>
          <div className="text-gray-600 text-sm">{volunteer.email}</div>
        </div>
        <div className="flex gap-3 items-center">
          {isAccepted ? (
            <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-xl">Accepted</span>
          ) : isRejected ? (
            <span className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-xl">Rejected</span>
          ) : (
            <>
              <button
                onClick={() => handleRequestAction(volunteer.uid, 'accept')}
                className="px-4 py-2 bg-green-500 text-white rounded-xl hover:shadow-lg"
              >
                Accept
              </button>
              <button
                onClick={() => handleRequestAction(volunteer.uid, 'reject')}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:shadow-lg"
              >
                Reject
              </button>
            </>
          )}
          <button
            onClick={() => setSelectedVolunteer(volunteer)}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:shadow-lg"
          >
            View Details
          </button>
        </div>
      </li>
    );
  };

  const closeModal = () => setSelectedVolunteer(null);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10 text-indigo-600">Request Management</h1>

      {eventDetails && (
        <div className="bg-indigo-50 p-6 rounded-xl shadow-md mb-10">
          <h2 className="text-2xl font-semibold mb-2">{eventDetails.title}</h2>
          <p className="text-gray-700 mb-1">{eventDetails.description}</p>
          <p className="text-sm text-gray-600">
            {eventDetails.date} • {eventDetails.time} • {eventDetails.venue}
          </p>
        </div>
      )}

      <div className="space-y-10">
        {['registered', 'accepted', 'rejected'].map((type) => (
          <div key={type}>
            <h3 className="text-xl font-semibold text-gray-700 capitalize mb-4">
              {type} Volunteers
            </h3>
            {volunteers[type as keyof typeof volunteers].length === 0 ? (
              <p className="text-gray-400">No {type} volunteers.</p>
            ) : (
              <ul className="space-y-4">
                {volunteers[type as keyof typeof volunteers].map((volunteer) =>
                  renderVolunteer(volunteer)
                )}
              </ul>
            )}
          </div>
        ))}
      </div>

      {selectedVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-lg w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Volunteer Details</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Name:</strong> {selectedVolunteer.name}</p>
              <p><strong>Email:</strong> {selectedVolunteer.email}</p>
              <p><strong>Phone:</strong> {selectedVolunteer.phone}</p>
              <p><strong>Location:</strong> {selectedVolunteer.location}</p>
              <p><strong>Skills:</strong> {selectedVolunteer.skills?.join(', ') || 'N/A'}</p>
              <p><strong>Interests:</strong> {selectedVolunteer.interests?.join(', ') || 'N/A'}</p>
              <p><strong>Available Days:</strong> {selectedVolunteer.availableDay?.join(', ') || 'N/A'}</p>
              <p><strong>Available Times:</strong> {selectedVolunteer.availableTime?.join(', ') || 'N/A'}</p>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestManagement;