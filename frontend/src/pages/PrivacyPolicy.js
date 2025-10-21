import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page-container">
      <div className="legal-page-content">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: October 19, 2025</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            This Privacy Policy governs the collection, use, and protection of personal information 
            in the LOTO (Lockout/Tagout) Management System ("System") developed for PepsiCo. 
            This system is committed to protecting your privacy and ensuring the security of your personal information.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <h3>2.1 User Account Information</h3>
          <ul>
            <li>Full name and employee ID</li>
            <li>Email address</li>
            <li>Username and encrypted password</li>
            <li>Role and department information</li>
            <li>Contact details</li>
          </ul>

          <h3>2.2 LOTO Activity Data</h3>
          <ul>
            <li>LOTO procedure creation, updates, and completion records</li>
            <li>Equipment and location information</li>
            <li>Energy isolation points and types</li>
            <li>Timestamps of all safety-related activities</li>
            <li>Handover and verification records</li>
            <li>Digital signatures and authorizations</li>
          </ul>

          <h3>2.3 System Usage Information</h3>
          <ul>
            <li>Login/logout times and session data</li>
            <li>IP addresses and device information</li>
            <li>Browser type and operating system</li>
            <li>Navigation patterns within the System</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use your information for the following purposes:</p>
          <ul>
            <li><strong>Safety Compliance:</strong> To ensure proper execution of lockout/tagout procedures and maintain workplace safety</li>
            <li><strong>Authentication:</strong> To verify user identity and manage access permissions</li>
            <li><strong>Record Keeping:</strong> To maintain audit trails for regulatory compliance (OSHA, local safety regulations)</li>
            <li><strong>Communication:</strong> To send notifications about LOTO procedures, handovers, and system updates</li>
            <li><strong>System Improvement:</strong> To analyze usage patterns and improve system functionality</li>
            <li><strong>Reporting:</strong> To generate safety reports and analytics for management</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>We implement industry-standard security measures to protect your information:</p>
          <ul>
            <li>End-to-end encryption for data transmission (HTTPS/TLS)</li>
            <li>Encrypted password storage using bcrypt hashing</li>
            <li>Role-based access control (RBAC)</li>
            <li>Regular security audits and updates</li>
            <li>Secure database storage with access logging</li>
            <li>Session management with automatic timeout</li>
          </ul>
        </section>

        <section>
          <h2>5. Data Sharing and Disclosure</h2>
          <h3>5.1 Internal Sharing</h3>
          <p>
            Your information may be shared within the organization for:
          </p>
          <ul>
            <li>Safety oversight and compliance monitoring</li>
            <li>Internal audits and investigations</li>
            <li>Training and quality improvement purposes</li>
          </ul>

          <h3>5.2 Legal Requirements</h3>
          <p>
            Information may be disclosed when required by law, including:
          </p>
          <ul>
            <li>OSHA inspections and regulatory compliance</li>
            <li>Legal proceedings or government requests</li>
            <li>Emergency situations affecting safety</li>
          </ul>

          <h3>5.3 Third Parties</h3>
          <p>
            Personal information is not sold or shared with third parties for marketing purposes. 
            Limited information may be shared with authorized service providers under strict confidentiality agreements.
          </p>
        </section>

        <section>
          <h2>6. Data Retention</h2>
          <p>
            We retain your information for as long as necessary to:
          </p>
          <ul>
            <li>Maintain your active user account</li>
            <li>Comply with legal and regulatory requirements (minimum 5 years for LOTO records)</li>
            <li>Resolve disputes and enforce agreements</li>
          </ul>
          <p>
            After retention periods expire, data will be securely deleted or anonymized.
          </p>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal information</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your data (subject to legal retention requirements)</li>
            <li><strong>Export:</strong> Receive your data in a portable format</li>
            <li><strong>Object:</strong> Object to certain processing activities</li>
          </ul>
          <p>
            To exercise these rights, contact your system administrator or email: 
            <a href="mailto:alrashabdulmajeed@gmail.com"> alrashabdulmajeed@gmail.com</a>
          </p>
        </section>

        <section>
          <h2>8. Cookies and Tracking</h2>
          <p>
            The System uses essential cookies for:
          </p>
          <ul>
            <li>Session management and authentication</li>
            <li>Remembering user preferences and language settings</li>
            <li>Security and fraud prevention</li>
          </ul>
          <p>
            You can control cookie settings through your browser, but disabling essential cookies 
            may affect system functionality.
          </p>
        </section>

        <section>
          <h2>9. Children's Privacy</h2>
          <p>
            This System is intended for use by authorized personnel only. 
            We do not knowingly collect information from individuals under 18 years of age.
          </p>
        </section>

        <section>
          <h2>10. International Data Transfers</h2>
          <p>
            Your information may be stored and processed in servers located in different countries. 
            We ensure that appropriate safeguards are in place to protect your data during international transfers, 
            in compliance with applicable data protection laws.
          </p>
        </section>

        <section>
          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. We will notify users of significant changes 
            through the System or via email. Continued use of the System after changes constitutes 
            acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2>12. Contact Information</h2>
          <p>
            For questions about this Privacy Policy or data protection practices, contact:
          </p>
          <div className="contact-info">
            <p><strong>System Developer & Support</strong></p>
            <p>Abdulmajeed Alrashidi</p>
            <p>Email: <a href="mailto:alrashabdulmajeed@gmail.com">alrashabdulmajeed@gmail.com</a></p>
            <p>LinkedIn: <a href="https://linkedin.com/in/mjeed01" target="_blank" rel="noopener noreferrer">linkedin.com/in/mjeed01</a></p>
            <p>GitHub: <a href="https://github.com/Mjeed42" target="_blank" rel="noopener noreferrer">github.com/Mjeed42</a></p>
          </div>
        </section>

        <section>
          <h2>13. Compliance</h2>
          <p>
            This Privacy Policy is designed to comply with:
          </p>
          <ul>
            <li>OSHA recordkeeping requirements (29 CFR 1910.147)</li>
            <li>General Data Protection Regulation (GDPR) where applicable</li>
            <li>California Consumer Privacy Act (CCPA) where applicable</li>
            <li>Industry best practices for data protection</li>
          </ul>
        </section>

        <div className="policy-footer">
          <p>© 2025 - LOTO Management System</p>
          <p>Developed by Abdulmajeed Alrashidi for PepsiCo</p>
          <p>This policy applies exclusively to this LOTO Management System</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

