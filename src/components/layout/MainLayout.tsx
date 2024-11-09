import React from "react";
import { NavBar } from "../navbar/NavBar";
import Footer from "../footer/Footer";
import "../../assets/css/modal.css";
import SideBar from "../sidebar/SideBar";


interface MainLayoutProps {
  children: React.ReactNode;
  isBlurred?: boolean;
  onOpenLoginModal: () => void;
  onOpenSignUpModal: () => void;
  // avatar: string | null;
  // role: string | null;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isBlurred = false,
  onOpenLoginModal,
  onOpenSignUpModal,
  // avatar,
  // role,
}) => {
  return (
    <div className={`main-layout ${isBlurred ? "blur-background" : ""}`}>
      <NavBar
        onOpenLoginModal={onOpenLoginModal}
        onOpenSignUpModal={onOpenSignUpModal}
        // avatar={avatar || ""}
        // role={role || ""}
      />
      <div className="content-wrapper">
        <aside className="sidebar">
          <SideBar />
        </aside>
        <main className="main-content">{children}</main>
      </div>
      <Footer />
    </div>
  );
};
export default MainLayout;
