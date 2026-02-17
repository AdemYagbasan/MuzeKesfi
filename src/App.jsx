import { useState, useRef, useMemo, useCallback } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Map, ChevronDown, ChevronUp, Search, X, Ticket, Info } from 'lucide-react';
import Navbar from './components/Navbar';
import MuseumCard from './components/MuseumCard';
import MuseumMap from './components/MuseumMap';
import { museums } from './data/museums';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [highlightedId, setHighlightedId] = useState(null);
  const [selectedMuseum, setSelectedMuseum] = useState(null);
  const [hoveredMuseum, setHoveredMuseum] = useState(null);
  const [mapVisible, setMapVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const cardRefs = useRef({});

  // Filter & Sort Logic
  const filteredMuseums = useMemo(() => {
    // 1. Filter
    let result = museums.filter((m) => {
      const matchesCategory = activeCategory === 'all' || m.category === activeCategory;
      const q = searchQuery.toLocaleLowerCase('tr').trim();
      const matchesSearch =
        q === '' ||
        m.name.toLocaleLowerCase('tr').includes(q) ||
        m.location.district.toLocaleLowerCase('tr').includes(q) ||
        m.category.toLocaleLowerCase('tr').includes(q);
      return matchesCategory && matchesSearch;
    });

    // 2. Sort: Open > Restoration > Closed  THEN  Free > Paid
    result.sort((a, b) => {
      // Status Priority
      const statusOrder = { Open: 0, Restoration: 1, Closed: 2 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;

      // Free Rule Priority (contains 'ücretsiz' or 'free')
      const isFree = (rule) => rule && (rule.toLowerCase().includes('ücretsiz') || rule.toLowerCase().includes('free'));
      const aFree = isFree(a.freeRule) ? 0 : 1;
      const bFree = isFree(b.freeRule) ? 0 : 1;
      const freeDiff = aFree - bFree;
      if (freeDiff !== 0) return freeDiff;

      return 0; // Maintain original order otherwise
    });

    return result;
  }, [activeCategory, searchQuery]);

  // Handlers
  const handleCardClick = useCallback((museum) => {
    setSelectedMuseum(museum);
    setHighlightedId(museum.id);
    setTimeout(() => setHighlightedId(null), 1500);
  }, []);

  const handlePinClick = useCallback((museumId) => {
    const museum = museums.find((m) => m.id === museumId);
    setSelectedMuseum(museum); // Select it
    setHighlightedId(museumId);

    // Scroll to card
    const cardEl = cardRefs.current[museumId];
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => setHighlightedId(null), 1500);
  }, []);

  const handleMapBgClick = useCallback(() => {
    setSelectedMuseum(null);
  }, []);

  const setCardRef = useCallback((id, el) => {
    cardRefs.current[id] = el;
  }, []);

  return (
    <LayoutGroup>
      <div className="min-h-screen bg-stone-950 text-stone-200 font-sans selection:bg-amber-500/30">

        <Navbar
          activeCategory={activeCategory}
          onCategoryChange={(cat) => {
            setActiveCategory(cat);
            setSelectedMuseum(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        <main className="max-w-7xl mx-auto px-6 py-8">

          {/* Controls Bar */}
          <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-6 mb-8">

            {/* Search Input */}
            <div className="relative group w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-stone-500 group-focus-within:text-amber-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-10 py-3 bg-stone-900/50 border border-stone-800 rounded-xl text-sm placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all shadow-inner hover:bg-stone-900/80 text-stone-300"
                placeholder="Müze, ilçe veya kategori ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <X className="h-4 w-4 text-stone-500 hover:text-stone-300 transition-colors" />
                </button>
              )}
            </div>

            {/* Stats Pills - Stone/Amber Theme */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {['Open', 'Restoration', 'Closed'].map(status => {
                const count = museums.filter(m => m.status === status).length;
                const colors = {
                  Open: 'text-emerald-500 bg-emerald-950/30 border-emerald-900/50',
                  Restoration: 'text-amber-500 bg-amber-950/30 border-amber-900/50',
                  Closed: 'text-red-500 bg-red-950/30 border-red-900/50'
                };
                return (
                  <div key={status} className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 whitespace-nowrap ${colors[status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status === 'Open' ? 'bg-emerald-500 animate-pulse' : status === 'Restoration' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                    {count} {status === 'Open' ? 'Açık' : status === 'Restoration' ? 'Restorasyonda' : 'Kapalı'}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mobile Map Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setMapVisible(!mapVisible)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-stone-900/80 border border-stone-800 rounded-xl text-sm font-medium hover:bg-stone-800 transition-all active:scale-[0.98] text-amber-500/80"
            >
              <Map size={18} />
              {mapVisible ? 'Haritayı Gizle' : 'Haritayı Göster'}
              {mapVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* Mobile Map View */}
          <AnimatePresence>
            {mapVisible && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden mb-8 overflow-hidden rounded-xl border border-stone-800 shadow-2xl"
              >
                <MuseumMap
                  museums={filteredMuseums}
                  selectedMuseum={selectedMuseum}
                  hoveredMuseum={hoveredMuseum}
                  onPinClick={handlePinClick}
                  onMapBgClick={handleMapBgClick}
                  className="h-[350px]"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Area */}
          {filteredMuseums.length === 0 ? (
            <div className="text-center py-32 bg-stone-900/20 rounded-3xl border border-dashed border-stone-800">
              <div className="text-6xl mb-6 opacity-30 grayscale">🏛️</div>
              <h3 className="text-xl font-semibold text-stone-400 mb-2">Müze Bulunamadı</h3>
              <p className="text-stone-600 max-w-sm mx-auto">
                "{searchQuery}" aramasıyla eşleşen bir sonuç yok.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="mt-6 px-6 py-2 bg-stone-800 hover:bg-stone-700 rounded-full text-stone-300 text-sm font-medium transition-colors border border-stone-700"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 items-start">

              {/* Cards Grid */}
              <div className="flex-1 w-full order-2 lg:order-1">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h2 className="text-sm font-medium text-stone-500 flex items-center gap-2">
                    <Info size={14} />
                    <span>Öncelik: Açık ve Ücretsiz Müzeler</span>
                  </h2>
                  <span className="text-xs text-stone-600 bg-stone-900 px-2 py-1 rounded border border-stone-800">
                    {filteredMuseums.length} Sonuç
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <LayoutGroup>
                    <AnimatePresence mode='popLayout'>
                      {filteredMuseums.map((museum, index) => (
                        <MuseumCard
                          key={museum.id}
                          ref={(el) => setCardRef(museum.id, el)}
                          museum={museum}
                          index={index}
                          isHighlighted={highlightedId === museum.id}
                          onCardClick={handleCardClick}
                          onHover={setHoveredMuseum}   // Pass generic hover setter
                          onLeave={() => setHoveredMuseum(null)}
                        />
                      ))}
                    </AnimatePresence>
                  </LayoutGroup>
                </div>
              </div>

              {/* Desktop Sticky Map */}
              <div className="hidden lg:block w-[450px] xl:w-[500px] shrink-0 sticky top-28 order-1 lg:order-2 h-[calc(100vh-140px)]">
                <MuseumMap
                  museums={filteredMuseums}
                  selectedMuseum={selectedMuseum}
                  hoveredMuseum={hoveredMuseum} // Pass hover state relative to cards
                  onPinClick={handlePinClick}
                  onMapBgClick={handleMapBgClick}
                  className="h-full"
                />
                {/* Helper Text */}
                <div className="absolute bottom-4 left-4 z-[400] text-[10px] text-stone-500 pointer-events-none opacity-60">
                  *Harita kart üzerinde gezindiğinizde odaklanır
                </div>
              </div>

            </div>
          )}

        </main>

        <footer className="border-t border-stone-900 py-8 text-center bg-stone-950">
          <p className="text-xs text-stone-600 font-serif italic">
            "Geçmiş zaman olur ki hayali cihan değer."
          </p>
          <p className="text-[10px] text-stone-700 mt-2">
            MüzeKaşif Pro © 2026
          </p>
        </footer>
      </div>
    </LayoutGroup>
  );
}
