/**
 * PawRating — read-only paw icon rating display for admin panel.
 * Same SVG paw used in the store's Rating.jsx for visual consistency.
 */
const PawIcon = ({ filled, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.5"
    className={filled ? "text-amber-500" : "text-gray-300"}
  >
    {/* Center pad */}
    <ellipse cx="12" cy="16" rx="4.5" ry="3.5" />
    {/* Toes */}
    <circle cx="6" cy="9" r="2.5" />
    <circle cx="18" cy="9" r="2.5" />
    <circle cx="9" cy="5.5" r="2.2" />
    <circle cx="15" cy="5.5" r="2.2" />
  </svg>
);

const PawRating = ({ rating = 0, size = 16, showValue = false }) => {
  const rounded = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <PawIcon key={i} filled={i <= rounded} size={size} />
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-gray-600 dark:text-gray-400">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </span>
  );
};

export default PawRating;
