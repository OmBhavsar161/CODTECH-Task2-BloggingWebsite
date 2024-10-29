import React, { useState, useRef, useContext } from 'react';
import InputBox from '../components/input.component';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Navigate } from 'react-router-dom'; // Ensure Navigate is imported
import { UserContext } from '../App';
import { storeInSession } from '../common/session';
import axios from 'axios';

export default function UserAuthForm({ type }) {
  const authForm = useRef();
  const navigate = useNavigate();
  const { userAuth: { access_token }, setUserAuth } = useContext(UserContext);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const validateForm = () => {
    const { fullname, email, password, confirmPassword } = formData;

    if (type !== 'sign-in' && fullname.length < 3) {
      toast.error('Full name must be at least 3 characters long.');
      return false;
    }

    if (!email.length) {
      toast.error('Email is required.');
      return false;
    }

    if (!emailRegex.test(email)) {
      toast.error('Invalid email address.');
      return false;
    }

    if (!passwordRegex.test(password)) {
      toast.error('Password must be 6 to 20 characters long and contain at least one numeric digit, one uppercase, and one lowercase letter.');
      return false;
    }

    if (type !== 'sign-in' && password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }

    return true;
  };

  const userAuthThroughServer = async (serverRoute) => {
    const url = import.meta.env.VITE_SERVER_DOMAIN + serverRoute;
    console.log('Making request to:', url); // Check if the URL is correct

    const payload = type === 'sign-in' ? {
      email: formData.email,
      password: formData.password,
    } : {
      fullname: formData.fullname,
      email: formData.email,
      password: formData.password,
    };

    try {
      const { data } = await axios.post(url, payload);
      storeInSession("user", JSON.stringify(data));
      setUserAuth(data);
      toast.success(type === 'sign-in' ? 'Signed in successfully!' : 'Signed up successfully!');

      if (type === 'sign-up') {
        navigate('/signin'); // Redirect to sign-in page after successful sign-up
      } else {
        navigate('/editor'); // Redirect to dashboard after successful sign-in
      }
    } catch (error) {
      console.error('Error response:', error.response ? error.response.data : 'No response');
      const errorMessage = error.response?.data?.error || 'An unknown error occurred.';
      toast.error(errorMessage);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const serverRoute = type === 'sign-in' ? '/signin' : '/signup';
    
    userAuthThroughServer(serverRoute);
  };

  if (access_token) {
    return <Navigate to='/' />;
  }

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <form ref={authForm} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-center mb-6">
          {type === 'sign-in' ? 'Welcome Back' : 'Join Us Today'}
        </h1>

        {type !== 'sign-in' && (
          <InputBox
            label="Full Name"
            type="text"
            id="fullname"
            placeholder="John Doe"
            value={formData.fullname}
            onChange={handleChange}
          />
        )}

        <InputBox
          label="Email"
          type="email"
          id="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
        />

        <div className="relative">
          <InputBox
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute right-3 top-[46px] transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {type !== 'sign-in' && (
          <div className="relative">
            <InputBox
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-3 top-[46px] transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="w-full bg-black text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300"
          >
            {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

        <div className="mt-4 text-center">
          {type === 'sign-in' ? (
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-indigo-500 hover:underline">Sign up</a>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/signin" className="text-indigo-500 hover:underline">Log in</a>
            </p>
          )}
        </div>
      </form>

      <ToastContainer />
    </section>
  );
}
