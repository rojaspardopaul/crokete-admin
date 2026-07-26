import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiZap, FiLoader, FiImage, FiX } from "react-icons/fi";
import imageCompression from "browser-image-compression";

import useAsync from "@/hooks/useAsync";
import { SidebarContext } from "@/context/SidebarContext";
import CategoryServices from "@/services/CategoryServices";
import BrandServices from "@/services/BrandServices";
import AiProductServices from "@/services/AiProductServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { flattenCategoryTree } from "@/utils/categoryHelpers";

const AiProductModal = ({ isOpen, onClose, onProductGenerated }) => {
  const { lang } = useContext(SidebarContext);
  const { showingTranslateValue } = useUtilsFunction();

  // Form state
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("food");
  const [provider, setProvider] = useState("gemini");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [petType, setPetType] = useState("dog");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [images, setImages] = useState([]); // [{ dataUrl, name }]
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const MAX_IMAGES = 6;

  // Available providers
  const [providers, setProviders] = useState({ gemini: false, openai: false });

  // Fetch categories, brands, and AI providers
  const { data: categoryTree } = useAsync(CategoryServices.getAllCategory);
  const { data: brandsData } = useAsync(BrandServices.getAllBrands);
  const brands = Array.isArray(brandsData) ? brandsData : [];

  const categoryOptions = React.useMemo(() => {
    const source = Array.isArray(categoryTree) ? categoryTree : [];

    return flattenCategoryTree(source);
  }, [categoryTree]);

  useEffect(() => {
    if (isOpen) {
      AiProductServices.getProviders()
        .then((data) => {
          setProviders(data);
          // Default to first available provider
          if (data.gemini) setProvider("gemini");
          else if (data.openai) setProvider("openai");
        })
        .catch(() => {
          // Silently handle — providers will show as unavailable
        });
    }
  }, [isOpen]);

  // Compress images client-side and keep them as base64 data URLs.
  // Sólo se envían a la IA para extraer el texto: nunca se almacenan.
  const processFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return notifyError(`Máximo ${MAX_IMAGES} imágenes.`);
    const toProcess = files.slice(0, remaining);
    if (files.length > remaining) notifyError(`Solo se agregaron ${remaining}; máximo ${MAX_IMAGES}.`);

    try {
      const processed = await Promise.all(
        toProcess.map(async (file) => {
          const compressed = await imageCompression(file, {
            maxSizeMB: 0.4,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
          });
          const dataUrl = await imageCompression.getDataUrlFromFile(compressed);
          return { dataUrl, name: file.name };
        })
      );
      setImages((prev) => [...prev, ...processed]);
    } catch (err) {
      notifyError("No se pudo procesar la imagen.");
    }
  };

  const handleFiles = (e) => {
    processFiles(e.target.files);
    e.target.value = ""; // allow re-selecting the same file
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (isGenerating) return;
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleGenerate = async () => {
    if (!productName.trim() && images.length === 0) {
      return notifyError("Ingresa el nombre del producto o adjunta una imagen");
    }

    setIsGenerating(true);
    try {
      const result = await AiProductServices.generateProduct({
        productName: productName.trim(),
        productType,
        provider,
        brandId: brandId || undefined,
        categoryId: categoryId || undefined,
        petType,
        additionalInfo: additionalInfo.trim() || undefined,
        images: images.length ? images.map((i) => i.dataUrl) : undefined,
      });

      if (result.success && result.product) {
        notifySuccess(
          `Producto generado con ${result.provider === "gemini" ? "Gemini" : "GPT-4o"}`
        );
        onProductGenerated(result.product);
        handleReset();
        onClose();
      } else {
        notifyError("No se pudo generar el producto. Intenta de nuevo.");
      }
    } catch (err) {
      notifyError(
        err?.response?.data?.message ||
          err?.message ||
          "Error al generar producto con IA"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setProductName("");
    setProductType("food");
    setAdditionalInfo("");
    setBrandId("");
    setCategoryId("");
    setPetType("dog");
    setImages([]);
    setDragActive(false);
  };

  const noProviders = !providers.gemini && !providers.openai;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FiZap className="text-yellow-500" />
            Crear Producto con IA
          </DialogTitle>
        </DialogHeader>

        {noProviders ? (
          <div className="py-6 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              No hay proveedores de IA configurados.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Agrega <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">GEMINI_API_KEY</code>{" "}
              o <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">OPENAI_API_KEY</code>{" "}
              en las variables de entorno del backend.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre del producto *
              </label>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ej: Royal Canin Medium Adult 15kg, Correa retráctil, Desparasitante Bravecto..."
                disabled={isGenerating}
              />
            </div>

            {/* Product Type + Pet Type row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de producto *
                </label>
                <Select
                  value={productType}
                  onValueChange={setProductType}
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">🦴 Croquetas / Alimento</SelectItem>
                    <SelectItem value="accessory">🎾 Accesorio</SelectItem>
                    <SelectItem value="medicine">💊 Farmacia Veterinaria</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mascota
                </label>
                <Select
                  value={petType}
                  onValueChange={setPetType}
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">🐕 Perro</SelectItem>
                    <SelectItem value="cat">🐈 Gato</SelectItem>
                    <SelectItem value="both">🐾 Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category + Brand row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoría
                </label>
                <Select
                  value={categoryId}
                  onValueChange={setCategoryId}
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions?.map((cat) => (
                      <SelectItem key={cat._id} value={String(cat._id)}>
                        {`${"\u00A0".repeat(Math.max(cat.level - 1, 0) * 2)}${showingTranslateValue(cat.name)}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Marca
                </label>
                <Select
                  value={brandId}
                  onValueChange={setBrandId}
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {brands?.map((brand) => (
                      <SelectItem key={brand._id} value={String(brand._id)}>
                        {showingTranslateValue(brand.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* AI Provider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Modelo de IA
              </label>
              <Select
                value={provider}
                onValueChange={setProvider}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {providers.gemini && (
                    <SelectItem value="gemini">
                      ✨ Gemini 2.0 Flash — Gratis
                    </SelectItem>
                  )}
                  {providers.openai && (
                    <SelectItem value="openai">
                      🧠 GPT-4o — Premium
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Additional info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Información adicional{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <Textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Pega aquí ingredientes del empaque, tabla nutricional, descripción del proveedor, notas especiales..."
                rows={3}
                disabled={isGenerating}
              />
              <p className="mt-1 text-xs text-gray-400">
                Mientras más info proporciones, más preciso será el resultado.
              </p>
            </div>

            {/* Image attachments for AI vision/OCR */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Imágenes del producto{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <p className="mb-2 text-xs text-gray-400">
                Arrastra y suelta o haz clic para adjuntar fotos del empaque/etiqueta.
                La IA extrae el texto e información automáticamente. Las imágenes NO
                se almacenan.
              </p>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!isGenerating) setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                }}
                onDrop={handleDrop}
                className={`flex flex-wrap gap-2 rounded-md border-2 border-dashed p-3 transition-colors ${
                  dragActive
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {images.map((img, idx) => (
                  <div key={idx} className="relative h-20 w-20 rounded border overflow-hidden group">
                    <img src={img.dataUrl} alt={img.name} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      disabled={isGenerating}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5 opacity-90 hover:opacity-100"
                      title="Quitar"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}

                {images.length < MAX_IMAGES && (
                  <label
                    className={`h-20 w-20 flex flex-col items-center justify-center gap-1 rounded border border-dashed cursor-pointer text-gray-400 hover:text-emerald-600 hover:border-emerald-500 ${
                      isGenerating ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    <FiImage size={20} />
                    <span className="text-[10px]">Agregar</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFiles}
                      disabled={isGenerating}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => {
              handleReset();
              onClose();
            }}
            disabled={isGenerating}
          >
            Cancelar
          </Button>
          {!noProviders && (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || (!productName.trim() && images.length === 0)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isGenerating ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Generando...
                </>
              ) : (
                <>
                  <FiZap className="mr-2" />
                  Generar con IA
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AiProductModal;
