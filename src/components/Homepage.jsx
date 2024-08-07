import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, query, orderBy, limit, getDocs, getCountFromServer } from 'firebase/firestore';
import { Music, Clock, Search, Upload,  Loader, User } from 'lucide-react';
import ImageCarousel from './ImageCarousel';

// Import images
import choirImage from './images/mass.jpg';
import instrumentsImage from './images/pexels-pixabay-164951.jpg';
import sheetMusicImage from './images/sheet2.jpg';
import choirImage2 from './images/youths.jpg';
import choirImage3 from './images/mass.jpg';

const HomePage = () => {
  const [recentSheets, setRecentSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [sheetCount, setSheetCount] = useState(0);

  const carouselImages = [
    {
      url: choirImage,
      alt: 'Kikuyu choir singing',
      title: 'Vibrant Kikuyu Choirs',
      description: 'Experience the energy of Kikuyu Catholic choirs'
    },
    {
      url: instrumentsImage,
      alt: 'Modern instruments',
      title: 'Modern Instruments',
      description: 'Discover the Use of Latest Modern equipment'
    },
    {
      url: sheetMusicImage,
      alt: 'Sheet music collection',
      title: 'Extensive Sheet Collection',
      description: 'Access a wide variety of Kikuyu Catholic music sheets'
    },
    {
      url: choirImage2,
      alt: 'Kikuyu youth choir singing during a mass service',
      title: 'Youth Kikuyu Choirs',
      description: 'Feel the vibrant and youthful spirit of Catholic youth choirs during mass services.'
    },
    {
      url: choirImage3,
      alt: 'Kikuyu choir singing at a church event',
      title: 'Vibrant Kikuyu Choirs',
      description: 'Experience the energy and harmony of Kikuyu Catholic choirs at special church events.'
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const firestore = getFirestore();
        
        // Fetch user count
        const usersRef = collection(firestore, 'users');
        const usersCountSnapshot = await getCountFromServer(usersRef);
        setUserCount(usersCountSnapshot.data().count);

        // Fetch sheet count
        const sheetsRef = collection(firestore, 'music_sheets');
        const sheetsCountSnapshot = await getCountFromServer(sheetsRef);
        setSheetCount(sheetsCountSnapshot.data().count);

        // Fetch recent sheets
        const recentQuery = query(sheetsRef, orderBy('uploadedAt', 'desc'), limit(5));
        const recentSnapshot = await getDocs(recentQuery);
        const fetchedSheets = recentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentSheets(fetchedSheets);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-40">
      <Loader className="animate-spin text-blue-500" size={40} />
    </div>
  );

  const ErrorMessage = ({ message }) => (
    <div className="text-center mt-4 text-red-500 bg-red-100 p-4 rounded-lg">
      <p>{message}</p>
    </div>
  );

  const StatsSection = () => (
    <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-lg p-6 text-center">
      <h2 className="text-3xl font-extrabold mb-4 text-blue-900">Platform Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center flex-col">
          <div className="bg-blue-500 text-white p-4 rounded-full mb-4">
            <User className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-semibold text-blue-800 mb-2">{userCount}</h3>
          <p className="text-blue-600">Registered Users</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center flex-col">
          <div className="bg-green-500 text-white p-4 rounded-full mb-4">
            <Music className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-semibold text-green-800 mb-2">{sheetCount}</h3>
          <p className="text-green-600">Music Sheets</p>
        </div>
      </div>
    </div>
  );

  const RecentSheets = () => (
    <ul className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      {recentSheets.length > 0 ? (
        recentSheets.map((sheet) => (
          <li key={sheet.id} className="border-b border-blue-100 pb-2 transition duration-300 hover:bg-blue-50">
            <Link to={`/sheetpreview/${sheet.id}`} className="hover:text-blue-600 flex items-center">
              <Music className="mr-2 text-blue-500" size={20} />
              <span className="font-medium text-lg">{sheet.title}</span>
              <span className="ml-auto text-blue-600">by {sheet.composer}</span>
            </Link>
          </li>
        ))
      ) : (
        <li className="text-center text-blue-600">
          <p>No recent music sheets available.</p>
          <p className="mt-2">Be the first to upload a new sheet!</p>
        </li>
      )}
    </ul>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-slate-100 to-white">
      <header aria-label="Homepage header" className="text-center mb-16">
        <h1 className="text-5xl font-bold text-blue-950 mb-4">Kikuyu Catholic Music Sheets</h1>
        <p className="text-xl text-blue-700">Discover, share, and enjoy the beauty of Kikuyu Catholic music</p>
      </header>

      <section className="mb-16">
        <ImageCarousel images={carouselImages} />
      </section>

      <section className="mb-16">
        {loading ? <LoadingSpinner /> : error ? <ErrorMessage message={error} /> : <StatsSection />}
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6 text-blue-800 flex items-center">
          <Clock className="mr-2" /> Recently Added
        </h2>
        {loading ? <LoadingSpinner /> : error ? <ErrorMessage message={error} /> : <RecentSheets />}
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-6 text-blue-800">Get Started</h2>
        <div className="space-y-4 sm:space-y-0 sm:space-x-6 flex flex-col sm:flex-row justify-center">
          <Link to="/search" className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors inline-flex items-center justify-center">
            <Search className="mr-2" /> Browse All Sheets
          </Link>
          <Link to="/upload" className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors inline-flex items-center justify-center">
            <Upload className="mr-2" /> Upload a Sheet
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
