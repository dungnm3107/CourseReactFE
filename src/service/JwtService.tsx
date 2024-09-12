import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "./RequireAdmin";

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
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token) as JwtPayload;
        return decodedToken.id;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
    return null;
  }

 export function getRoleByToken() {
    const token = localStorage.getItem('token');
    if (token) {
       const decodedToken = jwtDecode(token) as JwtPayload;
       return decodedToken.role;
    }
}


