import { useNavigate } from "react-router-dom";
import { useAuth } from "../service/AuthContext";

export function useLogout() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    setIsLoggedIn(false);
    navigate('/');
  };

  return logout;
}