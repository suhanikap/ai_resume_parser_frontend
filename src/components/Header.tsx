import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onNavigate: (page: 'home' | 'cart' | 'checkout') => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { cartCount } = useCart();

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="text-2xl font-light tracking-wide text-stone-800 hover:text-stone-600 transition-colors"
          >
            Solène
          </button>

          <button
            onClick={() => onNavigate('cart')}
            className="relative p-2 hover:bg-stone-50 rounded-full transition-colors"
          >
            <ShoppingBag className="w-6 h-6 text-stone-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-stone-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
