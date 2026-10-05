import React, { useState, useMemo } from 'react';
import { Search, Plus, Sparkles, SlidersHorizontal } from 'lucide-react';
import { MenuItem, CoffeeCategory } from '../types/coffee';
import { MENU_ITEMS } from '../data/coffeeData';

interface MenuSectionProps {
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  onSelectItem,
  onQuickAdd,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CoffeeCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');

  const categories: { id: CoffeeCategory; label: string }[] = [
    { id: 'all', label: 'All Offerings' },
    { id: 'espresso', label: 'Espresso & Microfoam' },
    { id: 'filter', label: 'Filter & Pour-Over' },
    { id: 'cold_brew', label: 'Cold Brews & Tonics' },
    { id: 'bakery', label: 'Artisan Bakery' },
    { id: 'tea_specialty', label: 'Loose Leaf & Matcha' },
    { id: 'beans', label: 'Whole Bean Bags' },
  ];

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tastingNotes?.some((note) =>
          note.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesDietary =
        dietaryFilter === 'all' ||
        (item.dietary && item.dietary.includes(dietaryFilter as any));

      return matchesCategory && matchesSearch && matchesDietary;
    });
  }, [selectedCategory, searchQuery, dietaryFilter]);

  return (
    <section id="menu" className="py-16 lg:py-24 bg-[#FAF7F2] text-[#1A1513]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#E5DCD2] gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#8C6A54] mb-2 flex items-center gap-1.5">
              <span>Daily Roastery Counter</span>
              <span aria-hidden="true">·</span>
              <span>Barista Dialed In 7:00 AM</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1513]">
              Artisanal Drink & Bakery Menu
            </h2>
          </div>

          <p className="text-sm text-[#4A3E38] max-w-md font-light leading-relaxed">
            Every beverage is pulled fresh to order on our commercial Synesso MVP. 
            Customize milk alternatives, temperature, single-origin roasts, and house-infused syrups.
          </p>
        </div>

        {/* Filter Toolbar: Category Segmented Bar + Search */}
        <div className="space-y-4 mb-10">
          
          {/* Category Tabs (Functional buttons with clean states) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#1A1513] text-[#FAF7F2] shadow-xs font-semibold'
                    : 'bg-[#F4EFEB] text-[#4A3E38] hover:bg-[#EAE2D7] hover:text-[#1A1513]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar + Dietary Filter Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#8C6A54] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by drink name, jasmine, peach, cacao..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5DCD2] rounded-lg text-xs text-[#1A1513] placeholder:text-[#8C6A54]/70 focus:outline-none focus:border-[#C26D38] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C6A54] hover:text-[#1A1513] cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Dietary quick toggles */}
            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-[#8C6A54] text-[11px] font-medium whitespace-nowrap">Filter:</span>
              {[
                { id: 'all', label: 'All Items' },
                { id: 'vegan', label: 'Vegan' },
                { id: 'dairy_free', label: 'Dairy-Free' },
                { id: 'decaf_available', label: 'Decaf Available' },
                { id: 'organic', label: 'Organic' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDietaryFilter(d.id)}
                  className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    dietaryFilter === d.id
                      ? 'bg-[#E5DCD2] text-[#1A1513] font-semibold'
                      : 'text-[#4A3E38] hover:bg-[#F4EFEB]'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* Product Cards Grid: 3-column desktop, generous whitespace */}
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center bg-[#F4EFEB] rounded-2xl border border-[#E5DCD2] p-8">
            <p className="text-sm font-medium text-[#4A3E38] mb-2">No menu offerings match your current search.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setDietaryFilter('all');
              }}
              className="text-xs font-semibold text-[#C26D38] hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group flex flex-col bg-white border border-[#E5DCD2] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                {/* Image Container (65-75% visual focus) */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4EFEB]">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {/* Subtle single text tag - Anti-badge spam */}
                  {item.badge && (
                    <div className="absolute top-3 left-3 bg-[#FAF7F2]/90 backdrop-blur-xs text-[#1A1513] text-[11px] font-semibold px-2.5 py-1 rounded-sm shadow-xs">
                      {item.badge}
                    </div>
                  )}

                  {/* Quick customize button hover overlay */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.isCustomizable) {
                          onSelectItem(item);
                        } else {
                          onQuickAdd(item);
                        }
                      }}
                      className="px-3 py-1.5 bg-[#1A1513] text-white text-xs font-medium rounded-md shadow-md hover:bg-[#C26D38] transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{item.isCustomizable ? 'Customize' : 'Add to Bag'}</span>
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Clean unboxed metadata */}
                    <div className="text-[11px] uppercase tracking-wider text-[#8C6A54] font-medium mb-1">
                      {item.originNotes || item.category.replace('_', ' ')}
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#1A1513] group-hover:text-[#C26D38] transition-colors">
                      {item.name}
                    </h3>

                    <p className="text-xs text-[#4A3E38] line-clamp-2 mt-1.5 leading-relaxed font-light">
                      {item.description}
                    </p>

                    {/* Tasting notes as subtle unboxed typography */}
                    {item.tastingNotes && item.tastingNotes.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#8C6A54] mt-3">
                        {item.tastingNotes.map((note, idx) => (
                          <React.Fragment key={note}>
                            <span>{note}</span>
                            {idx < item.tastingNotes!.length - 1 && (
                              <span aria-hidden="true" className="text-[#D8C3B5]">·</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price and Action Footer */}
                  <div className="mt-5 pt-3 border-t border-[#F4EFEB] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#8C6A54] mr-1">from</span>
                      <span className="font-mono text-base font-bold text-[#1A1513] tabular-nums">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem(item);
                      }}
                      className="text-xs font-semibold text-[#C26D38] hover:text-[#A85926] flex items-center gap-1 cursor-pointer"
                    >
                      <span>{item.isCustomizable ? 'Order & Options' : 'Add to Bag'}</span>
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
