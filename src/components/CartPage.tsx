import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  onNavigate: (page: 'home' | 'cart' | 'checkout') => void;
}

export function CartPage({ onNavigate }: CartPageProps) {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-light text-stone-800 mb-4">Your cart is empty</h2>
          <p className="text-stone-600 mb-8">Discover our beautiful collection of shoes</p>
          <button
            onClick={() => onNavigate('home')}
            className="px-8 py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-light text-stone-800 mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg border border-stone-200">
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-stone-50 rounded-lg overflow-hidden flex-shrink-0">
                    {item.shoe && (
                      <img
                        src={item.shoe.image_url}
                        alt={item.shoe.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-light text-lg text-stone-800">{item.shoe?.name}</h3>
                        <p className="text-sm text-stone-500">{item.shoe?.type}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-sm text-stone-600 mb-4">Size: {item.size}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-stone-100 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-stone-600" />
                        </button>
                        <span className="w-8 text-center text-stone-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-stone-100 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-stone-600" />
                        </button>
                      </div>

                      <p className="text-lg font-light text-stone-900">
                        ${((item.shoe?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-stone-200 sticky top-24">
            <h2 className="text-xl font-light text-stone-800 mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-stone-200 pt-3">
                <div className="flex justify-between text-lg font-light text-stone-900">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('checkout')}
              className="w-full bg-stone-800 text-white py-3 rounded-lg hover:bg-stone-700 transition-colors mb-3"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="w-full border border-stone-300 text-stone-700 py-3 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
