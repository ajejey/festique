import { Shirt, PlusCircle, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function TShirtOptions({ tShirtOptions }) {
  console.log("tShirtOptions ", tShirtOptions);
  // Explicitly handle undefined cases
  const includedTshirt = tShirtOptions?.includedTshirt;
  const additionalTshirts = tShirtOptions?.additionalTshirts || [];

  // Check if includedTshirt is defined and provided is true
  const isIncludedTshirtProvided = includedTshirt && includedTshirt.provided === true;

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center mb-4">
        <Shirt className="text-[#4ECDC4] mr-3" size={24} />
        <h2 className="font-playfair text-2xl font-bold text-neutral-900">
          T-Shirt Options
        </h2>
      </div>

      {/* Included T-Shirt */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <Shirt className="text-[#FF6B6B]" size={20} />
          <h3 className="font-montserrat font-semibold text-neutral-900">
            {isIncludedTshirtProvided ? 'Included T-Shirt' : 'No T-Shirt Included'}
          </h3>
        </div>
        
        {isIncludedTshirtProvided && (
          <div className="pl-7 space-y-2">
            <p className="font-montserrat text-neutral-700">
              Available Sizes: {includedTshirt.sizes?.join(', ') || 'N/A'}
            </p>
            <p className="font-montserrat text-neutral-700">
              Material: {includedTshirt.material || 'N/A'}
            </p>
          </div>
        )}
      </div>

      {/* Additional T-Shirts */}
      {additionalTshirts && additionalTshirts.length > 0 && (
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <PlusCircle className="text-[#45B7D1]" size={20} />
            <h3 className="font-montserrat font-semibold text-neutral-900">
              Additional T-Shirt Options
            </h3>
          </div>

          {additionalTshirts.map((tshirt, index) => (
            <div 
              key={tshirt._id || index} 
              className="pl-7 mb-4 pb-4 border-b last:border-b-0 border-neutral-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-montserrat font-semibold text-neutral-900">
                  {tshirt.name}
                </h4>
                <span className="font-montserrat text-[#FF6B6B] font-semibold">
                  {formatCurrency(tshirt.price)}
                </span>
              </div>
              
              <div className="space-y-2">
                <p className="font-montserrat text-neutral-700">
                  Sizes: {tshirt.sizes?.join(', ') || 'N/A'}
                </p>
                <p className="font-montserrat text-neutral-700">
                  Material: {tshirt.material || 'N/A'}
                </p>
                {tshirt.availableTill && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-[#4ECDC4]" size={16} />
                    <p className="font-montserrat text-neutral-600 text-sm">
                      Available until: {formatDate(tshirt.availableTill)}
                    </p>
                  </div>
                )}
                {tshirt.quantity && (
                  <p className="font-montserrat text-neutral-600 text-sm">
                    Quantity Available: {tshirt.quantity}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
