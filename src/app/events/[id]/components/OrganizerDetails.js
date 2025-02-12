import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';

export default function OrganizerDetails({ organizerDetails }) {
  const { 
    name, 
    logo, 
    description, 
    contact 
  } = organizerDetails;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <div className="flex items-center space-x-4">
        {logo && (
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image 
              src={logo} 
              alt={`${name} logo`} 
              fill 
              className="object-cover"
            />
          </div>
        )}
        <div>
          <h3 className="font-playfair text-2xl font-bold text-neutral-900">
            {name}
          </h3>
          <p className="font-montserrat text-neutral-600">
            Event Organizer
          </p>
        </div>
      </div>

      {description && (
        <p className="font-montserrat text-neutral-700 leading-relaxed">
          {description}
        </p>
      )}

      <div className="space-y-2">
        <h4 className="font-playfair text-lg font-semibold text-neutral-900">
          Contact Information
        </h4>
        <div className="flex items-center space-x-2">
          <Mail className="text-[#FF6B6B]" size={20} />
          <a 
            href={`mailto:${contact.email}`} 
            className="font-montserrat text-neutral-700 hover:text-[#4ECDC4] transition-colors"
          >
            {contact.email}
          </a>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="text-[#FF6B6B]" size={20} />
          <a 
            href={`tel:${contact.phone}`} 
            className="font-montserrat text-neutral-700 hover:text-[#4ECDC4] transition-colors"
          >
            {contact.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
