import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Shoe, SkinTone } from '../types';
import { ProductCard } from './ProductCard';

const SHOE_TYPES = ['All', 'Ballerinas', 'Heels', 'Flats', 'Sandals', 'Boots'];
const SIZES = ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'];
const SKIN_TONES: { value: SkinTone | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'All Tones', color: 'bg-gradient-to-r from-amber-100 to-amber-950' },
  { value: 'fair', label: 'Fair', color: 'bg-amber-50' },
  { value: 'light', label: 'Light', color: 'bg-amber-100' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-200' },
  { value: 'tan', label: 'Tan', color: 'bg-amber-500' },
  { value: 'deep', label: 'Deep', color: 'bg-amber-800' },
];

export function HomePage() {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [filteredShoes, setFilteredShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [selectedType, setSelectedType] = useState('All');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedSkinTone, setSelectedSkinTone] = useState<string>('all');

  useEffect(() => {
    fetchShoes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [shoes, selectedType, selectedSize, selectedSkinTone]);

  const fetchShoes = async () => {
    const { data, error } = await supabase
      .from('shoes')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setShoes(data);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...shoes];

    if (selectedType !== 'All') {
      filtered = filtered.filter(shoe =>
        shoe.type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    if (selectedSize) {
      filtered = filtered.filter(shoe =>
        shoe.available_sizes.includes(selectedSize)
      );
    }

    if (selectedSkinTone !== 'all') {
      filtered = filtered.filter(shoe =>
        shoe.suitable_skin_tones.includes(selectedSkinTone)
      );
    }

    setFilteredShoes(filtered);
  };

  const clearFilters = () => {
    setSelectedType('All');
    setSelectedSize('');
    setSelectedSkinTone('all');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-stone-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-light text-stone-800 mb-2">Discover Your Perfect Pair</h1>
        <p className="text-stone-600">Curated shoes that complement your style and skin tone</p>
      </div>

      <div className="mb-8">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>

        {showFilters && (
          <div className="mt-4 p-6 bg-white rounded-lg border border-stone-200">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">Shoe Type</label>
                <div className="flex flex-wrap gap-2">
                  {SHOE_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        selectedType === type
                          ? 'bg-stone-800 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                >
                  <option value="">All Sizes</option>
                  {SIZES.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">Skin Tone Match</label>
                <div className="space-y-2">
                  {SKIN_TONES.map((tone) => (
                    <button
                      key={tone.value}
                      onClick={() => setSelectedSkinTone(tone.value)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                        selectedSkinTone === tone.value
                          ? 'bg-stone-800 text-white'
                          : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border border-stone-300 ${tone.color}`}></div>
                      <span className="text-sm">{tone.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {(selectedType !== 'All' || selectedSize || selectedSkinTone !== 'all') && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-stone-600 hover:text-stone-800 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mb-4 text-sm text-stone-600">
        Showing {filteredShoes.length} {filteredShoes.length === 1 ? 'product' : 'products'}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredShoes.map((shoe) => (
          <ProductCard key={shoe.id} shoe={shoe} />
        ))}
      </div>

      {filteredShoes.length === 0 && (
        <div className="text-center py-16">
          <p className="text-stone-600">No shoes match your filters. Try adjusting your selection.</p>
        </div>
      )}
    </div>
  );
}
