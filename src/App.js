import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./configuration";
import { onAuthStateChanged } from "firebase/auth";
import SignUp from './Signup';
import SignIn from './Signin';
import HomePage from './HomePage';
import NavBar from "./nav";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("App component rendered");

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser);
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    }, (error) => {
      console.error("Auth state error:", error);
      setLoading(false);
    });

    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("Rendering main content");

  return (
    <Router>
      {user && <NavBar />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <SignIn setUser={setUser} />} />
        <Route path="/signup" element={<SignUp setUser={setUser} />} />
        <Route path="/home" element={user ? <HomePage user={user} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

