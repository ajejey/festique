import Image from 'next/image';
import { MapPin } from 'lucide-react';

export default function FoundersSection() {
  const founders = [
    {
      name: 'Raghavendra',
      role: 'Co-Founder & Event Strategist',
      description: 'Marathon enthusiast with extensive experience in organizing events and supporting non-profit fundraising initiatives.',
      image: '/images/founders/raghavendra.jpg'
    },
    {
      name: 'Ajey',
      role: 'Co-Founder & Product Developer',
      description: 'Passionate technologist dedicated to creating innovative solutions that transform how communities interact and grow.',
      image: '/images/founders/ajey.jpg'
    }
  ];

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="font-playfair text-3xl font-bold text-neutral-900 mb-4">
          Meet the Founders
        </h2>
        <p className="font-montserrat text-neutral-700 max-w-2xl mx-auto">
          Childhood friends from Bangalore, united by a passion for running and technology
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {founders.map((founder, index) => (
          <div 
            key={founder.name} 
            className="bg-neutral-50 p-6 rounded-2xl flex flex-col items-center text-center hover:shadow-lg transition-all duration-300"
          >
            <div className="w-48 h-48 mb-4 relative">
              <Image 
                src={founder.image} 
                alt={founder.name} 
                fill 
                className="rounded-full object-cover"
                priority={index === 0}
              />
            </div>
            <h3 className="font-playfair text-2xl font-bold text-neutral-900 mb-2">
              {founder.name}
            </h3>
            <p className="font-montserrat text-neutral-700 mb-4">
              {founder.role}
            </p>
            <p className="font-montserrat text-neutral-600 italic">
              {founder.description}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center mt-8 flex justify-center items-center">
        <MapPin className="text-[#FF6B6B] mr-2" size={24} />
        <p className="font-montserrat text-neutral-700">
          Founded in Bangalore, India in 2025
        </p>
      </div>
    </section>
  );
}
