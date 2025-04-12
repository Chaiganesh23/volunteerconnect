import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthStore } from '../store/authStore';
import {
  CalendarPlus,
  ClipboardList,
  Users,
  BarChart,
  Award,
} from 'lucide-react';

export function OrganizationDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [orgName, setOrgName] = useState('');

  useEffect(() => {
    const fetchOrgName = async () => {
      if (user && user.uid) {
        const docRef = doc(db, 'organizations', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrgName(docSnap.data().name || '');
        }
      }
    };
    fetchOrgName();
  }, [user]);

  const cards = [
    {
      title: 'Post New Event',
      description: 'Create a new volunteering opportunity.',
      icon: <CalendarPlus className="text-blue-600" size={32} />,
      route: '/organization/post-event',
    },
    {
      title: 'Manage Events',
      description: 'Edit or remove events you’ve created.',
      icon: <ClipboardList className="text-green-600" size={32} />,
      route: '/organization/manage-events',
    },
    {
      title: 'Volunteers',
      description: 'Track and manage volunteer participation.',
      icon: <Users className="text-orange-500" size={32} />,
      route: '/organization/volunteers',
    },
    {
      title: 'Analytics',
      description: 'View stats and impact of your activities.',
      icon: <BarChart className="text-purple-600" size={32} />,
      route: '/organization/analytics',
    },
    {
      title: 'Certificates',
      description: 'Issue certificates and give feedback.',
      icon: <Award className="text-yellow-500" size={32} />,
      route: '/organization/certificates',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-lg mb-10">
          <h1 className="text-4xl font-extrabold">Welcome{orgName && `, ${orgName}`} 👋</h1>
          <p className="mt-2 text-sm text-blue-100">
            Manage your organization’s events, volunteers, and community impact.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => navigate(card.route)}
              className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{card.title}</h2>
                {card.icon}
              </div>
              <p className="text-gray-500 text-sm">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}