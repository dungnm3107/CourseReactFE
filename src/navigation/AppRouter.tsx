import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import SignIn from '../pages/SignIn/SignIn';
import SignUp from '../pages/SignUp/SignUp';
import NotFound from '../pages/NotFound/NotFound';
import CardDetail from '../components/detail/CardDetail';
import MainLayout from '../components/layout/MainLayout';
import Profile from '../pages/Profile/Profile';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn onSwitchToSignUp={() => {}} onSuccessfulLogin={() => {}} />} />
        <Route path="/register" element={<SignUp onSwitchToLogin={() => {}} onSuccessfulSignUp={() => {}} />} />
        <Route path="/course-detail/:id" element={<MainLayout onOpenLoginModal={() => {}} onOpenSignUpModal={() => {}} avatar={null}><CardDetail /></MainLayout>} />     
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
