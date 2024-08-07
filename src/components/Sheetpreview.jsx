import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Music, User, Calendar, Download, ArrowLeft, Loader } from 'lucide-react';

const SheetPreview = () => {
  const { id } = useParams();
  const [sheet, setSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    const fetchSheet = async () => {
      try {
        const firestore = getFirestore();
        const sheetRef = doc(firestore, 'music_sheets', id);
        const sheetDoc = await getDoc(sheetRef);
        if (sheetDoc.exists()) {
          const sheetData = sheetDoc.data();
          setSheet(sheetData);
          const storage = getStorage();
          const fileRef = ref(storage, sheetData.fileUrl);
          const url = await getDownloadURL(fileRef);
          setDownloadUrl(url);
          setPreviewUrl(url);
        } else {
          setError('Sheet not found');
        }
      } catch (err) {
        console.error('Error fetching sheet:', err);
        setError('Failed to load sheet');
      } finally {
        setLoading(false);
      }
    };
    fetchSheet();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <Link to="/" className="mt-4 inline-flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="mr-2" size={20} />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-3xl font-bold mb-6 text-blue-700">{sheet.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <User className="text-gray-500 mr-2" size={20} />
              <p className="text-gray-700">Composer: {sheet.composer}</p>
            </div>
            <div className="flex items-center">
              <Music className="text-gray-500 mr-2" size={20} />
              <p className="text-gray-700">Category: {sheet.category}</p>
            </div>
            <div className="flex items-center">
              <Calendar className="text-gray-500 mr-2" size={20} />
              <p className="text-gray-700">Uploaded on: {new Date(sheet.uploadedAt.toDate()).toLocaleDateString()}</p>
            </div>
          </div>
          
          {previewUrl && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Preview</h3>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <iframe
                  src={`${previewUrl}#view=FitH`}
                  title="Sheet Music Preview"
                  className="w-full h-[32rem] md:h-[40rem]"
                />
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
            {downloadUrl && (
              <a
                href={downloadUrl}
                download
                className="w-full sm:w-auto mb-4 sm:mb-0 inline-flex items-center justify-center bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                <Download className="mr-2" size={20} />
                Download Sheet Music
              </a>
            )}
            <Link to="/" className="w-full sm:w-auto inline-flex items-center justify-center border border-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-100 transition duration-300">
              <ArrowLeft className="mr-2" size={20} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheetPreview;