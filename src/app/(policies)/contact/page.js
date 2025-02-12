import PolicyLayout from '../components/PolicyLayout';

export default function ContactPage() {
  return (
    <PolicyLayout title="Contact Us">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-playfair font-bold mb-4">Get in Touch</h2>
          <p className="text-neutral-600">
            We&apos;re here to help! If you have any questions, concerns, or feedback, please don&apos;t hesitate to reach out to us.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Contact Information</h3>
          
          <div className="bg-neutral-50 p-6 rounded-xl space-y-4">
            <div>
              <h4 className="font-semibold">Email</h4>
              <p className="text-neutral-600">festique.live@gmail.com</p>
            </div>

            <div>
              <h4 className="font-semibold">Operating Hours</h4>
              <p className="text-neutral-600">Monday to Friday: 9:00 AM - 6:00 PM IST</p>
              <p className="text-neutral-600">Saturday: 10:00 AM - 2:00 PM IST</p>
              <p className="text-neutral-600">Sunday: Closed</p>
            </div>

            <div>
              <h4 className="font-semibold">Address</h4>
              <p className="text-neutral-600">
                Uttrahalli<br />
                100 Feet Road<br />
                Bangalore<br />
                Karnataka - 560061<br />
                India
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Support Categories</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-neutral-50 p-4 rounded-xl">
              <h4 className="font-semibold mb-2">Event Registration Support</h4>
              <p className="text-sm text-neutral-600">For issues related to event registration, tickets, or refunds</p>
            </div>
            
            <div className="bg-neutral-50 p-4 rounded-xl">
              <h4 className="font-semibold mb-2">Event Organizer Support</h4>
              <p className="text-sm text-neutral-600">For organizers needing assistance with event creation or management</p>
            </div>
            
            <div className="bg-neutral-50 p-4 rounded-xl">
              <h4 className="font-semibold mb-2">Technical Support</h4>
              <p className="text-sm text-neutral-600">For website-related technical issues or account problems</p>
            </div>
            
            <div className="bg-neutral-50 p-4 rounded-xl">
              <h4 className="font-semibold mb-2">Business Inquiries</h4>
              <p className="text-sm text-neutral-600">For partnership opportunities and business-related queries</p>
            </div>
          </div>
        </section>

        <section>
          <p className="text-sm text-neutral-500">
            We aim to respond to all inquiries within 24-48 business hours. For urgent matters related to an upcoming event, 
            please mention &quot;URGENT&quot; in your email subject line.
          </p>
        </section>
      </div>
    </PolicyLayout>
  );
}
