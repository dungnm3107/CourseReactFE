import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import SignIn from '../pages/SignIn/SignIn';
import SignUp from '../pages/SignUp/SignUp';
import NotFound from '../pages/NotFound/NotFound';
import CardDetail from '../components/detail/CardDetail';
import MainLayout from '../components/layout/MainLayout';
import Profile from '../pages/Profile/Profile';
import Dashboard from '../pages/Admin/Dashboard'; 
import UserManagement from '../pages/Admin/UserManagement';
import CourseManagement from '../pages/Admin/CourseManagement';
import CourseDetailView from '../components/detail/CourseDetailView';
import { useAuth } from "../../src/service/AuthContext";
import ChapterManagement from '../pages/Admin/ChapterManagement'
import LessonManagement from '../pages/Admin/LessonManagement'

function AppRouter() {
  const { avatar, role } = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn onSwitchToSignUp={() => {}} onSuccessfulLogin={() => {}} />} />
        <Route path="/register" element={<SignUp onSwitchToLogin={() => {}} onSuccessfulSignUp={() => {}} />} />
        <Route path="/course-detail/:id" element={<MainLayout onOpenLoginModal={() => {}} onOpenSignUpModal={() => {}} avatar={avatar} role={role}><CardDetail /></MainLayout>} />  
        <Route path="/course-detail-view/:id" element={<CourseDetailView />} />   
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/courses" element={<CourseManagement />} />
        <Route path="/admin/chapter-management/:courseId" element={<ChapterManagement />} />
        <Route path="/admin/courses/:courseId/chapters/:chapterId/lessons" element={<LessonManagement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
