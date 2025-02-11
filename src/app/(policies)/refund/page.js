import PolicyLayout from '../components/PolicyLayout';

export default function RefundPage() {
  return (
    <PolicyLayout title="Refund & Cancellation Policy">
      <h2 className="text-xl md:text-xl text-neutral-900 my-4">1. Ticket Refunds</h2>
      <p>
        Our refund policy is handled on a case-by-case basis, taking into consideration various factors:
      </p>
      <ul>
        <li>Timing of the refund request relative to the event date</li>
        <li>Reason for the refund request</li>
        <li>Event-specific policies set by organizers</li>
      </ul>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">2. Event Cancellation by Organizer</h2>
      <p>
        If an event is cancelled by the organizer:
      </p>
      <ul>
        <li>Full refund will be processed automatically</li>
        <li>Refund will be credited to the original payment method</li>
        <li>Processing time: 5-7 business days</li>
      </ul>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">3. Event Rescheduling</h2>
      <p>
        If an event is rescheduled:
      </p>
      <ul>
        <li>Your tickets remain valid for the new date</li>
        <li>You may request a refund if the new date doesn&apos;t work for you</li>
        <li>Refund requests must be made within 7 days of rescheduling announcement</li>
      </ul>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">4. Refund Process</h2>
      <p>
        To request a refund:
      </p>
      <ul>
        <li>Log into your Festique account</li>
        <li>Navigate to your tickets</li>
        <li>Select the ticket and click &quot;Request Refund&quot;</li>
        <li>Follow the prompts to complete your request</li>
      </ul>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">5. Processing Time</h2>
      <p>
        Refund processing times:
      </p>
      <ul>
        <li>Approval/rejection notification: Within 48 hours</li>
        <li>Credit card refunds: 5-7 business days</li>
        <li>UPI/bank transfer: 3-5 business days</li>
      </ul>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">6. Non-Refundable Items</h2>
      <p>
        The following charges are non-refundable:
      </p>
      <ul>
        <li>Convenience fees</li>
        <li>Processing fees</li>
        <li>Additional services or merchandise purchased</li>
      </ul>

      <h2 className="text-xl md:text-xl text-neutral-900 my-4">7. Contact Information</h2>
      <p>
        For refund-related queries, please contact us at festique.live@gmail.com
      </p>
    </PolicyLayout>
  );
}
