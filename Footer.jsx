import "./Landing.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

       
        <div className="footer-section">
          <h2 className="footer-logo">ComplaintsX</h2>
          <p className="footer-text">
            Smart Grievance & Feedback Management System.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/complaints">Complaints</a></li>
            <li><a href="/status">Status</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h3 className="footer-title">Support</h3>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Terms & Policy</a></li>
            <li><a href="#">Report Issue</a></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ComplaintsX — All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
