import "./App.css";
import "./assets/css/sidebar.css"
import React from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import { NavBar, SideBar } from "./components/navbar";
import { Footer } from "./components/footer";
import Coursel from "./components/slide/Coursel";
import CardList from "./components/course/CardList";
import CardListPro from "./components/course/CardListPro";
import { SignIn, SignUp } from './components/sign-in';
import './assets/css/responsive.css'
import CardDetail from "./components/detail/CardDetail";

const MyRouter = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <div>
      <NavBar />
      <div className="row">
        <div className="col-1">
        {showSidebar && ( 
          <div className="col-1">
            <SideBar />
          </div>
        )}
        </div>
        <div className="col-11">
          <Routes>
            <Route path="/login" element={<SignIn />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/card-detail" element={<CardDetail/>} />
            <Route path="/" element={ 
              <>
                <Coursel />
                <CardListPro />
                <CardList />
              </>
            } />
            {/* Optional: 404 route */}
            <Route path="*" element={<div>Not Found (404)</div>} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
};



function App() {



  
  return (
    <BrowserRouter>
       <MyRouter />
    </BrowserRouter>
  );
}

export default App;
