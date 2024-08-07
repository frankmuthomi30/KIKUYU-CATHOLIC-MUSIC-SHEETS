import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal'; // Import the Modal component

const categories = [
  "Kuingira(entrance)", "Mass(MITHA)", "MATHOMo(readings)", "Matega(sadaka)", 
  "Wamukiri(communion)", "Gucokia ngatho(thanksgiving)", "Kurikia Mitha(EXIT SONG)",
  "Nyimbo cia maria(marian songs)", "Ngunurano(ordination songs)", 
  "Nyimboo cia macindano(Set pieces)", "itiia(Eucharist Adoration songs)"
];

const EditMusicSheet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [title, setTitle] = useState('');
  const [composer, setComposer] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [currentFileName, setCurrentFileName] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    const fetchSheetDetails = async () => {
      try {
        const docRef = doc(getFirestore(), 'music_sheets', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setComposer(data.composer);
          setDescription(data.description);
          setCategory(data.category || '');
          setCurrentFileName(data.fileName || 'Current file');
          
          if (currentUser.uid !== data.uploadedBy) {
            setError('You do not have permission to edit this sheet.');
            setModalContent('You do not have permission to edit this sheet.');
            setModalOpen(true);
          }
        } else {
          setError('Music sheet not found');
          setModalContent('Music sheet not found');
          setModalOpen(true);
        }
      } catch (err) {
        console.error('Error fetching music sheet:', err);
        setError('Failed to load music sheet details');
        setModalContent('Failed to load music sheet details');
        setModalOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSheetDetails();
  }, [id, currentUser]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to edit a music sheet');
      setModalContent('You must be logged in to edit a music sheet');
      setModalOpen(true);
      return;
    }

    // Validate file selection
    if (!file || file.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      setModalContent('Please select a valid PDF file.');
      setModalOpen(true);
      return;
    }

    setUpdating(true);
    setError('');
    setModalContent('');

    try {
      const sheetRef = doc(getFirestore(), 'music_sheets', id);
      
      let updateData = {
        title,
        composer,
        description,
        category,
        updatedAt: new Date(),
      };

      if (file) {
        const storage = getStorage(); // Get storage instance
        const fileRef = ref(storage, `music_sheets/${file.name}`);
        await uploadBytes(fileRef, file);
        const fileUrl = await getDownloadURL(fileRef);
        
        updateData.fileUrl = fileUrl;
        updateData.fileName = file.name;
      }

      await updateDoc(sheetRef, updateData);

      // Show success modal
      setModalContent('Music sheet updated successfully!');
      setModalOpen(true);

      // Redirect to user profile after modal is closed
      setTimeout(() => navigate(`/user-profile/${currentUser.uid}`), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error('Error updating music sheet:', error);
      setError('Failed to update music sheet. Please try again.');
      setModalContent('Failed to update music sheet. Please try again.');
      setModalOpen(true);
    }

    setUpdating(false);
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-4">Edit Music Sheet</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="composer" className="block mb-1">Composer</label>
          <input
            type="text"
            id="composer"
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
        <div>
          <label htmlFor="category" className="block mb-1">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="file" className="block mb-1">Music Sheet File (PDF)</label>
          <p className="text-sm text-gray-600 mb-2">Current file: {currentFileName}</p>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            accept=".pdf"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={updating}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {updating ? 'Updating...' : 'Update Music Sheet'}
        </button>
      </form>

      {/* Modal for displaying messages */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Message">
        <p>{modalContent}</p>
      </Modal>
    </div>
  );
};

export default EditMusicSheet;
