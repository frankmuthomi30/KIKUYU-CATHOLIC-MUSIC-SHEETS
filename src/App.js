// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loadingspinner from './components/Loadingspinner';
// Lazy-loaded components
const Upload = lazy(() => import('./components/Upload-page'));
const About = lazy(() => import('./components/About'));
const Sheetpreview = lazy(() => import('./components/Sheetpreview'));
const EditMusicSheet = lazy(() => import('./components/Edit-music-sheet'));
const UserProfile = lazy(() => import('./components/User-profile'));
const Auth = lazy(() => import('./components/Auth'));
const EnhancedSearch = lazy(() => import('./components/Enhanced-search-component'));
const HomePage = lazy(() => import('./components/Homepage'));
const Page404 = lazy(() => import('./components/404-page'));

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="flex-grow p-10">
          <Suspense
            fallback={<Loadingspinner />} // Use the spinner component for loading state
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/about" element={<About />} />
              <Route path="/sheetpreview/:id" element={<Sheetpreview />} />
              <Route path="/editmusicsheet/:id" element={<EditMusicSheet />} />
              <Route path="/user-profile/:userId" element={<UserProfile />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/search" element={<EnhancedSearch />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
