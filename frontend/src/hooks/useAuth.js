import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/');
    }
  }, [navigate]);

  const getUserInfo = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  };

  const isAuthenticated = () => {
    return !!getUserInfo();
  };

  return {
    getUserInfo,
    isAuthenticated
  };
};