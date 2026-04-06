import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FiCheck, FiX, FiEye } from "react-icons/fi";
import {
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarContext } from "@/context/SidebarContext";
import PawRating from "./PawRating";
import ReviewAIBadge from "./ReviewAIBadge";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const STATUS_BADGES = {
  pending: { label: "Pendiente", className: "bg-amber-100 text-amber-700" },
  approved: { label: "Aprobada", className: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rechazada", className: "bg-red-100 text-red-700" },
};

const ReviewTable = ({ reviews, onApprove, onReject, onViewDetail }) => {
  const { lang } = useContext(SidebarContext);
  const { showingTranslateValue } = useUtilsFunction();

  return (
    <TableBody>
      {reviews?.map((review) => {
        const statusConfig = STATUS_BADGES[review.status] || STATUS_BADGES.pending;
        const productTitle = review.product
          ? showingTranslateValue(review.product.title)
          : "Producto eliminado";
        const productImage = review.product?.image?.[0] || "";
        const userName = review.displayName || review.user?.name || "Usuario";
        const userEmail = review.user?.email || "";
        const commentPreview =
          review.comment?.length > 80
            ? review.comment.slice(0, 80) + "..."
            : review.comment;

        return (
          <TableRow key={review._id}>
            {/* Product */}
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 rounded">
                  <AvatarImage src={productImage} alt={productTitle} />
                  <AvatarFallback className="rounded text-xs">P</AvatarFallback>
                </Avatar>
                <span className="text-sm line-clamp-1">{productTitle}</span>
              </div>
            </TableCell>

            {/* Rating */}
            <TableCell>
              <PawRating rating={review.rating} size={14} />
            </TableCell>

            {/* User */}
            <TableCell>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs text-gray-400">{userEmail}</span>
              </div>
            </TableCell>

            {/* Comment */}
            <TableCell>
              <div className="max-w-xs">
                {review.title && (
                  <p className="text-sm font-medium mb-0.5 line-clamp-1">{review.title}</p>
                )}
                <p className="text-xs text-gray-500 line-clamp-2">{commentPreview}</p>
                {review.images?.length > 0 && (
                  <span className="text-[10px] text-blue-500 mt-0.5 inline-block">
                    📷 {review.images.length} imagen{review.images.length > 1 ? "es" : ""}
                  </span>
                )}
              </div>
            </TableCell>

            {/* AI Analysis */}
            <TableCell>
              <ReviewAIBadge aiAnalysis={review.aiAnalysis} />
            </TableCell>

            {/* Status */}
            <TableCell>
              <Badge variant="default" className={statusConfig.className}>
                {statusConfig.label}
              </Badge>
            </TableCell>

            {/* Date */}
            <TableCell>
              <span className="text-xs text-gray-500">
                {new Date(review.createdAt).toLocaleDateString("es-MX", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </TableCell>

            {/* Actions */}
            <TableCell>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-gray-500 hover:text-blue-600"
                  onClick={() => onViewDetail(review)}
                  title="Ver detalle"
                >
                  <FiEye size={14} />
                </Button>
                {review.status !== "approved" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-gray-500 hover:text-emerald-600"
                    onClick={() => onApprove(review._id)}
                    title="Aprobar"
                  >
                    <FiCheck size={14} />
                  </Button>
                )}
                {review.status !== "rejected" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-gray-500 hover:text-red-600"
                    onClick={() => onReject(review._id)}
                    title="Rechazar"
                  >
                    <FiX size={14} />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default ReviewTable;
