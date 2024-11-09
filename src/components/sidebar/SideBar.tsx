import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faNewspaper,
  faRoad,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../../assets/css/sidebar.css";
import { useAuth } from '../../service/AuthContext'; 

export default function SideBar() {
  const [activeBox, setActiveBox] = useState<number | null>(null);
  const { isLoggedIn } = useAuth(); 
  const handleClick = (index: number) => {
    setActiveBox(activeBox === index ? null : index);
  };

 
  console.log(activeBox);

  return (
    <div className="sidebar-container">
      <div className="sidebar-content">
        <Link to="/" className="link-box">
          <div
            className={`box ${activeBox === 1 ? "active" : ""}`}
            onClick={() => handleClick(1)}
          >
            <FontAwesomeIcon
              style={{ fontSize: "32px", color: "rgb(64, 64, 64)" }}
              icon={faHouse}
            />
            <a href="">Trang chủ</a>
          </div>
        </Link>

        <Link to="/roadmap" className="link-box">
          <div
            className={`box ${activeBox === 2 ? "active" : ""}`}
            onClick={() => handleClick(2)}
          >
            <FontAwesomeIcon
              style={{ fontSize: "32px", color: "rgb(64, 64, 64)" }}
              icon={faRoad}
            />
            <a href="">Lộ Trình</a>
          </div>
        </Link>
        {isLoggedIn && (
          <Link to="/favorites">
            <div
              className={`box ${activeBox === 3 ? "active" : ""}`}
              onClick={() => handleClick(3)}
            >
              <FontAwesomeIcon
                style={{ fontSize: "32px", color: "rgb(64, 64, 64)" }}
                icon={faNewspaper}
              />
              <a href="">Yêu thích</a>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
