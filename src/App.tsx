import AppRouter from "./navigation/AppRouter";
import { AuthProvider } from "./service/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./constants/Constants";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <div className="App">
          <AppRouter />
        </div>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
