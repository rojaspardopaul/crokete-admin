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
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import PageTitle from "@/components/Typography/PageTitle";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import AnimatedContent from "@/components/common/AnimatedContent";
import PaymentLogServices from "@/services/PaymentLogServices";

const EVENT_LABELS = {
  PAYMENT_INTENT_CREATED: { label: "Intent Creado", color: "bg-blue-100 text-blue-700" },
  PAYMENT_INTENT_UPDATED: { label: "Intent Actualizado", color: "bg-blue-100 text-blue-600" },
  PAYMENT_SUCCEEDED: { label: "Pago Exitoso", color: "bg-green-100 text-green-700" },
  PAYMENT_FAILED: { label: "Pago Fallido", color: "bg-red-100 text-red-700" },
  ORDER_CREATED: { label: "Orden Creada", color: "bg-emerald-100 text-emerald-700" },
  ORDER_CREATION_FAILED: { label: "Orden Fallida", color: "bg-red-100 text-red-700" },
  WEBHOOK_RECEIVED: { label: "Webhook", color: "bg-gray-100 text-gray-600" },
  REFUND_INITIATED: { label: "Reembolso", color: "bg-yellow-100 text-yellow-700" },
};

const STATUS_COLORS = {
  success: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
};

const PaymentLogs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [eventFilter, setEventFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const resultsPerPage = 20;

  const { data, isLoading: loading, error } = useQuery({
    queryKey: [
      "paymentLogs",
      currentPage,
      eventFilter,
      statusFilter,
      startDate,
      endDate,
      search,
    ],
    queryFn: () =>
      PaymentLogServices.getPaymentLogs({
        page: currentPage,
        limit: resultsPerPage,
        event: eventFilter || undefined,
        status: statusFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        search: search || undefined,
      }),
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const handleChangePage = (p) => setCurrentPage(p);

  const handleFilter = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setEventFilter("");
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setSearch("");
    setSearchInput("");
    setCurrentPage(1);
  };

  return (
    <>
      <div className="py-8">
        <PageTitle>Logs de Pagos</PageTitle>
      </div>

      <AnimatedContent>
        <Card className="min-w-0 shadow-sm overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
          <CardContent>
            <form onSubmit={handleFilter}>
              <div className="grid gap-4 lg:gap-4 xl:gap-6 md:gap-2 md:grid-cols-4 pt-5 pb-3">
                <div>
                  <Input
                    type="search"
                    placeholder="Buscar por email o Stripe ID"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>

                <div>
                  <Select value={eventFilter} onValueChange={(v) => { setEventFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAYMENT_INTENT_CREATED">Intent Creado</SelectItem>
                      <SelectItem value="PAYMENT_SUCCEEDED">Pago Exitoso</SelectItem>
                      <SelectItem value="PAYMENT_FAILED">Pago Fallido</SelectItem>
                      <SelectItem value="ORDER_CREATED">Orden Creada</SelectItem>
                      <SelectItem value="ORDER_CREATION_FAILED">Orden Fallida</SelectItem>
                      <SelectItem value="WEBHOOK_RECEIVED">Webhook</SelectItem>
                      <SelectItem value="REFUND_INITIATED">Reembolso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="success">Éxito</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="h-10">
                    Filtrar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="h-10"
                  >
                    Limpiar
                  </Button>
                </div>
              </div>

              <div className="pb-4 grid gap-4 lg:gap-6 xl:gap-6 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
                <div>
                  <Label>Fecha de inicio</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                  />
                </div>
                <div>
                  <Label>Fecha de fin</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                  />
                </div>
              </div>
            </form>

            {loading ? (
              <TableLoading row={12} col={7} width={160} height={20} />
            ) : error ? (
              <span className="text-center mx-auto text-red-500">
                Error al cargar los logs
              </span>
            ) : data?.logs?.length > 0 ? (
              <div>
                <TableContainer className="mb-8 dark:bg-gray-900">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Evento</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Stripe ID</TableHead>
                        <TableHead>Error</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.logs.map((log) => {
                        const eventInfo = EVENT_LABELS[log.event] || {
                          label: log.event,
                          color: "bg-gray-100 text-gray-600",
                        };
                        const statusColor =
                          STATUS_COLORS[log.status] || "bg-gray-100 text-gray-600";

                        return (
                          <TableRow key={log._id}>
                            <TableCell>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {dayjs(log.createdAt).format("DD/MM/YY HH:mm:ss")}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${eventInfo.color}`}
                              >
                                {eventInfo.label}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {log.userEmail || "—"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {log.amount != null
                                  ? `$${Number(log.amount).toFixed(2)}`
                                  : "—"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${statusColor}`}
                              >
                                {log.status === "success"
                                  ? "Éxito"
                                  : log.status === "error"
                                  ? "Error"
                                  : "Pendiente"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate block max-w-[180px]"
                                title={log.stripePaymentIntentId || ""}
                              >
                                {log.stripePaymentIntentId
                                  ? `${log.stripePaymentIntentId.slice(0, 20)}...`
                                  : "—"}
                              </span>
                            </TableCell>
                            <TableCell>
                              {log.errorMessage ? (
                                <span
                                  className="text-xs text-red-500 truncate block max-w-[200px]"
                                  title={log.errorMessage}
                                >
                                  {log.errorMessage}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div className="mt-4 flex justify-center">
                  <Pagination
                    resultsperpage={resultsPerPage}
                    totalresults={data?.totalDoc}
                    onChange={handleChangePage}
                  />
                </div>
              </div>
            ) : (
              <NotFound title="No se encontraron logs de pagos." />
            )}
          </CardContent>
        </Card>
      </AnimatedContent>
    </>
  );
};

export default PaymentLogs;
