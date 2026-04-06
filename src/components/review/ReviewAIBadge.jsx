import { Badge } from "@/components/ui/badge";

const ACTION_CONFIG = {
  approved_suggestion: { label: "Aprobar", variant: "default", className: "bg-emerald-100 text-emerald-700" },
  needs_review: { label: "Revisión", variant: "default", className: "bg-amber-100 text-amber-700" },
  spam: { label: "Spam", variant: "destructive", className: "" },
  offensive: { label: "Ofensivo", variant: "destructive", className: "" },
  fake_review: { label: "Falsa", variant: "default", className: "bg-orange-100 text-orange-700" },
};

const ReviewAIBadge = ({ aiAnalysis }) => {
  if (!aiAnalysis || !aiAnalysis.suggestedAction) {
    return (
      <span className="text-xs text-gray-400 italic">Sin análisis</span>
    );
  }

  const { confidence, suggestedAction, reason, tags } = aiAnalysis;
  const config = ACTION_CONFIG[suggestedAction] || ACTION_CONFIG.needs_review;
  const pct = Math.round((confidence || 0) * 100);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Badge variant={config.variant} className={config.className}>
          {config.label}
        </Badge>
        <span className="text-xs text-gray-500">{pct}%</span>
      </div>
      {/* Confidence bar */}
      <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            pct >= 80
              ? "bg-emerald-500"
              : pct >= 50
              ? "bg-amber-500"
              : "bg-red-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {reason && (
        <p className="text-xs text-gray-500 line-clamp-2">{reason}</p>
      )}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewAIBadge;
