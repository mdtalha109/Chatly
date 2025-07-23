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

    setloading(true);
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
        setloading(false);
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
        setloading(false);
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
      navigate('/');
    } catch (err) {
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
    <div className="flex h-screen">
      {/* Left Column - Branding */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-blue-600 text-white p-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to Chatly</h1>
        <p className="text-lg">Join the community and start connecting instantly!</p>
        <img
          src="/assets/signup-illustration.svg"
          alt="Signup Illustration"
          className="mt-8 max-w-xs"
        />
      </div>

      {/* Right Column - Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 sm:p-10 bg-white">
        <form
          className="w-full max-w-md space-y-4"
          onSubmit={submitHandler}
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Create an Account
          </h2>

          <Input
            label="Name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
          />
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => postDetails(e.target.files[0])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {picPreview && (
              <img
                src={picPreview}
                alt="Preview"
                className="mt-2 h-20 w-20 rounded-full object-cover border border-gray-300"
              />
            )}
          </div>

          <Button type="submit" className="w-full">
            {loading ? <Spinner size="sm" /> : 'Sign Up'}
          </Button>

          <p className="text-center text-sm mt-4 text-gray-600">
            Already have an account?{' '}
            <Link to="/" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage
