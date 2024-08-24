import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../components/RequireAdmin";

// check token đã hết hạn chưa
export function isTokenExpired(token: string) {
  const decodedToke = jwtDecode(token);
  if (!decodedToke.exp) {
    return false;
  }
  const currentTime = Date.now() / 1000;
  return currentTime < decodedToke.exp;
}

// lấy thông tin token
export function isToken(){
    const token = localStorage.getItem("token");
    if(token){
        return true;
    }
    return false;
}

export function getAvatarByToken(){
    const token = localStorage.getItem("token");
    if(token){
        const decodedToken = jwtDecode(token) as JwtPayload;
        return decodedToken.avatar;
    }
}

export function getUsernameByToken() {
    const token = localStorage.getItem('token');
    if (token) {
       return jwtDecode(token).sub;
    }
 }

 export function getIdUserByToken() {
    const token = localStorage.getItem('token');
    if (token) {
       const decodedToken = jwtDecode(token) as JwtPayload;
       return decodedToken.id;
    }
 }

 export function getRoleByToken() {
    const token = localStorage.getItem('token');
    if (token) {
       const decodedToken = jwtDecode(token) as JwtPayload;
       return decodedToken.role;
    }
}


export function logout(navigate: any) {
    navigate("/login");
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
 }
