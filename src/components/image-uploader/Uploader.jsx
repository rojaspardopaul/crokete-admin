import React, { useEffect, useState } from "react";
import { t } from "i18next";
import { useDropzone } from "react-dropzone";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FiUploadCloud, FiXCircle } from "react-icons/fi";
import imageCompression from "browser-image-compression";

// Internal imports
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { notifyError, notifySuccess } from "@/utils/toast";
import Container from "@/components/image-uploader/Container";
import UploadServices from "@/services/UploadServices";

const Uploader = ({ setImageUrl, imageUrl, product, folder = "crokete" }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState("");
  const { globalSetting } = useUtilsFunction();

  const maxImages = globalSetting?.number_of_image_per_product || 2;

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".svg"],
    },
    multiple: product ? true : false,
    maxSize: 10485760, // 10 MB (backend normaliza a webp 1000×1000)
    maxFiles: maxImages,
    onDrop: async (acceptedFiles) => {
      if (!acceptedFiles?.length) return;

      // Capacity check for multi-image (product) uploads
      if (product && (imageUrl?.length || 0) + acceptedFiles.length > maxImages) {
        return notifyError(`Máximo ${maxImages} imágenes por producto.`);
      }

      // Show transient previews while uploading
      const withPreview = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      setFiles(withPreview);

      setLoading(true);
      setError("Subiendo...");

      for (const file of acceptedFiles) {
        try {
          const isSvg = file.type === "image/svg+xml";
          // Light client-side compression to shrink the upload payload; the
          // backend does the canonical webp + 1000×1000 normalization.
          const dataUrl = isSvg
            ? await imageCompression.getDataUrlFromFile(file)
            : await imageCompression.getDataUrlFromFile(
                await imageCompression(file, {
                  maxWidthOrHeight: 1600,
                  maxSizeMB: 1.5,
                  useWebWorker: true,
                })
              );

          const { url } = await UploadServices.uploadImage(dataUrl, {
            folder,
            square: !!product, // products → uniform square; logos → keep ratio
          });

          if (product) {
            setImageUrl((prev) => [...(prev || []), url]);
          } else {
            setImageUrl(url);
          }
          notifySuccess("¡Imagen subida correctamente!");
        } catch (error) {
          console.error("upload error", error);
          notifyError(
            error?.response?.data?.message || "No se pudo subir la imagen."
          );
        }
      }

      setLoading(false);
      setError("");
      setFiles([]);
    },
  });

  useEffect(() => {
    if (fileRejections?.length) {
      fileRejections.forEach(({ errors }) => {
        errors.forEach((e) => {
          if (e.code === "too-many-files") {
            notifyError(`Máximo ${maxImages} imágenes por producto.`);
          } else if (e.code === "file-too-large") {
            notifyError("La imagen supera el tamaño máximo (10 MB).");
          } else {
            notifyError(e.message);
          }
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileRejections]);

  useEffect(
    () => () => {
      files.forEach((file) => file.preview && URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const handleRemoveImage = async (img) => {
    try {
      setLoading(false);
      notifyError("Imagen eliminada!");
      if (product) {
        setImageUrl((prev) => (prev || []).filter((i) => i !== img));
      } else {
        setImageUrl("");
      }
    } catch (error) {
      console.error("err", error);
      notifyError("No se pudo eliminar la imagen.");
    }
  };

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div>
        <img
          className="border-2 border-gray-100 max-w-full max-h-24 h-auto object-contain"
          src={file.preview}
          alt={file.name}
        />
      </div>
    </div>
  ));

  return (
    <div className="w-full text-center">
      <div
        className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 pt-5 pb-6"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <span className="mx-auto flex justify-center">
          <FiUploadCloud className="text-3xl text-emerald-500" />
        </span>
        <p className="text-sm mt-2">{t("DragYourImage")}</p>
        <em className="text-xs text-gray-400">{t("imageFormat")}</em>
      </div>

      <div className="text-emerald-500">{loading && err}</div>
      <aside className="flex flex-row flex-wrap mt-4">
        {product ? (
          <DndProvider backend={HTML5Backend}>
            <Container
              setImageUrl={setImageUrl}
              imageUrl={imageUrl}
              handleRemoveImage={handleRemoveImage}
            />
          </DndProvider>
        ) : !product && imageUrl ? (
          <div className="relative inline-block">
            <img
              className="border rounded-md border-gray-100 dark:border-gray-600 max-w-full max-h-24 h-auto object-contain p-2"
              src={imageUrl}
              alt="product"
            />
            <button
              type="button"
              className="absolute top-0 right-0 text-red-500 focus:outline-none"
              onClick={() => handleRemoveImage(imageUrl)}
            >
              <FiXCircle />
            </button>
          </div>
        ) : (
          thumbs
        )}
      </aside>
    </div>
  );
};

export default Uploader;
