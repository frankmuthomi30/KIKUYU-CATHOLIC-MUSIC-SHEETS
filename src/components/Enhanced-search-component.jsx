import React, { useState, useEffect, useCallback } from 'react';
import Loadingspinner from './Loadingspinner';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const EnhancedSearch = () => {
  const [allSheets, setAllSheets] = useState([]);
  const [filteredSheets, setFilteredSheets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllSheets = async () => {
      try {
        console.log('Fetching music sheets...');
        const firestore = getFirestore();
        const sheetsRef = collection(firestore, 'music_sheets');
        const q = query(sheetsRef, orderBy('title'));
        const snapshot = await getDocs(q);
        const sheets = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Fetched sheets:', sheets);
        setAllSheets(sheets);
        setFilteredSheets(sheets);
      } catch (err) {
        console.error('Error fetching music sheets:', err);
        setError(`Failed to load music sheets: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSheets();
  }, []);

  const performSearch = useCallback(() => {
    setSearching(true);
    console.log('Searching for:', searchTerm, 'starting with letter:', selectedLetter);
    
    const results = allSheets.filter(sheet => {
      const matchesSearch = sheet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            sheet.composer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLetter = selectedLetter === '' || sheet.title.charAt(0).toUpperCase() === selectedLetter;
      
      return matchesSearch && matchesLetter;
    });
    
    console.log('Search results:', results);
    setFilteredSheets(results);
    setSearching(false);
  }, [allSheets, searchTerm, selectedLetter]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter === selectedLetter ? '' : letter);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  if (loading) {
    return <Loadingspinner />;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto m-10 px-4">
      <h2 className="text-3xl font-bold mb-6">Music Sheets</h2>
      
      <div className="mb-6 flex">
        <input
          type="text"
          placeholder="Search by title or composer..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          aria-label="Search music sheets"
          className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
        />
        <button
          onClick={performSearch}
          className="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700"
        >
          Search
        </button>
      </div>

      <div className="mb-6 flex flex-wrap justify-center">
        {alphabet.map(letter => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            className={`m-1 px-3 py-1 rounded ${
              selectedLetter === letter
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {searching ? (
        <div className="text-center">
          <Loadingspinner />
          <p>Searching...</p>
        </div>
      ) : filteredSheets.length > 0 ? (
        <ul className="space-y-4">
          {filteredSheets.map((sheet) => (
            <li key={sheet.id} className="border p-4 rounded shadow hover:shadow-md transition-shadow">
              <Link to={`/Sheetpreview/${sheet.id}`} className="block">
                <h3 className="text-xl font-semibold text-blue-600 hover:underline">{sheet.title}</h3>
                <p className="text-gray-800">Composer: {sheet.composer}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Uploaded on: {sheet.uploadedAt && sheet.uploadedAt.toDate ? new Date(sheet.uploadedAt.toDate()).toLocaleDateString() : 'Date not available'}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">No music sheets found matching your search.</p>
      )}
    </div>
  );
};

export default EnhancedSearch;