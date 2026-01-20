import { useState } from "react";
import "./Landing.css";
import { FiChevronDown, FiChevronUp, FiHelpCircle } from "react-icons/fi";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      q: "What is ResolveIT?",
      a: "ResolveIT is a comprehensive grievance and feedback management system that helps users submit, track, and resolve complaints efficiently through a streamlined digital platform."
    },
    {
      q: "Who can use this platform?",
      a: "The platform is designed for three user roles: Users (to submit complaints), Employees (to process and resolve issues), and Admins (to manage the system and oversee operations). Each role has a dedicated dashboard with appropriate access."
    },
    {
      q: "Can I track my complaint status?",
      a: "Yes, you can track your complaint's progress in real-time. Our system provides a detailed timeline, status updates, and communication logs so you're always informed about your complaint's journey from submission to resolution."
    },
    {
      q: "Is complaint escalation supported?",
      a: "Absolutely. If a complaint remains unresolved beyond our service-level agreement period, it is automatically escalated to higher authorities. You can also manually request escalation through your dashboard."
    },
    {
      q: "How long does it take to resolve complaints?",
      a: "Resolution time varies by complaint category and urgency. High-urgency issues are typically addressed within 24 hours, while standard complaints may take 3-5 business days. You'll receive regular updates throughout the process."
    },
    {
      q: "Is my information secure?",
      a: "Yes, we prioritize your privacy and security. All data is encrypted, and we comply with data protection regulations. You also have the option to submit anonymous complaints."
    },
    {
      q: "Can I attach documents to my complaint?",
      a: "Yes, our system supports file attachments including images, documents, and PDFs. This helps provide better context and faster resolution of your issues."
    },
    {
      q: "How do I follow up on a complaint?",
      a: "You can add comments to your existing complaint tickets, receive email notifications for updates, or contact support through the dedicated follow-up section in your dashboard."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="land-faq-wrapper">
      <div className="land-faq-header">
        <FiHelpCircle className="faq-icon" />
        <h2>Frequently Asked Questions</h2>
        <p className="faq-subtitle">
          Find quick answers to common questions about ResolveIT
        </p>
      </div>

      <div className="land-faq-container">
        {faqs.map((f, i) => (
          <div
            className={`land-faq-item ${activeIndex === i ? 'active' : ''}`}
            key={i}
            onClick={() => toggleFAQ(i)}
          >
            <div className="faq-question">
              <div className="faq-number">{String(i + 1).padStart(2, '0')}</div>
              <h4>{f.q}</h4>
              <div className="faq-toggle">
                {activeIndex === i ? <FiChevronUp /> : <FiChevronDown />}
              </div>
            </div>
            <div className={`faq-answer ${activeIndex === i ? 'show' : ''}`}>
              <p>{f.a}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="faq-footer">
        <p className="faq-support-text">
          Still have questions? <a href="/contact">Contact our support team</a> or
          <a href="/documentation"> visit our documentation</a> for more details.
        </p>
      </div>
    </div>
  );
}

export default FAQ;