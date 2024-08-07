import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { Music, User, FileText, Upload as UploadIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Kuingira (entrance)',
  'Mass (MITHA)',
  'Mathomo (readings)',
  'Thaburi (Psalms)',
  'Matega (sadaka)',
  'Wamukiri (communion)',
  'Gucokia ngatho (thanksgiving)',
  'Kurikia Mitha (EXIT SONG)',
  'Nyimbo cia maria (marian songs)',
  'Ngunurano (ordination songs)',
  'Nyimboo cia macindano (Set pieces)',
  'Itiia (Eucharist Adoration songs)',
];

const Upload = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    composer: '',
    description: '',
    category: '',
    file: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentUser) {
      setError('You must be logged in to upload a music sheet.');
      return;
    }

    const { title, composer, description, category, file } = formData;

    if (!title || !composer || !category || !file) {
      setError('Please fill in all required fields and select a file.');
      return;
    }

    setLoading(true);

    try {
      const fileRef = ref(getStorage(), `music_sheets/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);

      await addDoc(collection(getFirestore(), 'music_sheets'), {
        title,
        composer,
        description,
        fileUrl,
        category,
        uploadedBy: currentUser.uid,
        uploadedAt: new Date(),
      });

      setFormData({
        title: '',
        composer: '',
        description: '',
        category: '',
        file: null,
      });

      setSuccess('Music sheet uploaded successfully!');
      
      // Delay redirect to allow success message to display
      setTimeout(() => {
        navigate(`/user-profile/${currentUser.uid}`);
      }, 2000); // 2 seconds delay for the success message to be visible

    } catch (error) {
      console.error(error);
      setError('Failed to upload music sheet. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Upload Music Sheet</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <div className="relative">
            <Music className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the title of the music sheet"
            />
          </div>
        </div>
        <div>
          <label htmlFor="composer" className="block text-sm font-medium text-gray-700 mb-1">Composer *</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              id="composer"
              name="composer"
              value={formData.composer}
              onChange={handleInputChange}
              required
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the composer's name"
            />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Lyrics</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the lyrics (optional)"
              rows={4}
            />
          </div>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">Music Sheet File (PDF) *</label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleInputChange}
            accept=".pdf"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <UploadIcon className="mr-2" size={20} />
              Upload
            </>
          )}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
    </div>
  );
};

export default Upload;
