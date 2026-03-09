import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import Input from '../../components/ui/Input/input';
import Button from '../../components/ui/Button';
import { BaseConfig } from '../../config/baseConfig';

const SignupPage = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [pic, setPic] = useState('');
  const [picPreview, setPicPreview] = useState(null);
  const [loading, setloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const postDetails = (picFile) => {
    if (!picFile) {
      toast({
        title: 'Oops!',
        description: 'Please upload your profile.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!picFile.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Only image files are allowed.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setUploadingImage(true);
    setPicPreview(URL.createObjectURL(picFile));

    const data = new FormData();
    data.append('file', picFile);
    data.append('upload_preset', 'chatly');
    data.append('cloud_name', 'talhapro321');

    fetch(BaseConfig.CLOUDINARY_URL, {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setPic(data.url.toString());
        setUploadingImage(false);
        toast({
          title: 'Success!',
          description: 'Profile picture uploaded successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: 'Upload failed',
          description: 'Failed to upload image.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setUploadingImage(false);
        setPicPreview(null);
      });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword || !pic) {
      toast({
        title: 'Missing fields',
        description: 'Please fill all the fields.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Passwords do not match.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setloading(true);

    try {
      const config = {
        headers: { 'Content-type': 'application/json' },
      };

      const { data } = await axios.post(
        `${BaseConfig.BASE_API_URL}/user`,
        { name, email, password, pic },
        config
      );

      toast({
        title: 'Account created',
        description: 'Welcome aboard!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setloading(false);
      navigate('/');
    } catch (err) {
      setloading(false);
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
    
      <div className="relative w-full max-w-lg">
        <div className="bg-white/80 rounded-2xl shadow-2xl p-8 space-y-2 border border-gray-100">

          <div className="text-center space-y-2">
       
            <h1 className="text-3xl font-bold">
              Create Account
            </h1>
            <p className="text-gray-500 text-sm">
              Join us and start connecting with others
            </p>
          </div>

      
          <form onSubmit={submitHandler} className="space-y-5">
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {picPreview ? (
                    <img
                      src={picPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg 
                      className="w-12 h-12 text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                      />
                    </svg>
                  )}
                </div>
                <label 
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg"
                >
                  {uploadingImage ? (
                    <Spinner size="xs" color="white" />
                  ) : (
                    <svg 
                      className="w-4 h-4 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 4v16m8-8H4" 
                      />
                    </svg>
                  )}
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => postDetails(e.target.files[0])}
                  className="hidden"
                  disabled={uploadingImage || loading}
                />
              </div>
              <p className="text-xs text-gray-500">Upload profile picture</p>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Full Name
              </label>
              <div className="relative">
                
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  className="w-full"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Email Address
              </label>
              <div className="relative">
             
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  className="w-full"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Password
              </label>
              <div className="relative">
                
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  className="w-full"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Confirm Password
              </label>
              <div className="relative">
               
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setconfirmPassword(e.target.value)}
                  className="w-full"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || uploadingImage}
              className="w-full bg-blue-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/" 
                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;