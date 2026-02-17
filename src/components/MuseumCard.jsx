import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';
import { MapPin, ExternalLink, Ticket, Star } from 'lucide-react';

function formatReviewCount(count) {
    if (count >= 1000) return `${(count / 1000).toFixed(1).replace('.0', '')}B`;
    return count.toString();
}

const MuseumCard = forwardRef(function MuseumCard({ museum, index, isHighlighted, onCardClick, onHover, onLeave }, ref) {
    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' },
        }),
    };

    const statusGlow = {
        Open: 'hover:shadow-emerald-500/10 hover:border-emerald-500/30',
        Closed: 'hover:shadow-red-500/10 hover:border-red-500/30',
        Restoration: 'hover:shadow-amber-500/10 hover:border-amber-500/30',
    };

    const handleClick = (e) => {
        if (e.target.closest('a')) return;
        if (onCardClick) onCardClick(museum);
    };

    return (
        <motion.div
            ref={ref}
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onMouseEnter={() => onHover && onHover(museum)}
            onMouseLeave={() => onLeave && onLeave()}
            className={`culture-card block rounded-xl overflow-hidden cursor-pointer group relative ${isHighlighted ? 'card-highlight ring-1 ring-amber-500/50' : ''
                } ${statusGlow[museum.status] || ''}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Image section */}
            <div className="relative h-48 overflow-hidden bg-stone-800">
                <img
                    src={museum.imageUrl}
                    alt={museum.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter sepia-[.15] group-hover:sepia-0"
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/600x400/292524/a8a29e?text=${encodeURIComponent(museum.name)}`;
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent" />

                {/* Status badge (top-right) */}
                <div className="absolute top-3 right-3">
                    <StatusBadge status={museum.status} />
                </div>

                {/* Category pill (top-left) */}
                <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-stone-900/60 text-stone-300 border border-stone-700/50 backdrop-blur-sm shadow-sm">
                        {museum.category}
                    </span>
                </div>

                {/* Museum name (bottom) */}
                <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-stone-100 drop-shadow-md leading-tight group-hover:text-amber-400 transition-colors">
                        {museum.name}
                    </h3>
                </div>
            </div>

            {/* Info section */}
            <div className="p-4 space-y-3 bg-stone-900">
                {/* Rating + Location row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-stone-400 text-sm">
                        <MapPin size={14} className="text-amber-600/80 shrink-0" />
                        <span>{museum.location.district}</span>
                    </div>

                    {/* Star Rating */}
                    {museum.rating && (
                        <div className="flex items-center gap-1.5">
                            <Star size={13} className="text-amber-400 fill-amber-400" />
                            <span className="text-sm font-semibold text-stone-200">{museum.rating}</span>
                            <span className="text-xs text-stone-500">({formatReviewCount(museum.reviewCount)})</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                {museum.description && (
                    <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
                        {museum.description}
                    </p>
                )}

                {/* Free rule */}
                {museum.freeRule && (
                    <div className="flex items-start gap-2 text-sm bg-stone-800/50 p-2 rounded-lg border border-stone-800">
                        <Ticket size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-amber-500/90 text-xs font-medium leading-tight">{museum.freeRule}</span>
                    </div>
                )}

                {/* Website link */}
                <a
                    href={museum.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 text-xs text-stone-600 hover:text-amber-500 transition-colors pt-2 border-t border-stone-800"
                >
                    <ExternalLink size={12} />
                    <span>Detaylı bilgi için siteye git</span>
                </a>
            </div>
        </motion.div>
    );
});

export default MuseumCard;
