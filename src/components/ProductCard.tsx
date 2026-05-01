import { useState } from 'react';
import { Shoe } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  shoe: Shoe;
}

export function ProductCard({ shoe }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    setIsAdding(true);
    await addToCart(shoe, selectedSize);
    setIsAdding(false);
    setSelectedSize('');
  };

  return (
    <div className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-square overflow-hidden bg-stone-50">
        <img
          src={shoe.image_url}
          alt={shoe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <h3 className="font-light text-lg text-stone-800 mb-1">{shoe.name}</h3>
        <p className="text-sm text-stone-500 mb-3">{shoe.type}</p>
        <p className="text-xl font-light text-stone-900 mb-4">${shoe.price.toFixed(2)}</p>

        <div className="mb-3">
          <label className="block text-sm text-stone-600 mb-2">Select Size</label>
          <div className="grid grid-cols-4 gap-2">
            {shoe.available_sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-2 text-sm border rounded transition-colors ${
                  selectedSize === size
                    ? 'bg-stone-800 text-white border-stone-800'
                    : 'border-stone-300 text-stone-700 hover:border-stone-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-stone-800 text-white py-3 rounded hover:bg-stone-700 transition-colors disabled:opacity-50"
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
