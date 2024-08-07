import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { firestore, collection, query, where, orderBy, getDocs, doc, deleteDoc, getDoc, setDoc, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Upload, Edit2, Trash2, X, User } from 'lucide-react';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [userSheets, setUserSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [sheetToDelete, setSheetToDelete] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setError('You must be logged in to view your profile');
        setLoading(false);
        return;
      }

      try {
        const sheetsRef = collection(firestore, 'music_sheets');
        const q = query(sheetsRef, where('uploadedBy', '==', currentUser.uid), orderBy('uploadedAt', 'desc'));
        const snapshot = await getDocs(q);

        const sheets = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setUserSheets(sheets);

        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setProfilePic(userDocSnap.data().profilePicUrl || null);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load your profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleDelete = async () => {
    if (sheetToDelete) {
      try {
        await deleteDoc(doc(firestore, 'music_sheets', sheetToDelete));
        setUserSheets(userSheets.filter(sheet => sheet.id !== sheetToDelete));
        showNotification('success', 'Music sheet deleted successfully!');
        setIsConfirmDeleteOpen(false);
        setSheetToDelete(null);
      } catch (err) {
        console.error('Error deleting music sheet:', err);
        showNotification('error', 'Failed to delete music sheet. Please try again.');
        setIsConfirmDeleteOpen(false);
        setSheetToDelete(null);
      }
    }
  };

  const handleProfilePicUpdate = async () => {
    if (!newProfilePic) return;

    try {
      const storageRef = ref(storage, `profile_pics/${currentUser.uid}/${newProfilePic.name}`);
      await uploadBytes(storageRef, newProfilePic);
      const url = await getDownloadURL(storageRef);

      const userDocRef = doc(firestore, 'users', currentUser.uid);
      await setDoc(userDocRef, { profilePicUrl: url }, { merge: true });

      setProfilePic(url);
      setIsEditModalOpen(false);
      showNotification('success', 'Profile picture updated successfully!');
    } catch (err) {
      console.error('Error updating profile picture:', err);
      showNotification('error', 'Failed to update profile picture. Please try again.');
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000); // Hide notification after 5 seconds
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500 border-opacity-50"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-4xl font-bold mb-8 text-blue-900">User Profile</h2>

      {notification && (
        <div className={`p-4 mb-6 rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {notification.message}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center mb-6">
          <div className="relative mb-4 md:mb-0 md:mr-8">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={48} className="text-gray-400" />
              </div>
            )}
            <button 
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit2 size={16} />
            </button>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-blue-800 mb-2">{currentUser.email}</h3>
            <p className="text-gray-600">User ID: {currentUser.uid}</p>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-xl font-semibold mb-3 text-blue-800">Your Stats</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-800">{userSheets.length}</p>
              <p className="text-sm text-blue-600">Uploaded Sheets</p>
            </div>
            {/* Add more stats here as needed */}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-6 text-blue-900">Your Uploaded Sheets</h3>
        {userSheets.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userSheets.map((sheet) => (
              <div key={sheet.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                <div className="p-6">
                  <Link to={`/sheet/${sheet.id}`} className="text-xl font-semibold text-blue-700 hover:text-blue-900 transition-colors">
                    {sheet.title}
                  </Link>
                  <p className="text-gray-600 mt-2">Composer: {sheet.composer}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Uploaded on: {new Date(sheet.uploadedAt.toDate()).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                  <Link to={`/editmusicsheet/${sheet.id}`} className="text-blue-500 hover:text-blue-700 transition-colors flex items-center">
                    <Edit2 size={16} className="mr-1" /> Edit
                  </Link>
                  <button
                    onClick={() => {
                      setSheetToDelete(sheet.id);
                      setIsConfirmDeleteOpen(true);
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors flex items-center"
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 bg-white p-6 rounded-lg shadow">You haven't uploaded any music sheets yet.</p>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link to="/upload" className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors text-lg font-semibold">
          <Upload className="mr-2" /> Upload New Sheet
        </Link>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-blue-900">Edit Profile Picture</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <input 
              type="file" 
              onChange={(e) => setNewProfilePic(e.target.files[0])}
              className="mb-6 w-full p-2 border border-gray-300 rounded"
            />
            <div className="flex justify-end space-x-4">
              <button 
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                onClick={handleProfilePicUpdate}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-blue-900">Confirm Deletion</h3>
              <p className="text-gray-700 mt-4">Are you sure you want to delete this music sheet?</p>
            </div>
            <div className="flex justify-end space-x-4">
              <button 
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                onClick={() => setIsConfirmDeleteOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
