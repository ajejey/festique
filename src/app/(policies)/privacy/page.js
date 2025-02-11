import PolicyLayout from '../components/PolicyLayout';

export default function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy Policy">
      <h2 className="text-xl md:text-xl text-neutral-900 my-4">1. Information We Collect</h2>
      <p>
        We collect information that you provide directly to us, including:
      </p>
      <ul>
        <li>Name, email address, and contact information</li>
        <li>Event preferences and registration details</li>
        <li>Payment information (processed securely through Razorpay)</li>
        <li>Device and usage information when you access our website</li>
      </ul>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">2. How We Use Your Information</h2>
      <p>
        We use the collected information to:
      </p>
      <ul>
        <li>Process your event registrations and payments</li>
        <li>Send you important updates about events</li>
        <li>Improve our services and user experience</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">3. Information Sharing</h2>
      <p>
        We share your information only with:
      </p>
      <ul>
        <li>Event organizers (limited to registration details)</li>
        <li>Payment processors (Razorpay)</li>
        <li>Service providers who assist in our operations</li>
        <li>Legal authorities when required by law</li>
      </ul>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">4. Data Security</h2>
      <p>
        We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.
      </p>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">5. Cookies and Tracking</h2>
      <p>
        We use cookies and similar technologies to enhance your browsing experience and analyze website usage.
      </p>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">6. Your Rights</h2>
      <p>
        You have the right to:
      </p>
      <ul>
        <li>Access your personal information</li>
        <li>Correct inaccurate information</li>
        <li>Request deletion of your information</li>
        <li>Opt-out of marketing communications</li>
      </ul>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">7. Contact Us</h2>
      <p>
        For privacy-related inquiries, please contact us at festique.live@gmail.com
      </p>
    </PolicyLayout>
  );
}
