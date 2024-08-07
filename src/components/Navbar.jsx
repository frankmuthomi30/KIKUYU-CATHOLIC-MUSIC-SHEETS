import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Upload, Music, Search, User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAuth } from 'firebase/auth';
import ConfirmationModal from './ConfirmationModal'; // Import the modal component

const NavLink = ({ to, children, currentPath }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-2 text-base font-medium rounded-md transition-colors duration-150 ease-in-out
      ${currentPath === to
        ? 'bg-blue-700 text-white'
        : 'text-white hover:bg-white hover:text-blue-700'
      }`}
  >
    {children}
  </Link>
);

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const auth = getAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const getUserInitial = (user) => {
    if (user && user.displayName) {
      return user.displayName[0].toUpperCase();
    } else if (user && user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("Successfully logged out");
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error.message);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  const confirmLogout = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalConfirm = () => {
    handleLogout();
    handleModalClose();
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-700 to-black shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Music className="mr-2 text-white" size={48} />
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-white text-3xl font-bold hover:rotate-1">Kikuyu Catholic Music Sheets</h1>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <NavLink to="/upload" currentPath={location.pathname}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </NavLink>
                <NavLink to="/search" currentPath={location.pathname}>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </NavLink>
                <NavLink to="/about" currentPath={location.pathname}>
                  <User className="mr-2 h-4 w-4" />
                  About
                </NavLink>
                {currentUser ? (
                  <>
                    <NavLink to={`/user-profile/${currentUser.uid}`} currentPath={location.pathname}>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold mr-2">
                          {getUserInitial(currentUser)}
                        </div>
                        Profile
                      </div>
                    </NavLink>
                    <button
                      onClick={confirmLogout}
                      className="flex items-center px-4 py-2 text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-700 transition-colors duration-150 ease-in-out"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <NavLink to="/auth" currentPath={location.pathname}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login/Signup
                  </NavLink>
                )}
              </div>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink to="/upload" currentPath={location.pathname}>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </NavLink>
              <NavLink to="/search" currentPath={location.pathname}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </NavLink>
              <NavLink to="/about" currentPath={location.pathname}>
                <User className="mr-2 h-4 w-4" />
                About
              </NavLink>
              {currentUser ? (
                <>
                  <NavLink to={`/user-profile/${currentUser.uid}`} currentPath={location.pathname}>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold mr-2">
                        {getUserInitial(currentUser)}
                      </div>
                      Profile
                    </div>
                  </NavLink>
                  <button
                    onClick={confirmLogout}
                    className="flex items-center w-full px-4 py-2 text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-700 transition-colors duration-150 ease-in-out"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/auth" currentPath={location.pathname}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login/Signup
                </NavLink>
              )}
            </div>
          </div>
        )}
      </nav>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />
    </>
  );
}

export default Navbar;
