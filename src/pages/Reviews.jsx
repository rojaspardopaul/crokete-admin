import { useState, useCallback } from "react";
import { FiMessageSquare } from "react-icons/fi";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CustomPagination as Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageTitle from "@/components/Typography/PageTitle";
import NotFound from "@/components/table/NotFound";
import TableLoading from "@/components/preloader/TableLoading";
import AnimatedContent from "@/components/common/AnimatedContent";
import ReviewTable from "@/components/review/ReviewTable";
import ReviewDetailDrawer from "@/components/review/ReviewDetailDrawer";
import ReviewServices from "@/services/ReviewServices";
import { notifySuccess, notifyError } from "@/utils/toast";

const RESULTS_PER_PAGE = 20;

const Reviews = () => {
  const queryClient = useQueryClient();

  // Filters
  const [statusFilter, setStatusFilter] = useState("pending");
  const [ratingFilter, setRatingFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);

  // Data
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["adminReviews", statusFilter, ratingFilter, searchText, currentPage],
    queryFn: () =>
      ReviewServices.getAdminReviews({
        page: currentPage,
        limit: RESULTS_PER_PAGE,
        status: statusFilter,
        rating: ratingFilter || undefined,
        search: searchText || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const { data: stats } = useQuery({
    queryKey: ["reviewStats"],
    queryFn: ReviewServices.getReviewStats,
    staleTime: 30_000,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
    queryClient.invalidateQueries({ queryKey: ["reviewStats"] });
  }, [queryClient]);

  const handleApprove = useCallback(
    async (id, adminNote) => {
      try {
        await ReviewServices.approveReview(id, { adminNote });
        notifySuccess("Reseña aprobada");
        setSelectedReview(null);
        invalidate();
      } catch (err) {
        notifyError(err?.message || "Error al aprobar");
      }
    },
    [invalidate]
  );

  const handleReject = useCallback(
    async (id, adminNote) => {
      try {
        await ReviewServices.rejectReview(id, { adminNote });
        notifySuccess("Reseña rechazada");
        setSelectedReview(null);
        invalidate();
      } catch (err) {
        notifyError(err?.message || "Error al rechazar");
      }
    },
    [invalidate]
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleReset = () => {
    setStatusFilter("pending");
    setRatingFilter("");
    setSearchText("");
    setCurrentPage(1);
  };

  const reviews = data?.reviews || [];
  const totalDoc = data?.totalDoc || 0;
  const pages = data?.pages || 0;
  const pendingCount = stats?.byStatus?.pending || 0;

  return (
    <>
      <PageTitle>
        <div className="flex items-center gap-2">
          <FiMessageSquare />
          Reseñas
          {pendingCount > 0 && (
            <span className="inline-flex items-center justify-center h-6 min-w-6 px-1.5 text-xs font-bold text-white bg-amber-500 rounded-full">
              {pendingCount}
            </span>
          )}
        </div>
      </PageTitle>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-amber-500">{stats.byStatus.pending}</p>
              <p className="text-xs text-gray-500">Pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-emerald-500">{stats.byStatus.approved}</p>
              <p className="text-xs text-gray-500">Aprobadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-red-500">{stats.byStatus.rejected}</p>
              <p className="text-xs text-gray-500">Rechazadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </CardContent>
          </Card>
        </div>
      )}

      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardContent>
            {/* Filter bar */}
            <form
              onSubmit={handleSearch}
              className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
            >
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Input
                  type="search"
                  placeholder="Buscar por texto, título o nombre..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <div className="w-full md:w-40">
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="approved">Aprobadas</SelectItem>
                    <SelectItem value="rejected">Rechazadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-32">
                <Select value={ratingFilter} onValueChange={(v) => { setRatingFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="5">5 patitas</SelectItem>
                    <SelectItem value="4">4 patitas</SelectItem>
                    <SelectItem value="3">3 patitas</SelectItem>
                    <SelectItem value="2">2 patitas</SelectItem>
                    <SelectItem value="1">1 patita</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button type="submit" variant="default" className="h-10">
                  Filtrar
                </Button>
                <Button type="button" variant="outline" className="h-10" onClick={handleReset}>
                  Limpiar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {loading ? (
          <TableLoading row={8} col={8} />
        ) : error ? (
          <p className="text-center text-red-500">{error.message}</p>
        ) : reviews.length === 0 ? (
          <NotFound title="No se encontraron reseñas" />
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Comentario</TableHead>
                    <TableHead>Análisis IA</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <ReviewTable
                  reviews={reviews}
                  onApprove={(id) => handleApprove(id, "")}
                  onReject={(id) => handleReject(id, "")}
                  onViewDetail={setSelectedReview}
                />
              </Table>
            </TableContainer>
            <div className="mt-4">
              <Pagination
                totalresults={totalDoc}
                resultsperpage={RESULTS_PER_PAGE}
                onChange={(p) => setCurrentPage(p)}
                label="Reseñas"
              />
            </div>
          </>
        )}
      </AnimatedContent>

      {/* Detail drawer */}
      {selectedReview && (
        <ReviewDetailDrawer
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </>
  );
};

export default Reviews;
