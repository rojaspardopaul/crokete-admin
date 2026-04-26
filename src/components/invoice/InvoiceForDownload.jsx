// components/invoice/InvoicePDF.js
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import dayjs from "dayjs";
import "dayjs/locale/es";

const tw = createTw({
  theme: {
    extend: {
      colors: {
        primary: "#4361ee",
        secondary: "#3f37c9",
        accent: "#4895ef",
        light: "#f8f9fa",
        dark: "#212529",
      },
      fontSize: {
        xs: "10px",
        sm: "12px",
        base: "14px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },
    },
  },
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  section: {
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
  },
  tableHeader: {
    backgroundColor: "#f1f5f9",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  lastTableRow: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    overflow: "hidden",
  },
  summaryCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#4361ee",
  },
  col1: { width: "10%" },
  col2: { width: "45%" },
  col3: { width: "15%" },
  col4: { width: "15%" },
  col5: { width: "15%" },
});

const InvoicePDF = ({ data, globalSetting }) => {
  const currency = globalSetting?.default_currency || "$";
  const getNumberTwo = (num) => (!num ? "0.00" : Number(num).toFixed(2));
  const currentDate = dayjs().locale("es").format("D [de] MMMM [de] YYYY");

  const STATUS_LABELS = {
    pedido: "PEDIDO",
    empaquetado: "EMPAQUETADO",
    en_reparto: "EN REPARTO",
    entregado: "ENTREGADO",
    cancelado: "CANCELADO",
  };

  const PAYMENT_LABELS = {
    Cash: "Pago Contra Entrega",
    Card: "Tarjeta de Crédito",
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Company info on right */}
        <View style={tw("flex flex-row justify-between items-start mb-8")}>
          <View>
            <Text
              style={tw(
                "text-2xl font-bold text-primary uppercase tracking-wider"
              )}
            >
              PEDIDO
            </Text>
            <View
              style={tw("mt-1 px-3 py-1 bg-primary rounded-full inline-block")}
            >
              <Text style={tw("text-white text-xs font-bold")}>
                {STATUS_LABELS[data?.status] || (data?.status || "PEDIDO").toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={tw("text-right")}>
            {globalSetting?.logo && (
              <Image src={globalSetting.logo} style={tw("w-36 h-12 mb-2")} />
            )}
            <Text style={tw("font-bold")}>
              {globalSetting?.company_name || "Company Name"}
            </Text>
            <Text style={tw("text-xs")}>{globalSetting?.address}</Text>
            <Text style={tw("text-xs")}>
              {globalSetting?.contact} • {globalSetting?.email}
            </Text>
            <Text style={tw("text-xs")}>
              {globalSetting?.website}
              {globalSetting?.vat_number &&
                ` \u2022 RFC: ${globalSetting.vat_number}`}
            </Text>
          </View>
        </View>

        {/* Invoice Details */}
        <View style={tw("flex flex-row justify-between mb-8")}>
          <View>
            <Text style={tw("text-sm font-bold text-dark mb-2")}>
              DATOS DEL CLIENTE:
            </Text>
            <Text style={tw("text-sm")}>
              {data?.user_info?.name || "Customer Name"}
            </Text>
            <Text style={tw("text-sm text-gray-600")}>
              {data?.user_info?.email || "customer@email.com"}
            </Text>
            <Text style={tw("text-sm text-gray-600")}>
              {data?.user_info?.contact || "N/A"}
            </Text>
            <Text style={tw("text-sm text-gray-600")}>
              {data?.user_info?.calle} {data?.user_info?.numExterior}
              {data?.user_info?.numInterior ? ` Int. ${data.user_info.numInterior}` : ""}
            </Text>
            <Text style={tw("text-sm text-gray-600")}>
              {data?.user_info?.colonia}, {data?.user_info?.municipio}, Jalisco C.P. {data?.user_info?.postalCode}
            </Text>
          </View>

          <View style={tw("text-right")}>
            <View style={tw("flex flex-row mb-1")}>
              <Text style={tw("w-28 text-sm font-bold text-dark text-left")}>
                Pedido #:
              </Text>
              <Text style={tw("text-sm")}>#{data?.invoice || "N/A"}</Text>
            </View>
            <View style={tw("flex flex-row mb-1")}>
              <Text style={tw("w-28 text-sm font-bold text-dark text-left")}>
                Fecha:
              </Text>
              <Text style={tw("text-sm")}>
                {dayjs(data?.createdAt).locale("es").format("D [de] MMMM [de] YYYY")}
              </Text>
            </View>
            <View style={tw("flex flex-row mb-1")}>
              <Text style={tw("w-28 text-sm font-bold text-dark text-left")}>
                Vencimiento:
              </Text>
              <Text style={tw("text-sm")}>
                {dayjs(data?.dueDate).isValid()
                  ? dayjs(data.dueDate).locale("es").format("D [de] MMMM [de] YYYY")
                  : "Al recibir"}
              </Text>
            </View>
          </View>
        </View>

        {/* Fixed Table with proper column widths */}
        <View style={tw("mb-6")}>
          {/* Table Header */}
          <View style={[tw("flex flex-row py-3 px-4"), styles.tableHeader]}>
            <View style={[styles.col1, tw("text-center")]}>
              <Text style={tw("text-sm font-bold text-dark")}>#</Text>
            </View>
            <View style={[styles.col2, tw("pl-2")]}>
              <Text style={tw("text-sm font-bold text-dark")}>DESCRIPCIÓN</Text>
            </View>
            <View style={[styles.col3, tw("text-center")]}>
              <Text style={tw("text-sm font-bold text-dark")}>CANT.</Text>
            </View>
            <View style={[styles.col4, tw("text-right")]}>
              <Text style={tw("text-sm font-bold text-dark")}>PRECIO</Text>
            </View>
            <View style={[styles.col5, tw("text-right")]}>
              <Text style={tw("text-sm font-bold text-dark")}>MONTO</Text>
            </View>
          </View>

          {/* Table Rows */}
          {data.cart?.map((item, index) => (
            <View
              style={[
                tw("flex flex-row py-3 px-4"),
                styles.tableRow,
                index === data.cart.length - 1 && styles.lastTableRow,
              ]}
              key={index}
            >
              <View style={[styles.col1, tw("text-center")]}>
                <Text style={tw("text-sm")}>{index + 1}</Text>
              </View>
              <View style={[styles.col2, tw("pl-2")]}>
                <Text style={tw("text-sm")}>{item.title}</Text>
              </View>
              <View style={[styles.col3, tw("text-center")]}>
                <Text style={tw("text-sm")}>{item.quantity}</Text>
              </View>
              <View style={[styles.col4, tw("text-right")]}>
                <Text style={tw("text-sm")}>
                  {currency}
                  {getNumberTwo(item.originalPrice || item.price)}
                </Text>
              </View>
              <View style={[styles.col5, tw("text-right")]}>
                <Text style={tw("text-sm")}>
                  {currency}
                  {getNumberTwo((item.originalPrice || item.price) * item.quantity)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Payment Summary */}
        <View style={[styles.summaryCard, tw("ml-auto w-64")]}>
          <View style={tw("flex flex-row justify-between mb-1")}>
            <Text style={tw("text-sm text-gray-600")}>Subtotal:</Text>
            <Text style={tw("text-sm")}>
              {currency}
              {getNumberTwo((data?.cart || []).reduce((acc, item) => acc + ((item.originalPrice || item.price) * item.quantity), 0))}
            </Text>
          </View>

          {data?.shippingCost > 0 && (
            <View style={tw("flex flex-row justify-between mb-1")}>
              <Text style={tw("text-sm text-gray-600")}>Envío:</Text>
              <Text style={tw("text-sm")}>
                {currency}
                {getNumberTwo(data?.shippingCost)}
              </Text>
            </View>
          )}

          {data?.discount > 0 && (
            <View style={tw("flex flex-row justify-between mb-1")}>
              <Text style={tw("text-sm text-gray-600")}>Descuento:</Text>
              <Text style={tw("text-sm text-green-600")}>
                -{currency}
                {getNumberTwo(data?.discount)}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={tw("flex flex-row justify-between mt-2")}>
            <Text style={tw("text-base font-bold text-dark")}>Total:</Text>
            <Text style={tw("text-base font-bold text-primary")}>
              {currency}
              {getNumberTwo(data?.total)}
            </Text>
          </View>

          {data?.taxRate > 0 && (
            <Text style={tw("text-xs text-gray-500 text-right mt-1")}>
              Includes {data.taxRate}% tax ({currency}
              {getNumberTwo(data?.taxAmount)})
            </Text>
          )}
        </View>

        {/* Payment Method */}
        <View style={tw("mt-4")}>
          <Text style={tw("text-sm font-bold text-dark mb-1")}>
            MÉTODO DE PAGO:
          </Text>
          <Text style={tw("text-sm")}>
            {PAYMENT_LABELS[data?.paymentMethod] || data?.paymentMethod || "No especificado"}
          </Text>
        </View>

        {/* Footer */}
        <View
          style={[
            tw("mt-auto pt-8"),
            { position: "absolute", bottom: 40, left: 40, right: 40 },
          ]}
        >
          <View style={styles.divider} />
          <View style={tw("flex flex-row justify-between")}>
            <Text style={tw("text-xs text-gray-500")}>
              Generado el: {currentDate}
            </Text>
            <Text style={tw("text-xs text-gray-500")}>
              {globalSetting?.company_name || "Company Name"} \u2022 Pedido #
              {data?.invoice}
            </Text>
          </View>
          {globalSetting?.invoice_footer && (
            <Text style={tw("text-xs text-center text-gray-500 mt-2")}>
              {globalSetting.invoice_footer}
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
