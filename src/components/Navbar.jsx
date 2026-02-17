import { motion } from 'framer-motion';
import { categories } from '../data/museums';

const categoryEmojis = {
    all: '🧭',       // Compass for exploration
    Tarih: '⚔️',     // Crossed Swords for history
    Sanat: '🖼️',     // Framed Picture for art
    Bilim: '🧪',     // Test Tube for science
    Eğlence: '🎡',   // Ferris Wheel for entertainment
    Eglence: '🎡',   // Fallback for ascii
    Kültür: '🎨',    // Artist Palette for culture (as requested)
    Kultur: '🎨',    // Fallback
};

export default function Navbar({ activeCategory, onCategoryChange }) {
    return (
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#1c1917]/95 border-b border-amber-900/20 py-4 shadow-2xl">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-2 sm:mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-900/20 flex items-center justify-center text-2xl border border-amber-600/20 shadow-[0_0_15px_rgba(217,119,6,0.1)]">
                            🏛️
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-stone-100 tracking-tight font-serif drop-shadow-sm">
                                MüzeKaşif<span className="text-amber-500">Pro</span>
                            </h1>
                            <p className="text-xs font-medium text-stone-500 tracking-wide uppercase">İstanbul Kültür Rehberi</p>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-stone-900/80 border border-stone-800">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                        </span>
                        <span className="text-xs font-medium text-stone-400">Canlı Durum</span>
                    </div>
                </div>

                {/* Categories Scroller 
            - Increased top padding to prevent jump clipping
            - Adjusted height
        */}
                <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide mask-fade-right px-1 items-end h-32 pt-10">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => onCategoryChange(cat.id)}
                            className="group relative flex flex-col items-center justify-end min-w-[90px] focus:outline-none"
                        >
                            <div
                                className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 border ${activeCategory === cat.id
                                        ? 'text-amber-50 border-amber-600/50 shadow-lg shadow-amber-900/20 bg-stone-800'
                                        : 'text-stone-500 border-transparent hover:text-stone-300 hover:bg-white/5'
                                    }`}
                            >
                                {/* Active Indicator Background (Slides horizontally) */}
                                {activeCategory === cat.id && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute inset-0 bg-amber-700/90 rounded-xl"
                                        transition={{ type: "spring", stiffness: 280, damping: 24 }}
                                    />
                                )}

                                <span className="relative z-20 text-lg opacity-90">{cat.icon}</span>
                                <span className="relative z-20 text-sm font-medium whitespace-nowrap font-serif">{cat.label}</span>
                            </div>

                            {/* Dynamic Category Emoji Jump + Shake */}
                            {activeCategory === cat.id && (
                                <motion.div
                                    layoutId="active-marker-emoji"
                                    className="absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                                    initial={{ y: 0, scale: 0.5, opacity: 0 }}

                                    // Reduced jump height (-45px) inside a taller container
                                    // Reduced size (text-3xl)
                                    animate={{
                                        y: [0, -45, 0],
                                        scale: [0.5, 1.1, 1],
                                        opacity: [0, 1, 1],
                                        rotate: [0, -15, 15, -10, 10, -5, 5, 0]
                                    }}
                                    transition={{
                                        y: { duration: 0.5, ease: "easeInOut", times: [0, 0.5, 1] },
                                        scale: { duration: 0.5, times: [0, 0.5, 1] },
                                        opacity: { duration: 0.2 },
                                        rotate: { duration: 0.7, ease: "linear", delay: 0.1 }
                                    }}
                                    style={{ top: '-18px' }} // Start position
                                >
                                    <span className="text-3xl drop-shadow-xl filter brightness-110">
                                        {categoryEmojis[cat.id] || categoryEmojis[cat.label] || '📍'}
                                    </span>
                                </motion.div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}
