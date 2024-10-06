import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Avatar } from '@mui/material';
import '../../assets/css/profile.css';
import imgbg from '../../assets/images/profile.jpg';
import axiosInstance from '../../config/axios';
import { isToken } from '../../service/JwtService';
import { useAuth } from '../../service/AuthContext';


const Profile: React.FC = () => {
  const [userData, setUserData] = useState({ fullName: '', avatar: '', role: '' });
  const { isLoggedIn, checkLoginStatus } = useAuth();
  const navigate = useNavigate();

  const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/user/profile`,{
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUserData({
          fullName: response.data.fullName,
          avatar: response.data.avatar,
          role: response.data.listRoles[0].roleName
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
  };

  useEffect(() => {
    checkLoginStatus();
    if (isToken()) {
      fetchUserData();
    } else {
      navigate('/login');
    }
  }, [navigate, checkLoginStatus]);

  if (!isLoggedIn) {
    return null; // or a loading spinner
  }
  return (
    <MainLayout onOpenLoginModal={() => {}} onOpenSignUpModal={() => {}} avatar={userData.avatar} role={userData.role}>
      <Container fluid className="p-0">
        <div className="profile-cover position-relative">
          <img 
            src={imgbg} 
            alt="Cover" 
            className="img-fluid w-100" 
            style={{ height: '350px', objectFit: 'cover' }} 
          />
          <div className="position-absolute d-flex align-items-center" style={{ left: '20px', bottom:'10px' }}> 
            <Avatar
              src={userData.avatar || "/path/to/default/avatar.jpg"}
              sx={{ width: 80, height: 80, border: '3px solid white' }}
            />
         <h2 className="ms-3 mb-0" style={{ color: 'black', marginTop: '40px' }}>{userData.fullName}</h2> 
          </div>
        </div>
        <Container>
          <Row>
            <Col md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <h5>Giới thiệu</h5>
                  <p>
                    <i className="fas fa-user-friends me-2"></i>
                    Thành viên của course IT
                  </p>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <h5>Hoạt động gần đây</h5>
                  <p>Chưa có hoạt động gần đây</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={8}>
              <Card>
                <Card.Body>
                  <h5>Các khóa học đã tham gia</h5>
             
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>
    </MainLayout>
  );
};

export default Profile;