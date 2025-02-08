'use client'

import { useFormContext } from 'react-hook-form'
import { ShoppingBag, Info, Plus, Minus, Shirt } from 'lucide-react'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'

export default function TshirtSection({ tshirtOptions }) {
  const { register, watch, setValue } = useFormContext()
  const additionalTshirts = watch('tshirtDetails.additionalTshirts') || []
  const [showAdditional, setShowAdditional] = useState(additionalTshirts.length > 0)

  const handleQuantityChange = (tshirtId, size, action) => {
    const currentTshirts = [...additionalTshirts]
    const tshirtIndex = currentTshirts.findIndex(t => t.tshirtId === tshirtId && t.size === size)
    
    if (tshirtIndex === -1 && action === 'add') {
      currentTshirts.push({ tshirtId, size, quantity: 1 })
    } else if (tshirtIndex !== -1) {
      if (action === 'add') {
        currentTshirts[tshirtIndex].quantity += 1
      } else if (action === 'remove') {
        if (currentTshirts[tshirtIndex].quantity === 1) {
          currentTshirts.splice(tshirtIndex, 1)
        } else {
          currentTshirts[tshirtIndex].quantity -= 1
        }
      }
    }
    
    setValue('tshirtDetails.additionalTshirts', currentTshirts)
  }

  const getTshirtQuantity = (tshirtId, size) => {
    const tshirt = additionalTshirts.find(t => t.tshirtId === tshirtId && t.size === size)
    return tshirt?.quantity || 0
  }

  const getTshirtTotalQuantity = (tshirtId) => {
    return additionalTshirts
      .filter(t => t.tshirtId === tshirtId)
      .reduce((total, t) => total + t.quantity, 0)
  }

  const getTshirtTotalPrice = (tshirt) => {
    return additionalTshirts
      .filter(t => t.tshirtId === tshirt._id)
      .reduce((total, t) => total + (t.quantity * tshirt.price), 0)
  }

  const handleToggleAdditional = (e) => {
    setShowAdditional(e.target.checked)
    if (!e.target.checked) {
      // Clear additional t-shirts when unchecking
      setValue('tshirtDetails.additionalTshirts', [])
    }
  }

  if (!tshirtOptions) return null

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div>
          <h3 className="font-playfair text-xl font-semibold">T-shirt Selection</h3>
          <p className="text-sm text-neutral-600 mt-1">
            Choose your t-shirt size and any additional t-shirts
          </p>
        </div>
      </div>

      {/* Included T-shirt */}
      {tshirtOptions.includedTshirt?.provided && (
        <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Shirt className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex-grow">
              <h4 className="font-medium mb-2">Included Event T-shirt</h4>
              <div className="space-y-4">
                {tshirtOptions.includedTshirt.designImages?.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {tshirtOptions.includedTshirt.designImages.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
                        <Image
                          src={image}
                          alt="T-shirt design"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Select Size
                  </label>
                  <select
                    {...register('tshirtDetails.size', {
                      required: 'Please select a t-shirt size'
                    })}
                    className="w-full sm:w-auto px-3 py-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select Size</option>
                    {tshirtOptions.includedTshirt.sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Info className="w-4 h-4" />
                  <p>Material: {tshirtOptions.includedTshirt.material}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional T-shirts Toggle */}
      {tshirtOptions.additionalTshirts?.length > 0 && (
        <label className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-primary transition-colors cursor-pointer">
          <input
            type="checkbox"
            checked={showAdditional}
            onChange={handleToggleAdditional}
            className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
          />
          <div className="flex-grow">
            <p className="font-medium">Want Additional T-shirts?</p>
            <p className="text-sm text-neutral-600">
              You can purchase extra t-shirts with different sizes
            </p>
          </div>
        </label>
      )}

      {/* Additional T-shirts */}
      {showAdditional && tshirtOptions.additionalTshirts?.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Additional T-shirts</h4>
          
          <div className="grid gap-4">
            {tshirtOptions.additionalTshirts.map((tshirt) => {
              const hasSelected = getTshirtTotalQuantity(tshirt._id) > 0
              const totalPrice = getTshirtTotalPrice(tshirt)

              return (
                <div 
                  key={tshirt._id}
                  className={`
                    border rounded-xl p-6 transition-all
                    ${hasSelected ? 'border-primary bg-primary/5' : 'border-neutral-200'}
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <ShoppingBag className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-grow space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{tshirt.name}</h5>
                          <p className="text-sm text-neutral-600">Material: {tshirt.material}</p>
                        </div>
                        <p className="font-medium text-primary">{formatCurrency(tshirt.price)}</p>
                      </div>

                      {tshirt.designImages?.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {tshirt.designImages.map((image, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
                              <Image
                                src={image}
                                alt="T-shirt design"
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-4">
                        {tshirt.sizes.map((size) => {
                          const quantity = getTshirtQuantity(tshirt._id, size)
                          return (
                            <div key={size} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-white">
                              <span className="font-medium text-sm">{size}</span>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(tshirt._id, size, 'remove')}
                                  className={`
                                    p-2 rounded-lg transition-colors
                                    ${quantity > 0
                                      ? 'hover:bg-primary/10 text-primary'
                                      : 'text-neutral-300 cursor-not-allowed'
                                    }
                                  `}
                                  disabled={quantity === 0}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                
                                <span className="w-8 text-center font-medium text-sm">
                                  {quantity}
                                </span>
                                
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(tshirt._id, size, 'add')}
                                  className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {hasSelected && (
                        <div className="flex items-center justify-between pt-2 border-t">
                          <p className="text-sm text-neutral-600">
                            Total Quantity: {getTshirtTotalQuantity(tshirt._id)}
                          </p>
                          <p className="font-medium text-primary">
                            Total: {formatCurrency(totalPrice)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
