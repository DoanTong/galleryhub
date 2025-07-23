import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAppStore } from './store';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO } from './ultis/constants';

import Auth from './pages/auth';
import Profile from './pages/profile';

// ⚠️ Import MainLayout và các route con
import MainLayout from './pages/home/mainLayout/MainLayout';

import CreatePage from './pages/home/routes/createPage/createPage';
import PostPage from './pages/home/routes/postPage/postPage';
import Homepage from './pages/home/routes/homepage/homepage';
import Home from './pages/home';
import AuthPage from './pages/home/routes/authPage/authPage';
import ProfilePage from './pages/home/routes/profilePage/profilePage';
import SearchPage from './pages/home/routes/searchPage/searchPage';

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/home" /> : children;
};

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={
          <AuthRoute>
            <Auth />
          </AuthRoute>
        } />

        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />

        <Route path="/home" element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }>
          <Route index element={<Homepage />} />
          <Route path="create" element={<CreatePage />} />     
          <Route path="pin/:id" element={<PostPage />} />     
          <Route path=":username" element={<ProfilePage />} />
          <Route path="search" element={<SearchPage />} />  
        </Route>  

        {/* Redirect route không hợp lệ */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
