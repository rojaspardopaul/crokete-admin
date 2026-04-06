import { useState } from "react";
import { FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import PawRating from "./PawRating";
import ReviewAIBadge from "./ReviewAIBadge";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const STATUS_BADGES = {
  pending: { label: "Pendiente", className: "bg-amber-100 text-amber-700" },
  approved: { label: "Aprobada", className: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rechazada", className: "bg-red-100 text-red-700" },
};

const ReviewDetailDrawer = ({ review, onClose, onApprove, onReject }) => {
  const { showingTranslateValue } = useUtilsFunction();
  const [adminNote, setAdminNote] = useState(review?.adminNote || "");
  const [processing, setProcessing] = useState(false);

  if (!review) return null;

  const productTitle = review.product
    ? showingTranslateValue(review.product.title)
    : "Producto eliminado";
  const productImage = review.product?.image?.[0] || "";
  const userName = review.displayName || review.user?.name || "Usuario";
  const userEmail = review.user?.email || "";
  const statusConfig = STATUS_BADGES[review.status] || STATUS_BADGES.pending;

  const handleApprove = async () => {
    setProcessing(true);
    try {
      await onApprove(review._id, adminNote);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    setProcessing(true);
    try {
      await onReject(review._id, adminNote);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 h-full overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold">Detalle de Reseña</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <FiX size={20} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Product info */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
            {productImage && (
              <img
                src={productImage}
                alt={productTitle}
                className="w-14 h-14 object-cover rounded"
              />
            )}
            <div>
              <p className="font-medium text-sm">{productTitle}</p>
              <p className="text-xs text-gray-400">
                {review.product?.slug || ""}
              </p>
            </div>
          </div>

          {/* Status + User */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-gray-400">{userEmail}</p>
            </div>
            <Badge variant="default" className={statusConfig.className}>
              {statusConfig.label}
            </Badge>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <PawRating rating={review.rating} size={22} showValue />
            <span className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Title + Comment */}
          <div className="space-y-2">
            {review.title && (
              <h3 className="font-semibold text-base">{review.title}</h3>
            )}
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {review.comment}
            </p>
          </div>

          {/* Images */}
          {review.images?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">
                Imágenes ({review.images.length})
              </p>
              <div className="grid grid-cols-3 gap-2">
                {review.images.map((src, i) => (
                  <a
                    key={i}
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={src}
                      alt={`Review image ${i + 1}`}
                      className="w-full h-24 object-cover rounded border hover:opacity-75 transition"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* AI Analysis */}
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
            <p className="text-xs font-medium text-gray-500 mb-2">
              Análisis IA
            </p>
            <ReviewAIBadge aiAnalysis={review.aiAnalysis} />
          </div>

          {/* Admin Note */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Nota del admin
            </label>
            <Textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Nota interna (opcional)..."
              rows={3}
              disabled={processing}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {review.status !== "approved" && (
              <Button
                onClick={handleApprove}
                disabled={processing}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Aprobar
              </Button>
            )}
            {review.status !== "rejected" && (
              <Button
                onClick={handleReject}
                disabled={processing}
                variant="destructive"
                className="flex-1"
              >
                Rechazar
              </Button>
            )}
            <Button
              onClick={onClose}
              disabled={processing}
              variant="outline"
              className="flex-1"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailDrawer;
