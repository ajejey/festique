import PolicyLayout from '../components/PolicyLayout';

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms & Conditions">
      <h2 className="text-xl md:text-xl text-neutral-900 my-4">1. Acceptance of Terms</h2>
      <p>
        By accessing and using festique.live (&quot;the Website&quot;), you accept and agree to be bound by the terms and conditions outlined here.
      </p>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">2. Services Description</h2>
      <p>
        Festique is an online event ticketing platform that enables users to discover, create, and purchase tickets for various events.
      </p>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">3. User Registration and Account</h2>
      <p>
        Users must provide accurate and complete information during registration. You are responsible for maintaining the confidentiality of your account.
      </p>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">4. Event Creation and Ticket Sales</h2>
      <p>
        Event organizers must provide accurate event information and comply with all applicable laws and regulations. Festique reserves the right to remove any event that violates our policies.
      </p>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">5. Payments and Fees</h2>
      <p>
        All payments are processed securely through Razorpay. Ticket prices are set by event organizers, and Festique may charge additional service fees.
      </p>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">6. Intellectual Property</h2>
      <p>
        All content on festique.live is protected by copyright and other intellectual property rights owned by Festique or its licensors.
      </p>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">7. Limitation of Liability</h2>
      <p>
        Festique shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
      </p>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">8. Modifications to Terms</h2>
      <p>
        We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.
      </p>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">9. Governing Law</h2>
      <p>
        These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.
      </p>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">10. Contact Information</h2>
      <p>
        For any questions regarding these terms, please contact us at festique.live@gmail.com
      </p>
    </PolicyLayout>
  );
}
