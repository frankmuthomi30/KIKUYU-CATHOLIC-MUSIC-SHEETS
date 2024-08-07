import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Music, User, Code } from 'lucide-react';
import profileImage from './images/profile.jpg'; // Adjust the path as necessary

const About = () => {
  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">About Kikuyu Catholic Music Sheets</h2>
          
          <div className="flex flex-col md:flex-row items-center mb-8">
            <img
              src={profileImage}
              alt="Frank Muthomi Mbauni"
              className="w-40 h-40 rounded-full object-cover mb-4 md:mb-0 md:mr-6 shadow-md"
            />
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">Frank Muthomi Mbauni</h3>
              <p className="text-gray-600 mb-2">CEO Kikuyu Catholic Music Sheets</p>
              <p className="text-gray-600">Front-End Developer</p>
            </div>
          </div>
          
          <div className="space-y-4 text-gray-700">
            <p>
              I am a graduate from the Nyeri National Polytechnic with a diploma in I.T, currently serving as a Choir Leader in Tetu Deanary Catholic Youth choir & a choir member from Our Lady Of Farmers - Wamagana Parish. My passion lies in singing, and I have leveraged technology to make music scores accessible for praising the Lord.
            </p>
            <p>
              I created this website to help find Kikuyu Catholic music for choirs. It serves as a resource for choirs that want to find these songs but may not know how to locate them. My goal is to support the Choir-Masters by providing a comprehensive collection of music sheets for worship and praise in the Kikuyu language.
            </p>
          </div>
          
          <div className="mt-8 space-y-4">
            <h4 className="text-lg font-semibold mb-2">Key Features:</h4>
            <ul className="list-disc list-inside space-y-2">
              <li className="flex items-center">
                <Music className="mr-2 text-blue-600" size={20} />
                <span>Comprehensive collection of Kikuyu Catholic music sheets</span>
              </li>
              <li className="flex items-center">
                <User className="mr-2 text-blue-600" size={20} />
                <span>Support for Choir-Masters and choir members</span>
              </li>
              <li className="flex items-center">
                <Code className="mr-2 text-blue-600" size={20} />
                <span>User-friendly interface for easy navigation and access</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300">
              <ChevronLeft className="mr-2" size={20} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
