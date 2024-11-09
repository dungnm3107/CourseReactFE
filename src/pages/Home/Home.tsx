import { useState, useEffect } from "react";
import { AdvertBanner } from "../../components/slide/AdvertBanner";
import CardList from "../../components/course/CardList";
import CardListPro from "../../components/course/CardListPro";
import CardListVideo from "../../components/course/CardListVideo";
import MainLayout from "../../components/layout/MainLayout";
import LoginModal from "../SignIn/LoginModal";
import SignUpModal from "../SignUp/SignUpModal";
import { useAuth } from "../../service/AuthContext";
import axiosInstance from "../../config/axios";

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [avatar, setAvatar] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserAvatar();
    }
  }, [isLoggedIn]);

  const fetchUserAvatar = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/user/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log("user data:", response.data);
      console.log("role:", response.data.listRoles[0].roleName);
      setAvatar(response.data.avatar);
      setRole(response.data.listRoles[0].roleName);
      
    } catch (error) {
      console.error('Error fetching user avatar:', error);
    }
  };

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

  const isBlurred = isLoginModalOpen || isSignUpModalOpen;

  return (
    <MainLayout
      isBlurred={isBlurred}
      onOpenLoginModal={handleOpenLoginModal}
      onOpenSignUpModal={handleOpenSignUpModal}
    >
      <AdvertBanner />
      <br></br>
      <CardListPro/>
      <br></br>
      <CardList/>
      <br></br>
      <CardListVideo />
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
    </MainLayout>
  );
}
