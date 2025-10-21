import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page-container">
      <div className="legal-page-content">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: October 19, 2025</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the LOTO (Lockout/Tagout) Management System ("System") 
            developed for PepsiCo, you agree to be bound by these Terms of Service. If you do not 
            agree to these terms, you must not use this System.
          </p>
          <p>
            These terms constitute a legally binding agreement between you (the "User") and 
            the organization regarding your use of the LOTO Management System.
          </p>
        </section>

        <section>
          <h2>2. Authorized Use</h2>
          <h3>2.1 Access Authorization</h3>
          <ul>
            <li>Access to this System is restricted to authorized employees and contractors</li>
            <li>You must use only your assigned credentials and never share your password</li>
            <li>Unauthorized access or attempted access is strictly prohibited and may result in legal action</li>
            <li>Your access level is determined by your role: Technician, Supervisor, or Administrator</li>
          </ul>

          <h3>2.2 Purpose of Use</h3>
          <p>
            This System is designed exclusively for:
          </p>
          <ul>
            <li>Creating and managing lockout/tagout procedures</li>
            <li>Ensuring workplace safety and regulatory compliance</li>
            <li>Maintaining accurate records of energy isolation procedures</li>
            <li>Facilitating safe equipment maintenance and repair</li>
          </ul>
        </section>

        <section>
          <h2>3. User Responsibilities</h2>
          <h3>3.1 Account Security</h3>
          <p>You are responsible for:</p>
          <ul>
            <li>Maintaining the confidentiality of your login credentials</li>
            <li>All activities that occur under your account</li>
            <li>Immediately notifying your supervisor of any unauthorized use</li>
            <li>Logging out when leaving your workstation unattended</li>
          </ul>

          <h3>3.2 Accurate Information</h3>
          <p>You must:</p>
          <ul>
            <li>Provide accurate and complete information when creating LOTO procedures</li>
            <li>Verify all energy isolation points before marking as complete</li>
            <li>Update procedures promptly when conditions change</li>
            <li>Report any system errors or safety concerns immediately</li>
          </ul>

          <h3>3.3 Safety Compliance</h3>
          <p>
            <strong>CRITICAL SAFETY REQUIREMENT:</strong> This System is a tool to support LOTO procedures 
            but does NOT replace physical lockout/tagout devices, safety training, or compliance with 
            OSHA standards (29 CFR 1910.147). You must always follow physical safety procedures 
            in addition to system documentation.
          </p>
        </section>

        <section>
          <h2>4. Prohibited Activities</h2>
          <p>Users must NOT:</p>
          <ul>
            <li>Share, transfer, or sell access credentials</li>
            <li>Attempt to bypass security measures or access unauthorized areas</li>
            <li>Modify, reverse engineer, or decompile the System</li>
            <li>Use automated tools to extract data without authorization</li>
            <li>Create false or fraudulent LOTO records</li>
            <li>Interfere with system operation or other users' access</li>
            <li>Use the System for any purpose other than workplace safety management</li>
            <li>Download or export data without proper authorization</li>
          </ul>
        </section>

        <section>
          <h2>5. Data and Privacy</h2>
          <h3>5.1 Information Collection</h3>
          <p>
            By using this System, you consent to the collection and processing of your information 
            as described in our <a href="/privacy-policy">Privacy Policy</a>.
          </p>

          <h3>5.2 Audit Trail</h3>
          <p>
            All actions within the System are logged for safety, compliance, and audit purposes. 
            This includes but is not limited to:
          </p>
          <ul>
            <li>Login/logout activities</li>
            <li>LOTO procedure creation, modification, and completion</li>
            <li>Equipment access and energy isolation records</li>
            <li>Data exports and report generation</li>
          </ul>

          <h3>5.3 Data Ownership</h3>
          <p>
            All data entered into the System is the property of the organization. You retain no ownership 
            rights to LOTO records or system data upon termination of employment or access.
          </p>
        </section>

        <section>
          <h2>6. System Availability</h2>
          <h3>6.1 Service Continuity</h3>
          <p>
            While we strive to maintain continuous system availability, we do not guarantee 
            uninterrupted access. The System may be temporarily unavailable due to:
          </p>
          <ul>
            <li>Scheduled maintenance and updates</li>
            <li>Emergency repairs or security patches</li>
            <li>Network or infrastructure issues</li>
            <li>Force majeure events</li>
          </ul>

          <h3>6.2 Backup Procedures</h3>
          <p>
            In case of system unavailability, you must follow your facility's backup LOTO 
            procedures using paper-based documentation as required by OSHA regulations.
          </p>
        </section>

        <section>
          <h2>7. Intellectual Property</h2>
          <p>
            The LOTO Management System, including all software, design, content, and documentation, 
            is protected by copyright and intellectual property laws. The system was developed by 
            Abdulmajeed Alrashidi for use by the organization.
          </p>
          <p>
            You are granted a limited, non-exclusive, non-transferable license to use the System 
            solely for authorized business purposes.
          </p>
        </section>

        <section>
          <h2>8. Disclaimer of Warranties</h2>
          <p>
            THE SYSTEM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. 
            We do not warrant that:
          </p>
          <ul>
            <li>The System will be error-free or uninterrupted</li>
            <li>Defects will be corrected immediately</li>
            <li>The System is free from viruses or harmful components</li>
            <li>Results obtained from the System will be accurate or reliable</li>
          </ul>
          <p>
            <strong>SAFETY NOTICE:</strong> This System is a documentation and management tool. 
            It does not replace physical safety devices, training, or compliance with safety regulations. 
            Users must always follow proper lockout/tagout procedures and OSHA requirements.
          </p>
        </section>

        <section>
          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, the organization and the system developers shall not 
            be liable for:
          </p>
          <ul>
            <li>Any injuries or accidents resulting from improper LOTO procedures</li>
            <li>Indirect, incidental, or consequential damages</li>
            <li>Loss of data, profits, or business opportunities</li>
            <li>Damages resulting from system unavailability or errors</li>
          </ul>
          <p>
            Users are solely responsible for ensuring compliance with all applicable safety 
            regulations and procedures.
          </p>
        </section>

        <section>
          <h2>10. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless the organization, its affiliates, and the system 
            developers from any claims, damages, or expenses arising from:
          </p>
          <ul>
            <li>Your violation of these Terms of Service</li>
            <li>Your violation of safety regulations or procedures</li>
            <li>Unauthorized use of the System</li>
            <li>Your negligence or willful misconduct</li>
          </ul>
        </section>

        <section>
          <h2>11. Termination</h2>
          <h3>11.1 Termination by Organization</h3>
          <p>
            The organization reserves the right to suspend or terminate your access immediately, without notice, for:
          </p>
          <ul>
            <li>Violation of these Terms of Service</li>
            <li>Termination of employment or contract</li>
            <li>Security concerns or suspicious activity</li>
            <li>Extended periods of inactivity</li>
          </ul>

          <h3>11.2 Effect of Termination</h3>
          <p>
            Upon termination:
          </p>
          <ul>
            <li>Your access to the System will be immediately revoked</li>
            <li>You must cease all use of the System</li>
            <li>Audit records and LOTO history will be retained per regulatory requirements</li>
            <li>These Terms of Service will continue to apply to past activities</li>
          </ul>
        </section>

        <section>
          <h2>12. Regulatory Compliance</h2>
          <p>
            This System is designed to support compliance with:
          </p>
          <ul>
            <li>OSHA Lockout/Tagout Standard (29 CFR 1910.147)</li>
            <li>NFPA 70E - Electrical Safety in the Workplace</li>
            <li>Industry safety standards and best practices</li>
            <li>Local and state safety regulations</li>
          </ul>
          <p>
            You are responsible for ensuring your activities comply with all applicable laws, 
            regulations, and company policies.
          </p>
        </section>

        <section>
          <h2>13. Modifications to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Users will be 
            notified of significant changes through:
          </p>
          <ul>
            <li>Email notifications to registered users</li>
            <li>System announcements upon login</li>
            <li>Updated "Last Modified" date on this page</li>
          </ul>
          <p>
            Continued use of the System after changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2>14. Governing Law</h2>
          <p>
            These Terms of Service are governed by the laws of the jurisdiction where the 
            facility is located, without regard to conflict of law provisions.
          </p>
        </section>

        <section>
          <h2>15. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, that provision 
            will be limited or eliminated to the minimum extent necessary, and the remaining 
            provisions will remain in full force and effect.
          </p>
        </section>

        <section>
          <h2>16. Contact Information</h2>
          <p>
            For questions about these Terms of Service, contact:
          </p>
          <div className="contact-info">
            <p><strong>System Developer & Support</strong></p>
            <p>Abdulmajeed Alrashidi</p>
            <p>Email: <a href="mailto:alrashabdulmajeed@gmail.com">alrashabdulmajeed@gmail.com</a></p>
            <p>LinkedIn: <a href="https://linkedin.com/in/mjeed01" target="_blank" rel="noopener noreferrer">linkedin.com/in/mjeed01</a></p>
            <p>GitHub: <a href="https://github.com/Mjeed42" target="_blank" rel="noopener noreferrer">github.com/Mjeed42</a></p>
          </div>
        </section>

        <section className="acknowledgment-section">
          <h2>17. User Acknowledgment</h2>
          <p className="important-notice">
            <strong>IMPORTANT:</strong> By using this System, you acknowledge that you have read, 
            understood, and agree to be bound by these Terms of Service and the Privacy Policy. 
            You further acknowledge that:
          </p>
          <ul>
            <li>This System is a tool to support, not replace, physical LOTO procedures</li>
            <li>You are responsible for following all safety regulations and training</li>
            <li>Proper lockout/tagout procedures are critical for preventing serious injury or death</li>
            <li>You will immediately report any system errors or safety concerns</li>
          </ul>
        </section>

        <div className="policy-footer">
          <p>© 2025 - LOTO Management System</p>
          <p>Developed by Abdulmajeed Alrashidi for PepsiCo</p>
          <p>These terms apply exclusively to this LOTO Management System</p>
          <p className="safety-reminder">
            <strong>Remember: Safety First. Always follow proper lockout/tagout procedures.</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

