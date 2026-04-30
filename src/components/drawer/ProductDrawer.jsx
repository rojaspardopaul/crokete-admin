import ReactTagInput from "@pathofdev/react-tag-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Multiselect from "multiselect-react-dropdown";
import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { MultiSelect } from "react-multi-select-component";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiX } from "react-icons/fi";

//internal import

import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import LabelArea from "@/components/form/selectOption/LabelArea";
import DrawerButton from "@/components/form/button/DrawerButton";
import InputValue from "@/components/form/input/InputValue";
import useProductSubmit from "@/hooks/useProductSubmit";
import ActiveButton from "@/components/form/button/ActiveButton";
import InputValueFive from "@/components/form/input/InputValueFive";
import Uploader from "@/components/image-uploader/Uploader";
import ParentCategory from "@/components/category/ParentCategory";
import UploaderThree from "@/components/image-uploader/UploaderThree";
import AttributeOptionTwo from "@/components/attribute/AttributeOptionTwo";
import AttributeListTable from "@/components/attribute/AttributeListTable";
import SwitchToggleForCombination from "@/components/form/switch/SwitchToggleForCombination";
import useAsync from "@/hooks/useAsync";
import PetServices from "@/services/PetServices";
import BrandServices from "@/services/BrandServices";

// v2 product form components
import PetCompatibilityForm from "@/components/product/PetCompatibilityForm";
import QuickInfoForm from "@/components/product/QuickInfoForm";
import BenefitsFeaturesForm from "@/components/product/BenefitsFeaturesForm";
import NutritionForm from "@/components/product/NutritionForm";
import IndicationsForm from "@/components/product/IndicationsForm";
import TechnicalSpecsForm from "@/components/product/TechnicalSpecsForm";
import VisualTagsForm from "@/components/product/VisualTagsForm";
import PackageInfoForm from "@/components/product/PackageInfoForm";
import ConsumptionGuideForm from "@/components/product/ConsumptionGuideForm";

//internal import

const ProductDrawer = ({ id, aiInitialData, onAiDataConsumed }) => {
  const { t } = useTranslation();

  const {
    tag,
    setTag,
    values,
    language,
    register,
    onSubmit,
    errors,
    slug,
    openModal,
    attribue,
    setValues,
    variants,
    imageUrl,
    setImageUrl,
    handleSubmit,
    isCombination,
    variantTitle,
    attributes,
    attTitle,
    handleAddAtt,
    // productId,
    onCloseModal,
    isBulkUpdate,
    globalSetting,
    isSubmitting,
    tapValue,
    setTapValue,
    resetRefTwo,
    handleSkuBarcode,
    handleProductTap,
    selectedCategory,
    setSelectedCategory,
    setDefaultCategory,
    defaultCategory,
    handleProductSlug,
    handleSelectLanguage,
    handleIsCombination,
    handleEditVariant,
    handleRemoveVariant,
    handleClearVariant,
    handleQuantityPrice,
    handleSelectImage,
    handleSelectInlineImage,
    handleGenerateCombination,
    selectedPet,
    setSelectedPet,
    selectedBrand,
    setSelectedBrand,
    // v2 new fields
    productType,
    setProductType,
    petCompatibility,
    setPetCompatibility,
    quickInfo,
    setQuickInfo,
    packageInfo,
    setPackageInfo,
    benefits,
    setBenefits,
    features,
    setFeatures,
    ingredients,
    setIngredients,
    nutritionTable,
    setNutritionTable,
    feedingGuide,
    setFeedingGuide,
    indications,
    setIndications,
    warnings,
    setWarnings,
    dosage,
    setDosage,
    technicalSpecs,
    setTechnicalSpecs,
    consumptionGuide,
    setConsumptionGuide,
    productHighlights,
    setProductHighlights,
    keyFacts,
    setKeyFacts,
    visualTags,
    setVisualTags,
    iconTags,
    setIconTags,
    recommendedFor,
    setRecommendedFor,
    brandInfo,
    setBrandInfo,
    applyAiData,
  } = useProductSubmit(id);

  const { currency, showingTranslateValue } = useUtilsFunction();

  const { data: petsData } = useAsync(PetServices.getShowingPets);
  const { data: brandsData } = useAsync(BrandServices.getAllBrands);

  // Apply AI-generated data when received
  React.useEffect(() => {
    if (aiInitialData && !id) {
      applyAiData(aiInitialData);
      if (onAiDataConsumed) onAiDataConsumed();
    }
  }, [aiInitialData]);

  return (
    <>
      <Modal
        open={openModal}
        onClose={onCloseModal}
        center
        closeIcon={
          <div className="absolute top-0 right-0 text-red-500  active:outline-none text-xl border-0">
            <FiX className="text-3xl" />
          </div>
        }
      >
        <div className="cursor-pointer">
          <UploaderThree
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            handleSelectImage={handleSelectImage}
          />
        </div>
      </Modal>

      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            register={register}
            language={language}
            handleSelectLanguage={handleSelectLanguage}
            title={t("UpdateProduct")}
            description={t("UpdateProductDescription")}
          />
        ) : (
          <Title
            register={register}
            language={language}
            handleSelectLanguage={handleSelectLanguage}
            title={t("DrawerAddProduct")}
            description={t("AddProductDescription")}
          />
        )}
      </div>

      <div className="flex items-center justify-between px-4 flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-700">
        <ul className="flex items-center flex-wrap gap-y-1 py-2">
          <li className="mr-2">
            <ActiveButton
              tapValue={tapValue}
              activeValue="Información Básica"
              handleProductTap={handleProductTap}
            />
          </li>
          <li className="mr-2">
            <ActiveButton
              tapValue={tapValue}
              activeValue="Mascota"
              handleProductTap={handleProductTap}
            />
          </li>
          <li className="mr-2">
            <ActiveButton
              tapValue={tapValue}
              activeValue="Quick Info"
              handleProductTap={handleProductTap}
            />
          </li>
          <li className="mr-2">
            <ActiveButton
              tapValue={tapValue}
              activeValue="Beneficios"
              handleProductTap={handleProductTap}
            />
          </li>
          {productType === "food" && (
            <li className="mr-2">
              <ActiveButton
                tapValue={tapValue}
                activeValue="Nutrición"
                handleProductTap={handleProductTap}
              />
            </li>
          )}
          {productType === "medicine" && (
            <li className="mr-2">
              <ActiveButton
                tapValue={tapValue}
                activeValue="Indicaciones"
                handleProductTap={handleProductTap}
              />
            </li>
          )}
          {productType === "accessory" && (
            <li className="mr-2">
              <ActiveButton
                tapValue={tapValue}
                activeValue="Especificaciones"
                handleProductTap={handleProductTap}
              />
            </li>
          )}
          <li className="mr-2">
            <ActiveButton
              tapValue={tapValue}
              activeValue="Empaque"
              handleProductTap={handleProductTap}
            />
          </li>
          <li className="mr-2">
            <ActiveButton
              tapValue={tapValue}
              activeValue="Tags"
              handleProductTap={handleProductTap}
            />
          </li>
          {isCombination && (
            <li className="mr-2">
              <ActiveButton
                tapValue={tapValue}
                activeValue="Variante"
                handleProductTap={handleProductTap}
              />
            </li>
          )}
        </ul>
        <div className="flex items-center">
          <SwitchToggleForCombination
            product
            handleProcess={handleIsCombination}
            processOption={isCombination}
          />
        </div>
      </div>

      <Scrollbars className="track-horizontal thumb-horizontal w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="block" id="block">
          {tapValue === "Información Básica" && (
            <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Tipo de producto" />
                <div className="col-span-8 sm:col-span-4">
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-500 border-transparent focus:bg-white focus:border-gray-300 rounded-md"
                  >
                    <option value="general">General</option>
                    <option value="food">Croquetas / Alimento</option>
                    <option value="medicine">Farmacia Veterinaria</option>
                    <option value="accessory">Accesorios</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductTitleName")} />
                <div className="col-span-8 sm:col-span-4">
                  <Input
                    {...register(`title`, {
                      required: "TItle is required!",
                    })}
                    name="title"
                    type="text"
                    placeholder={t("ProductTitleName")}
                    onBlur={(e) => handleProductSlug(e.target.value)}
                  />
                  <Error errorName={errors.title} />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductDescription")} />
                <div className="col-span-8 sm:col-span-4">
                  <Textarea
                    className="border text-sm block w-full border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-500 dark:placeholder:text-gray-400 dark:focus:ring-0 dark:focus:border-blue-400"
                    {...register("description", {
                      required: false,
                    })}
                    name="description"
                    placeholder={t("ProductDescription")}
                    rows="4"
                    spellCheck="false"
                  />
                  <Error errorName={errors.description} />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductImage")} />
                <div className="col-span-8 sm:col-span-4">
                  <Uploader
                    product
                    folder="product"
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductSKU")} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    label={t("ProductSKU")}
                    name="sku"
                    type="text"
                    placeholder={t("ProductSKU")}
                  />
                  <Error errorName={errors.sku} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductBarcode")} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    label={t("ProductBarcode")}
                    name="barcode"
                    type="text"
                    placeholder={t("ProductBarcode")}
                  />
                  <Error errorName={errors.barcode} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("Category")} />
                <div className="col-span-8 sm:col-span-4">
                  <ParentCategory
                    lang={language}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    setDefaultCategory={setDefaultCategory}
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    La categoría organiza el catálogo. La marca del producto se define por separado en el siguiente campo.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("DefaultCategory")} />
                <div className="col-span-8 sm:col-span-4">
                  <Multiselect
                    displayValue="name"
                    isObject={true}
                    singleSelect={true}
                    ref={resetRefTwo}
                    hidePlaceholder={true}
                    onKeyPressFn={function noRefCheck() { }}
                    onRemove={function noRefCheck() { }}
                    onSearch={function noRefCheck() { }}
                    onSelect={(v) => setDefaultCategory(v)}
                    selectedValues={defaultCategory}
                    options={selectedCategory}
                    placeholder={"Categoría por defecto"}
                  ></Multiselect>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Mascota" />
                <div className="col-span-8 sm:col-span-4">
                  <select
                    value={selectedPet || ""}
                    onChange={(e) => setSelectedPet(e.target.value || null)}
                    className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-500 border-transparent focus:bg-white focus:border-gray-300 rounded-md"
                  >
                    <option value="">Seleccionar mascota (opcional)</option>
                    {petsData?.map((pet) => (
                      <option key={pet._id} value={pet._id}>
                        {showingTranslateValue(pet?.name)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Marca" />
                <div className="col-span-8 sm:col-span-4">
                  <select
                    value={selectedBrand || ""}
                    onChange={(e) => setSelectedBrand(e.target.value || null)}
                    className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-500 border-transparent focus:bg-white focus:border-gray-300 rounded-md"
                  >
                    <option value="">Seleccionar marca (opcional)</option>
                    {brandsData?.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {showingTranslateValue(brand?.name)}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Usa este selector para la marca. No la dupliques como subcategoría.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Product Price" />
                <div className="col-span-8 sm:col-span-4">
                  <InputValue
                    disabled={isCombination}
                    register={register}
                    maxValue={999999}
                    minValue={1}
                    label="Original Price"
                    name="originalPrice"
                    type="number"
                    placeholder="OriginalPrice"
                    defaultValue={0.0}
                    required={true}
                    product
                    currency={currency}
                  />
                  <Error errorName={errors.originalPrice} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("SalePrice")} />
                <div className="col-span-8 sm:col-span-4">
                  <InputValue
                    disabled={isCombination}
                    product
                    register={register}
                    minValue={0}
                    defaultValue={0.0}
                    required={true}
                    label="Sale price"
                    name="price"
                    type="number"
                    placeholder="Sale price"
                    currency={currency}
                  />
                  <Error errorName={errors.price} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
                <LabelArea label={t("ProductQuantity")} />
                <div className="col-span-8 sm:col-span-4">
                  <InputValueFive
                    required={true}
                    disabled={isCombination}
                    register={register}
                    minValue={0}
                    defaultValue={0}
                    label="Quantity"
                    name="stock"
                    type="number"
                    placeholder={t("ProductQuantity")}
                  />
                  <Error errorName={errors.stock} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductSlug")} />
                <div className="col-span-8 sm:col-span-4">
                  <Input
                    {...register(`slug`, {
                      required: "slug is required!",
                    })}
                    className=" mr-2 p-2"
                    name="slug"
                    type="text"
                    defaultValue={slug}
                    placeholder={t("ProductSlug")}
                    onBlur={(e) => handleProductSlug(e.target.value)}
                  />
                  <Error errorName={errors.slug} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={t("ProductTag")} />
                <div className="col-span-8 sm:col-span-4">
                  <ReactTagInput
                    placeholder={t("ProductTagPlaseholder")}
                    tags={tag}
                    onChange={(newTags) => setTag(newTags)}
                  />
                </div>
              </div>
            </div>
          )}

          {tapValue === "Mascota" && (
            <PetCompatibilityForm
              petCompatibility={petCompatibility}
              setPetCompatibility={setPetCompatibility}
              recommendedFor={recommendedFor}
              setRecommendedFor={setRecommendedFor}
              language={language}
            />
          )}

          {tapValue === "Quick Info" && (
            <QuickInfoForm
              quickInfo={quickInfo}
              setQuickInfo={setQuickInfo}
            />
          )}

          {tapValue === "Beneficios" && (
            <BenefitsFeaturesForm
              benefits={benefits}
              setBenefits={setBenefits}
              features={features}
              setFeatures={setFeatures}
              productHighlights={productHighlights}
              setProductHighlights={setProductHighlights}
              language={language}
            />
          )}

          {tapValue === "Nutrición" && productType === "food" && (
            <>
              <NutritionForm
                ingredients={ingredients}
                setIngredients={setIngredients}
                nutritionTable={nutritionTable}
                setNutritionTable={setNutritionTable}
                feedingGuide={feedingGuide}
                setFeedingGuide={setFeedingGuide}
                keyFacts={keyFacts}
                setKeyFacts={setKeyFacts}
                language={language}
              />
              <ConsumptionGuideForm
                consumptionGuide={consumptionGuide}
                setConsumptionGuide={setConsumptionGuide}
              />
            </>
          )}

          {tapValue === "Indicaciones" && productType === "medicine" && (
            <IndicationsForm
              indications={indications}
              setIndications={setIndications}
              warnings={warnings}
              setWarnings={setWarnings}
              dosage={dosage}
              setDosage={setDosage}
              language={language}
            />
          )}

          {tapValue === "Especificaciones" && productType === "accessory" && (
            <TechnicalSpecsForm
              technicalSpecs={technicalSpecs}
              setTechnicalSpecs={setTechnicalSpecs}
              language={language}
            />
          )}

          {tapValue === "Empaque" && (
            <PackageInfoForm
              packageInfo={packageInfo}
              setPackageInfo={setPackageInfo}
            />
          )}

          {tapValue === "Tags" && (
            <VisualTagsForm
              visualTags={visualTags}
              setVisualTags={setVisualTags}
              iconTags={iconTags}
              setIconTags={setIconTags}
            />
          )}

          {tapValue === "Variante" &&
            isCombination &&
            (attribue.length < 1 ? (
              <div
                className="bg-teal-100 border border-teal-600 rounded-md text-teal-900 px-4 py-3 m-4"
                role="alert"
              >
                <div className="flex">
                  <div className="py-1">
                    <svg
                      className="fill-current h-6 w-6 text-teal-500 mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm">
                      {t("AddCombinationsDiscription")}{" "}
                      <Link to="/attributes" className="font-bold">
                        {t("AttributesFeatures")}
                      </Link>
                      {t("AddCombinationsDiscriptionTwo")}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <h4 className="mb-2 font-semibold text-sm text-gray-700">1. Selecciona los atributos para las variantes</h4>
                <p className="mb-4 text-xs text-gray-500">Elige los tipos de variante (ej: Peso, Tama\u00f1o) y luego selecciona sus valores.</p>
                <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3 md:gap-3 xl:gap-3 lg:gap-2 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de atributo</label>
                    <MultiSelect
                      options={attTitle}
                      value={attributes}
                      onChange={(v) => handleAddAtt(v)}
                      labelledBy="Seleccionar"
                      overrideStrings={{
                        allItemsAreSelected: "Todos seleccionados",
                        clearSearch: "Limpiar b\u00fasqueda",
                        clearSelected: "Limpiar selecci\u00f3n",
                        noOptions: "Sin opciones disponibles",
                        search: "Buscar...",
                        selectAll: "Seleccionar todo",
                        selectAllFiltered: "Seleccionar todo (filtrado)",
                        selectSomeItems: "Seleccionar atributo...",
                        create: "Crear",
                      }}
                    />
                  </div>

                  {attributes?.map((attribute, i) => (
                    <div key={attribute._id}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Valores de: {showingTranslateValue(attribute?.title) || showingTranslateValue(attribute?.name) || attribute?.label || "Atributo"}
                      </label>

                      <AttributeOptionTwo
                        id={i + 1}
                        values={values}
                        lang={language}
                        attributes={attribute}
                        setValues={setValues}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mb-6">
                  {attributes?.length > 0 && (
                    <Button
                      onClick={handleGenerateCombination}
                      type="button"
                      className="mx-2"
                    >
                      <span className="text-xs">Generar Variantes</span>
                    </Button>
                  )}

                  {variantTitle.length > 0 && (
                    <Button onClick={handleClearVariant} className="mx-2">
                      <span className="text-xs">Limpiar Variantes</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}

          {isCombination ? (
            <DrawerButton
              id={id}
              save
              title="Product"
              isSubmitting={isSubmitting}
              handleProductTap={handleProductTap}
            />
          ) : (
            <DrawerButton id={id} title="Product" isSubmitting={isSubmitting} />
          )}

          {tapValue === "Variante" && (
            <DrawerButton id={id} title="Product" isSubmitting={isSubmitting} />
          )}
        </form>

        {tapValue === "Variante" &&
          isCombination &&
          variantTitle.length > 0 && (
            <div className="px-6 overflow-x-auto">
              {/* {variants?.length >= 0 && ( */}
              {isCombination && (
                <TableContainer className="md:mb-32 mb-40 rounded-b-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Imagen</TableHead>
                        <TableHead>Combinaci\u00f3n</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>C\u00f3digo de barras</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Precio de venta</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead className="text-right">
                          Acci\u00f3n
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <AttributeListTable
                      lang={language}
                      variants={variants}
                      setTapValue={setTapValue}
                      variantTitle={variantTitle}
                      isBulkUpdate={isBulkUpdate}
                      handleSkuBarcode={handleSkuBarcode}
                      handleEditVariant={handleEditVariant}
                      handleRemoveVariant={handleRemoveVariant}
                      handleQuantityPrice={handleQuantityPrice}
                      handleSelectInlineImage={handleSelectInlineImage}
                    />
                  </Table>
                </TableContainer>
              )}
            </div>
          )}
      </Scrollbars>
    </>
  );
};

export default React.memo(ProductDrawer);
