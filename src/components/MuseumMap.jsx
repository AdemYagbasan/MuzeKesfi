import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { ExternalLink, Ticket, Navigation, Star } from 'lucide-react';

const createStatusIcon = (status) => {
    const colorSuffix = { Open: 'green', Closed: 'red', Restoration: 'orange' };
    const suffix = colorSuffix[status] || 'blue';
    return L.icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${suffix}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
    });
};

function formatReviewCount(count) {
    if (count >= 1000) return `${(count / 1000).toFixed(1).replace('.0', '')}B`;
    return count.toString();
}

function MapController({ flyTarget, onMapClick }) {
    const map = useMap();
    useEffect(() => {
        if (flyTarget) {
            map.flyTo([flyTarget.location.lat, flyTarget.location.lng], 16, { duration: 1.5 });
        }
    }, [flyTarget, map]);
    useMapEvents({ click: () => onMapClick && onMapClick() });
    return null;
}

const statusLabels = { Open: '🟢 Açık', Closed: '🔴 Kapalı', Restoration: '🟠 Restorasyonda' };

export default function MuseumMap({ museums, onPinClick, selectedMuseum, hoveredMuseum, onMapBgClick, className = '' }) {
    const istanbulCenter = [41.0282, 28.9784];
    const icons = useMemo(() => ({
        Open: createStatusIcon('Open'),
        Closed: createStatusIcon('Closed'),
        Restoration: createStatusIcon('Restoration'),
    }), []);

    const visibleMuseums = useMemo(() => {
        if (hoveredMuseum) return [hoveredMuseum];
        if (selectedMuseum) return [selectedMuseum];
        return museums;
    }, [museums, selectedMuseum, hoveredMuseum]);

    return (
        <div className={`rounded-xl overflow-hidden border border-amber-900/40 shadow-2xl relative ${className}`}>
            <MapContainer
                center={istanbulCenter}
                zoom={12}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', minHeight: '400px', background: '#1c1917' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <MapController flyTarget={selectedMuseum} onMapClick={onMapBgClick} />

                {visibleMuseums.map((museum) => (
                    <Marker
                        key={museum.id}
                        position={[museum.location.lat, museum.location.lng]}
                        icon={icons[museum.status]}
                        eventHandlers={{
                            click: (e) => {
                                L.DomEvent.stopPropagation(e);
                                onPinClick(museum.id);
                            },
                        }}
                    >
                        {/* Hover-only name label */}
                        <Tooltip direction="top" offset={[0, -36]} opacity={0.9} className="custom-tooltip">
                            {museum.name}
                        </Tooltip>

                        {/* Click popup with image */}
                        <Popup maxWidth={280}>
                            <div className="font-sans min-w-[240px] p-1">
                                <div className="w-full h-36 mb-3 rounded-lg overflow-hidden">
                                    <img
                                        src={museum.imageUrl}
                                        alt={museum.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                </div>
                                <strong className="block text-sm font-bold text-stone-100 mb-1">{museum.name}</strong>

                                {/* Rating Row in Popup */}
                                {museum.rating && (
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Star size={12} className="text-amber-400 fill-amber-400" />
                                        <span className="text-xs font-bold text-stone-200">{museum.rating}</span>
                                        <span className="text-[10px] text-stone-500">({formatReviewCount(museum.reviewCount)})</span>
                                    </div>
                                )}

                                <span className="block text-xs text-stone-400 mb-2">{statusLabels[museum.status]}</span>
                                <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
                                    <span>📍</span><span>{museum.location.district}</span>
                                </div>
                                {museum.freeRule && (
                                    <div className="flex items-start gap-1.5 p-2 bg-amber-950/30 rounded-sm border border-amber-900/30 text-amber-500 mb-3">
                                        <Ticket size={12} className="shrink-0 mt-0.5" />
                                        <span className="text-[10px] font-medium">{museum.freeRule}</span>
                                    </div>
                                )}
                                <div className="flex gap-2 pt-2 border-t border-stone-800">
                                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${museum.location.lat},${museum.location.lng}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-sm text-xs font-medium transition-colors">
                                        <Navigation size={12} /> Yol Tarifi
                                    </a>
                                    <a href={museum.websiteUrl} target="_blank" rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-amber-700/20 hover:bg-amber-700/40 text-amber-500 border border-amber-700/30 rounded-sm text-xs font-medium transition-colors">
                                        <ExternalLink size={12} /> Web
                                    </a>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
