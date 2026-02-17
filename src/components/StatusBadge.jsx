// Reusable status badge component with Turkish labels
export default function StatusBadge({ status }) {
    const config = {
        Open: {
            label: 'AÇIK',
            className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            dot: 'bg-emerald-400',
        },
        Closed: {
            label: 'KAPALI',
            className: 'bg-red-500/20 text-red-400 border-red-500/30',
            dot: 'bg-red-400',
        },
        Restoration: {
            label: '⚠️ RESTORASYONDA',
            className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            dot: 'bg-amber-400',
        },
    };

    const { label, className, dot } = config[status] || config.Closed;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${className}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${dot} ${status === 'Open' ? 'animate-pulse' : ''}`}></span>
            {label}
        </span>
    );
}
