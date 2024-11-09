import AppRouter from "./navigation/AppRouter";
import { AuthProvider } from "./service/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./constants/Constants";
import ReactGA from 'react-ga4';
import React from 'react';  

const MEASUREMENT_ID = "G-TP6DLB1V9Q";

function App() {
  ReactGA.initialize([
    {
      trackingId: MEASUREMENT_ID
    }
  ])

  React.useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname
    })
  }, [])

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
