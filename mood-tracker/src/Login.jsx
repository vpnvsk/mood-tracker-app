import React, { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Logged in with Google!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignIn) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in!");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created!");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="text-center mb-4">Welcome to MoodTracker</h2>

        <div className="tabs">
          <button
            className={`tab ${isSignIn ? "active" : ""}`}
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </button>
          <button
            className={`tab ${!isSignIn ? "active" : ""}`}
            onClick={() => setIsSignIn(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <label className="form-label">Email address</label>
          <input
            className="form-control mb-3"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="form-label">Password</label>
          <input
            className="form-control mb-4"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn btn-primary w-100 mb-3" type="submit">
            {isSignIn ? "Log In" : "Register"}
          </button>
        </form>

        <div className="divider">
          <span>Or</span>
        </div>

        <button className="btn btn-outline-danger w-100 mb-2" onClick={googleLogin}>
          Continue with Google
        </button>

        <footer className="text-center mt-4 small-text">
          © MoodTracker 2025
        </footer>
      </div>

      <style jsx="true">{`
        .auth-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f1f3f6;
          padding: 20px;
        }

        .auth-card {
          background: #fff;
          border-radius: 20px;
          padding: 30px 20px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }

        .tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
        }

        .tab {
          background: none;
          border: none;
          font-weight: bold;
          font-size: 16px;
          padding: 10px 20px;
          cursor: pointer;
          color: #888;
          border-bottom: 2px solid transparent;
          transition: 0.3s;
        }

        .tab.active {
          color: #333;
          border-color: #4a69bd;
        }

        .form-label {
          font-size: 14px;
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }

        .form-control {
          border-radius: 10px;
          padding: 10px 15px;
          border: 1px solid #ccc;
        }

        .btn-primary {
          background-color: #4a69bd;
          border: none;
          border-radius: 12px;
          padding: 10px;
          font-weight: bold;
        }

        .btn-outline-danger {
          border-radius: 12px;
          padding: 10px;
          font-weight: bold;
        }

        .divider {
          text-align: center;
          margin: 20px 0;
          position: relative;
        }

        .divider span {
          background: #fff;
          padding: 0 10px;
          color: #888;
        }

        .divider::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #ccc;
          z-index: -1;
        }

        .small-text {
          font-size: 12px;
          color: #aaa;
        }

        @media (max-width: 576px) {
          .auth-card {
            padding: 25px 15px;
            border-radius: 15px;
          }
        }
      `}</style>
    </div>
  );
}

export default AuthPage;
