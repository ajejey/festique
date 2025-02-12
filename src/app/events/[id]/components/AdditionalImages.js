import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

export default function AdditionalImages({ images }) {
  if (!images || images.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl shadow-lg p-2 md:p-6">
      <div className="flex items-center mb-4">
        <ImageIcon className="text-[#4ECDC4] mr-3" size={24} />
        <h2 className="font-playfair text-2xl font-bold text-neutral-900">
          Event Gallery
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((imageUrl, index) => (
          <div 
            key={index} 
            className="relative aspect-square rounded-xl overflow-hidden group"
          >
            <Image 
              src={imageUrl} 
              alt={`Event gallery image ${index + 1}`} 
              fill 
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
