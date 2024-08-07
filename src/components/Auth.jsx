import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { googleProvider } from '../firebase';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, LogOut, User } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();
  const auth = getAuth();

  useEffect(() => {
    if (currentUser) {
      navigate(`/user-profile/${currentUser.uid}`);
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setCurrentUser(userCredential.user); // Update the context
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setCurrentUser(userCredential.user); // Update the context
      }
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    setError('');
    try {
      await signOut(auth);
      setCurrentUser(null); // Clear the context
    } catch (error) {
      setError('Failed to log out');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setCurrentUser(user); // Update the context
      console.log('Google Sign-In successful:', user);
    } catch (error) {
      setError('Failed to sign in with Google');
      console.error('Google Sign-In error:', error);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  if (currentUser) {
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="max-w-md mx-auto m-10 p-6 bg-white rounded-lg shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <User className="mr-2" /> You are logged in
        </h2>
        <p className="mb-4 flex items-center">
          <Mail className="mr-2" /> {currentUser.email}
        </p>
        <button 
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300 ease-in-out flex items-center justify-center"
        >
          <LogOut className="mr-2" /> Log Out
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl"
    >
      <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Mail className="absolute left-3 top-9 text-gray-400" />
        </div>
        <div className="relative">
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 pl-10 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Lock className="absolute left-3 top-9 text-gray-400" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        <motion.button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300 transition duration-300 ease-in-out"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
        </motion.button>
      </form>
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="w-full mt-4 text-blue-500 hover:underline transition duration-300 ease-in-out"
      >
        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
      </button>
      <motion.button
        onClick={handleGoogleSignIn}
        className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300 ease-in-out flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
        </svg>
        Sign in with Google
      </motion.button>
      {error && (
        <motion.p 
          className="text-red-500 mt-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default Auth;
