import { Image } from "react-bootstrap";
import "./Landing.css";
import { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import Footer from "./Footer";
import Stats from "./Stat";
import FAQ from "./FAQ"; 
import FeedbackLanding from "./FeedbackLanding";
function LandingPage() {
    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    return (
        <div className="header">
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="nav-left">
                    <h2 className="logo">ComplainX</h2>
                </div>

                <div className="nav-right">
                    <a href="/" className="nav-link">Home</a>
                    <button
                        className="nav-link"
                        onClick={() => setShowLogin(true)}
                    >
                        Login
                    </button>

                    <button
                        className="signup-btn"
                        onClick={() => setShowSignup(true)}
                    >
                        Signup
                    </button>
                </div>
            </nav>

          
            <div className="into-div">
                <div className="text-section">
                    <h1 className="into-stat">
                        Welcome to the Resolve it{" "}
                        <span className="grievance">Grievances and </span>
                        Feedback system
                    </h1>

                    <p>
                        One solution for all your Grievances related issues and Feedback
                        Management System
                    </p>
                </div>

          
                <Image src="/grievances.jpg" alt="Landing" fluid />
            </div>
             <div>
                <Stats />
            </div>
             
             <div>
                <FAQ />
            </div>
            <div>
                <FeedbackLanding />
            </div>
            <div>
                <Footer />
            </div>

            {/* SIGNUP MODAL */}
            {showSignup && (
                <div className="modal-overlays" onClick={() => setShowSignup(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btns" onClick={() => setShowSignup(false)}>
                            ✖
                        </button>

                        <Signup />
                    </div>
                </div>
            )}
            {showLogin && (
                <div className="modal-overlay-login" onClick={() => setShowLogin(false)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn-login" onClick={() => setShowLogin(false)}>
                            ✖
                        </button>

                        <Login />
                    </div>
                </div>
            )}
           

        </div>
    );
}

export default LandingPage;
