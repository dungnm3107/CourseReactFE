import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse , faNewspaper, faPen, faPlus, faRoad } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
export default function SideBar() {
    const [activeBox, setActiveBox] = useState<number | null>(null); 

    const handleClick = (index: number) => {
        setActiveBox(activeBox === index ? null : index);
    };

    const toggleDropdown = (index:any) => {
        setActiveBox(activeBox === index ? null : index);
      };

    console.log(activeBox);
    
  return (
    <>
    <div style={{ display: 'flex', flexDirection: "column", alignItems: "center" , marginTop:"10px"}}>
    <div 
      className={`box cicler ${activeBox === 0 ? 'active' : ''} dropdown`}
      onClick={() => toggleDropdown(0)}
    >
      <FontAwesomeIcon 
        style={{ 
            fontSize: "32px", 
            color: "black",
            transition: 'transform 0.3s ease',
            ...(activeBox === 0 && { transform: 'rotate(135deg)' })
          }} 
        icon={ faPlus} 
      />

      {activeBox === 0 && (
        <ul className="dropdown-menu show d-flex align-items-center" style={{height:"60px"}}> 
          <li className="w-100 h-100 d-flex align-items-center ">
            <Link  className="dropdown-item " to={"/blog"}>
            <FontAwesomeIcon icon={faPen} />
              <Link className="mx-3" to={"blog"}>Viết Blog</Link>
            </Link>
          </li>
        </ul>
      )}
    </div>

      <div 
        className={`box ${activeBox === 1 ? 'active' : ''}`}
        onClick={() => handleClick(1)}
      >
        <FontAwesomeIcon style={{ fontSize: "32px", color: "black" }} icon={faHouse} />
        <a href="">Trang chủ</a>
      </div>

      <div 
        className={`box ${activeBox === 2 ? 'active' : ''}`}
        onClick={() => handleClick(2)}
      >
        <FontAwesomeIcon style={{ fontSize: "32px", color: "black" }} icon={faRoad} />
        <a href="">Lộ Trình</a>
      </div>
      <div 
        className={`box ${activeBox === 3 ? 'active' : ''}`}
        onClick={() => handleClick(3)}
      >
        <FontAwesomeIcon style={{ fontSize: "32px", color: "black" }} icon={faNewspaper} />
        <a href="">Bài Viết</a>
      </div>

    </div>
    </>
  );
}
