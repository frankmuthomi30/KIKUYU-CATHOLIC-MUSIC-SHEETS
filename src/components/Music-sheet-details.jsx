import React, { useState, useEffect } from 'react';
import Loadingspinner from './Loadingspinner';
import { useParams, useHistory } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './Loadingspinner';

const musicsheetdetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const { currentUser } = useAuth();
  const [sheet, setSheet] = useState(null);
  const [title, setTitle] = useState('');
  const [composer, setComposer] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSheetDetails = async () => {
      try {
        const firestore = getFirestore();
        const docRef = doc(firestore, 'music_sheets', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSheet({ id: docSnap.id, ...data });
          setTitle(data.title);
          setComposer(data.composer);
          setDescription(data.description);
        } else {
          setError('Music sheet not found');
        }
      } catch (err) {
        console.error('Error fetching music sheet:', err);
        setError('Failed to load music sheet details');
      } finally {
        setLoading(false);
      }
    };

    fetchSheetDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !composer || !description) {
      setError('All fields are required');
      return;
    }

    try {
      const firestore = getFirestore();
      const docRef = doc(firestore, 'music_sheets', id);
      await updateDoc(docRef, {
        title,
        composer,
        description,
      });
      alert('Music sheet updated successfully!');
      history.push(`/sheet/${id}`);
    } catch (err) {
      console.error('Error updating music sheet:', err);
      setError('Failed to update music sheet. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner/>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto m-10 px-4">
      <h2 className="text-3xl font-bold mb-4">Edit Music Sheet</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
          <input
            type="text"
            id="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="composer" className="block text-gray-700 font-bold mb-2">Composer</label>
          <input
            type="text"
            id="composer"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description</label>
          <textarea
            id="description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => history.push(`/sheet/${id}`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default musicsheetdetails;
