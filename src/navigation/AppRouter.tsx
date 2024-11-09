import React, { useState } from 'react';
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
import ChapterManagement from '../pages/Admin/ChapterManagement'
import LessonManagement from '../pages/Admin/LessonManagement'
import CardDetailPro from '../components/detail/CardDetailPro';
import Roadmap from '../pages/Roadmap/Roadmap';
import Checkout from '../pages/Checkout/Checkout';
import PaymentSuccess from '../pages/Checkout/PaymentSuccess';
import PaymentFailed from '../pages/Checkout/PaymentFailed';
import { AboutPage } from '../pages/Home/AboutPage';
import FavoritesPage from '../pages/Home/FavoritesPage';
import LoginModal from "../../src/pages/SignIn/LoginModal"
import SignUpModal from "../../src/pages/SignUp/SignUpModal"
import CourseDetailViewPro from '../components/detail/CourseDetailViewPro';

function AppRouter() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const handleOpenLoginModal = () => {
    setIsSignUpModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };
  const handleOpenSignUpModal = () => {
    setIsLoginModalOpen(false);
    setIsSignUpModalOpen(true);
  };
  const handleCloseSignUpModal = () => setIsSignUpModalOpen(false);
  // const { avatar, role } = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn onSwitchToSignUp={() => {}} onSuccessfulLogin={() => {}} />} />
        <Route path="/register" element={<SignUp onSwitchToLogin={() => {}} onSuccessfulSignUp={() => {}} />} />
        <Route path="/course-detail/:id" element={<MainLayout onOpenLoginModal={() => {}} onOpenSignUpModal={() => {}} ><CardDetail /></MainLayout>} /> 
        <Route path="/course-detail-pro/:id" element={<MainLayout onOpenLoginModal={handleOpenLoginModal} onOpenSignUpModal={handleOpenSignUpModal} ><CardDetailPro /></MainLayout>} />  
        <Route path="/course-detail-view/:id" element={<CourseDetailView />} />  
        <Route path="/course-detail-view-pro/:id" element={<CourseDetailViewPro />} />   
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/courses" element={<CourseManagement />} />
        <Route path="/admin/chapter-management/:courseId" element={<ChapterManagement />} />
        <Route path="/admin/courses/:courseId/chapters/:chapterId/lessons" element={<LessonManagement />} />
        <Route path="/roadmap" element={<MainLayout onOpenLoginModal={handleOpenLoginModal} onOpenSignUpModal={handleOpenSignUpModal} ><Roadmap /></MainLayout>} /> 
        <Route path="/checkout" element={<Checkout /> }/> 
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed/>} />
        <Route path="/api/v1/payment/vn-pay-callback" element={<PaymentSuccess />} />
        <Route path="/about-page" element={<AboutPage /> }/> 
        <Route path="/favorites" element={<MainLayout onOpenLoginModal={() => {}} onOpenSignUpModal={() => {}} ><FavoritesPage /></MainLayout>} /> 
        <Route path="*" element={<NotFound />} />
      </Routes>
      <LoginModal
        open={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onSwitchToSignUp={handleOpenSignUpModal}
        onSuccessfulLogin={handleCloseLoginModal}
      />
      <SignUpModal
        open={isSignUpModalOpen}
        onClose={handleCloseSignUpModal}
        onSwitchToLogin={handleOpenLoginModal}
      />
    </Router>
  );
}

export default AppRouter;
