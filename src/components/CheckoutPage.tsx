import { useState } from 'react';
import { Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CheckoutPageProps {
  onNavigate: (page: 'home' | 'cart' | 'checkout') => void;
}

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    await clearCart();
    setIsProcessing(false);
    setOrderComplete(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-light text-stone-800 mb-4">Order Confirmed!</h2>
          <p className="text-stone-600 mb-8">
            Thank you for your purchase. We'll send you a confirmation email shortly.
          </p>
          <button
            onClick={() => {
              setOrderComplete(false);
              onNavigate('home');
            }}
            className="px-8 py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    onNavigate('home');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-light text-stone-800 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-stone-200">
              <h2 className="text-xl font-light text-stone-800 mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-stone-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-stone-200">
              <h2 className="text-xl font-light text-stone-800 mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-stone-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-stone-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-stone-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-700 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-stone-200">
              <h2 className="text-xl font-light text-stone-800 mb-6">Payment Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-stone-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    required
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-stone-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      required
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-700 mb-2">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      required
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-stone-800 text-white py-4 rounded-lg hover:bg-stone-700 transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : `Place Order - $${cartTotal.toFixed(2)}`}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-stone-200 sticky top-24">
            <h2 className="text-xl font-light text-stone-800 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 bg-stone-50 rounded overflow-hidden flex-shrink-0">
                    {item.shoe && (
                      <img
                        src={item.shoe.image_url}
                        alt={item.shoe.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="text-stone-800">{item.shoe?.name}</p>
                    <p className="text-stone-500">Size: {item.size}</p>
                    <p className="text-stone-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm text-stone-800">
                    ${((item.shoe?.price || 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-stone-200">
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
          </div>
        </div>
      </div>
    </div>
  );
}
