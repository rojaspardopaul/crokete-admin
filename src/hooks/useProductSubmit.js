import combinate from "combinate";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import swal from "sweetalert";

//internal import
import useAsync from "@/hooks/useAsync";
import useUtilsFunction from "./useUtilsFunction";
import { SidebarContext } from "@/context/SidebarContext";
import AttributeServices from "@/services/AttributeServices";
import CategoryServices from "@/services/CategoryServices";
import ProductServices from "@/services/ProductServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import useTranslationValue from "./useTranslationValue";
import { useAction } from "@/context/ActionContext";

const useProductSubmit = (id) => {
  const location = useLocation();
  const { setIsUpdate, lang } = useContext(SidebarContext);

  const { openDrawer, closeDrawer } = useAction();

  const { data: attribue } = useAsync(AttributeServices.getShowingAttributes);
  const { data: allCategories } = useAsync(CategoryServices.getAllCategories);

  // react ref
  const resetRef = useRef([]);
  const resetRefTwo = useRef("");

  // react hook
  const [imageUrl, setImageUrl] = useState([]);
  const [tag, setTag] = useState([]);
  const [values, setValues] = useState({});
  let [variants, setVariants] = useState([]);
  const [variant, setVariant] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const [originalPrice, setOriginalPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [isBasicComplete, setIsBasicComplete] = useState(false);
  const [tapValue, setTapValue] = useState("Información Básica");
  const [isCombination, setIsCombination] = useState(false);
  const [attTitle, setAttTitle] = useState([]);
  const [variantTitle, setVariantTitle] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [productId, setProductId] = useState("");
  const [updatedId, setUpdatedId] = useState(id);
  const [imgId, setImgId] = useState("");
  const [isBulkUpdate, setIsBulkUpdate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [defaultCategory, setDefaultCategory] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [resData, setResData] = useState({});
  const [language, setLanguage] = useState("es");
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slug, setSlug] = useState("");

  // v2 new fields
  const [productType, setProductType] = useState("general");
  const [petCompatibility, setPetCompatibility] = useState({
    petType: [],
    ageRange: [],
    size: [],
    breed: [],
    specialNeeds: [],
  });
  const [quickInfo, setQuickInfo] = useState({
    pet: "",
    age: "",
    size: "",
    weightRange: "",
    highlight: "",
  });
  const [packageInfo, setPackageInfo] = useState({
    weight: "",
    unit: "kg",
    servings: "",
  });
  const [benefits, setBenefits] = useState({});
  const [features, setFeatures] = useState({});
  const [ingredients, setIngredients] = useState({});
  const [nutritionTable, setNutritionTable] = useState({
    guaranteedAnalysis: [],
    calories: "",
  });
  const [feedingGuide, setFeedingGuide] = useState({});
  const [indications, setIndications] = useState({});
  const [warnings, setWarnings] = useState({});
  const [dosage, setDosage] = useState({});
  const [technicalSpecs, setTechnicalSpecs] = useState([]);
  const [consumptionGuide, setConsumptionGuide] = useState([]);
  const [productHighlights, setProductHighlights] = useState([]);
  const [keyFacts, setKeyFacts] = useState([]);
  const [visualTags, setVisualTags] = useState([]);
  const [iconTags, setIconTags] = useState([]);
  const [recommendedFor, setRecommendedFor] = useState({});
  const [brandInfo, setBrandInfo] = useState({});

  const { handlerTextTranslateHandler } = useTranslationValue();
  const { showingTranslateValue, getNumber, getNumberTwo } = useUtilsFunction();

  // handle click
  const onCloseModal = () => setOpenModal(false);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  // console.log("res", resData);

  const onSubmit = async (data) => {
    // console.log('data is data',data)
    try {
      setIsSubmitting(true);
      if (!imageUrl) return notifyError("La imagen es requerida!");

      if (data.originalPrice < data.price) {
        setIsSubmitting(false);
        return notifyError("El precio de oferta no puede ser mayor al precio principal!");
      }
      if (!defaultCategory[0]) {
        setIsSubmitting(false);
        return notifyError("Categoria requerida!");
      }

      const updatedVariants = variants.map((v, i) => {
        const newObj = {
          ...v,
          price: getNumberTwo(v?.price),
          originalPrice: getNumberTwo(v?.originalPrice),
          discount: getNumberTwo(v?.discount),
          quantity: Number(v?.quantity || 0),
        };
        return newObj;
      });

      setIsBasicComplete(true);
      setPrice(data.price);
      setQuantity(data.stock);
      setBarcode(data.barcode);
      setSku(data.sku);
      setOriginalPrice(data.originalPrice);

      const titleTranslates = await handlerTextTranslateHandler(
        data.title,
        language,
        resData?.title
      );
      const descriptionTranslates = await handlerTextTranslateHandler(
        data.description,
        language,
        resData?.description
      );

      const productData = {
        productId: productId,
        sku: data.sku || "",
        barcode: data.barcode || "",
        title: {
          ...titleTranslates,
          [language]: data.title,
        },
        description: {
          ...descriptionTranslates,
          [language]: data.description || "",
        },
        slug: data.slug
          ? data.slug
          : data.title.toLowerCase().replace(/[^A-Z0-9]+/gi, "-"),

        categories: selectedCategory.map((item) => item._id),
        category: defaultCategory[0]._id,

        pet: selectedPet || undefined,
        brand: selectedBrand || undefined,

        image: imageUrl,
        stock: variants?.length < 1 ? data.stock : Number(totalStock),
        tag: JSON.stringify(tag),

        prices: {
          price: getNumber(data.price),
          originalPrice: getNumberTwo(data.originalPrice),
          discount: Number(data.originalPrice) - Number(data.price),
        },
        isCombination: updatedVariants?.length > 0 ? isCombination : false,
        variants: isCombination ? updatedVariants : [],

        // v2 new fields
        productType,
        petCompatibility,
        quickInfo,
        packageInfo,
        benefits,
        features,
        ingredients,
        nutritionTable,
        feedingGuide,
        indications,
        warnings,
        dosage,
        technicalSpecs,
        consumptionGuide,
        productHighlights,
        keyFacts,
        visualTags,
        iconTags,
        recommendedFor,
        brandInfo,
      };

      // console.log("productData ===========>", productData, "data", data);
      // return setIsSubmitting(false);

      if (updatedId) {
        const res = await ProductServices.updateProduct(updatedId, productData);
        if (res) {
          if (isCombination) {
            setIsUpdate(true);
            notifySuccess(res.message);
            setIsBasicComplete(true);
            setIsSubmitting(false);
            handleProductTap("Variante", true);
          } else {
            setIsUpdate(true);
            notifySuccess(res.message);
            setIsSubmitting(false);
          }
        }

        if (
          tapValue === "Variante" ||
          (tapValue !== "Variante" && !isCombination)
        ) {
          closeDrawer();
        }
      } else {
        const res = await ProductServices.addProduct(productData);
        // console.log("res is ", res);
        if (isCombination) {
          setUpdatedId(res._id);
          setValue("title", res.title[language ? language : "es"]);
          setValue("description", res.description[language ? language : "es"]);
          setValue("slug", res.slug);
          setValue("show", res.show);
          setValue("barcode", res.barcode);
          setValue("stock", res.stock);
          setTag(JSON.parse(res.tag));
          setImageUrl(res.image);
          setVariants(res.variants);
          setValue("productId", res.productId);
          setProductId(res.productId);
          setOriginalPrice(res?.prices?.originalPrice);
          setPrice(res?.prices?.price);
          setBarcode(res.barcode);
          setSku(res.sku);
          const result = res.variants.map(
            ({
              originalPrice,
              price,
              discount,
              quantity,
              barcode,
              sku,
              productId,
              image,
              ...rest
            }) => rest
          );

          setVariant(result);
          setIsUpdate(true);
          setIsBasicComplete(true);
          setIsSubmitting(false);
          handleProductTap("Variante", true);
          notifySuccess("Producto agregado exitosamente!");
        } else {
          setIsUpdate(true);
          notifySuccess("Producto agregado exitosamente!");
        }

        if (
          tapValue === "Variante" ||
          (tapValue !== "Variante" && !isCombination)
        ) {
          setIsSubmitting(false);
          closeDrawer();
        }
      }
    } catch (err) {
      // console.log("err", err);
      setIsSubmitting(false);
      notifyError(err?.response?.data?.message || err?.message);
      closeDrawer();
    }
  };

  useEffect(() => {
    // console.log("openDrawer", openDrawer, "id", id);

    if (!id) {
      setSlug("");
      setLanguage(lang);
      setValue("language", language);
      handleProductTap("Información Básica", true);
      setResData({});
      setValue("sku");
      setValue("title");
      setValue("slug");
      setValue("description");
      setValue("quantity");
      setValue("stock");
      setValue("originalPrice");
      setValue("price");
      setValue("barcode");
      setValue("productId");

      setProductId("");
      // setValue('show');
      setImageUrl([]);
      setTag([]);
      setVariants([]);
      setVariant([]);
      setValues({});
      setTotalStock(0);
      setSelectedCategory([]);
      setDefaultCategory([]);
      setSelectedPet(null);
      setSelectedBrand(null);
      if (location.pathname === "/products") {
        resetRefTwo?.current?.resetSelectedValues();
      }

      // reset v2 fields
      setProductType("general");
      setPetCompatibility({ petType: [], ageRange: [], size: [], breed: [], specialNeeds: [] });
      setQuickInfo({ pet: "", age: "", size: "", weightRange: "", highlight: "" });
      setPackageInfo({ weight: "", unit: "kg", servings: "" });
      setBenefits({});
      setFeatures({});
      setIngredients({});
      setNutritionTable({ guaranteedAnalysis: [], calories: "" });
      setFeedingGuide({});
      setIndications({});
      setWarnings({});
      setDosage({});
      setTechnicalSpecs([]);
      setConsumptionGuide([]);
      setProductHighlights([]);
      setKeyFacts([]);
      setVisualTags([]);
      setIconTags([]);
      setRecommendedFor({});
      setBrandInfo({});

      clearErrors("sku");
      clearErrors("title");
      clearErrors("slug");
      clearErrors("description");
      clearErrors("stock");
      clearErrors("quantity");
      setValue("stock", 0);
      setValue("costPrice", 0);
      setValue("price", 0);
      setValue("originalPrice", 0);
      clearErrors("show");
      clearErrors("barcode");
      setIsCombination(false);
      setIsBasicComplete(false);
      setIsSubmitting(false);
      setAttributes([]);

      setUpdatedId();
      return;
    } else {
      handleProductTap("Información Básica", true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, id, setValue, clearErrors, openDrawer, location.pathname]);

  useEffect(() => {
    if (id) {
      // console.log("will need to call the api");

      setIsBasicComplete(true);
      (async () => {
        try {
          const res = await ProductServices.getProductById(id);

          // console.log("res", res);

          if (res) {
            setResData(res);
            setSlug(res.slug);
            setUpdatedId(res._id);
            setValue("title", res.title[language ? language : "es"]);
            setValue(
              "description",
              res.description[language ? language : "es"]
            );
            setValue("slug", res.slug);
            setValue("show", res.show);
            setValue("sku", res.sku);
            setValue("barcode", res.barcode);
            setValue("stock", res.stock);
            setValue("productId", res.productId);
            setValue("price", res?.prices?.price);
            setValue("originalPrice", res?.prices?.originalPrice);
            setValue("stock", res.stock);
            setProductId(res.productId ? res.productId : res._id);
            setBarcode(res.barcode);
            setSku(res.sku);

            res.categories.map((category) => {
              category.name = showingTranslateValue(category?.name, lang);

              return category;
            });

            res.category.name = showingTranslateValue(
              res?.category?.name,
              lang
            );

            setSelectedCategory(res.categories);
            setDefaultCategory([res?.category]);
            setSelectedPet(res?.pet?._id || res?.pet || null);
            setSelectedBrand(res?.brand?._id || res?.brand || null);
            setTag(JSON.parse(res.tag));
            setImageUrl(res.image);
            setVariants(res.variants);
            setIsCombination(res.isCombination);
            setQuantity(res?.stock);
            setTotalStock(res.stock);
            setOriginalPrice(res?.prices?.originalPrice);
            setPrice(res?.prices?.price);

            // load v2 fields
            if (res.productType) setProductType(res.productType);
            if (res.petCompatibility) setPetCompatibility({
              petType: res.petCompatibility.petType || [],
              ageRange: res.petCompatibility.ageRange || [],
              size: res.petCompatibility.size || [],
              breed: res.petCompatibility.breed || [],
              specialNeeds: res.petCompatibility.specialNeeds || [],
            });
            if (res.quickInfo) setQuickInfo({
              pet: res.quickInfo.pet || "",
              age: res.quickInfo.age || "",
              size: res.quickInfo.size || "",
              weightRange: res.quickInfo.weightRange || "",
              highlight: res.quickInfo.highlight || "",
            });
            if (res.packageInfo) setPackageInfo({
              weight: res.packageInfo.weight || "",
              unit: res.packageInfo.unit || "kg",
              servings: res.packageInfo.servings || "",
            });
            if (res.benefits) setBenefits(res.benefits);
            if (res.features) setFeatures(res.features);
            if (res.ingredients) setIngredients(res.ingredients);
            if (res.nutritionTable) setNutritionTable({
              guaranteedAnalysis: res.nutritionTable.guaranteedAnalysis || [],
              calories: res.nutritionTable.calories || "",
              caloriesPerKg: res.nutritionTable.caloriesPerKg || "",
            });
            if (res.feedingGuide) setFeedingGuide(res.feedingGuide);
            if (res.indications) setIndications(res.indications);
            if (res.warnings) setWarnings(res.warnings);
            if (res.dosage) setDosage(res.dosage);
            if (res.technicalSpecs) setTechnicalSpecs(res.technicalSpecs);
            if (res.consumptionGuide) setConsumptionGuide(res.consumptionGuide);
            if (res.productHighlights) setProductHighlights(res.productHighlights);
            if (res.keyFacts) setKeyFacts(res.keyFacts);
            if (res.visualTags) setVisualTags(res.visualTags);
            if (res.iconTags) setIconTags(res.iconTags);
            if (res.recommendedFor) setRecommendedFor(res.recommendedFor);
            if (res.brandInfo) setBrandInfo(res.brandInfo);
          }
        } catch (err) {
          notifyError(err?.response?.data?.message || err?.message);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //for filter related attribute and extras for every product which need to update
  useEffect(() => {
    const result = attribue
      ?.filter((att) => att.option !== "Checkbox")
      .map((v) => {
        const title = showingTranslateValue(v?.title) || showingTranslateValue(v?.name) || v?._id || "Sin nombre";
        return {
          label: title,
          value: v?._id,
        };
      });

    setAttTitle([...result]);

    const res = Object?.keys(Object.assign({}, ...variants));
    const varTitle = attribue?.filter((att) => res.includes(att._id));

    if (variants?.length > 0) {
      const totalStock = variants?.reduce((pre, acc) => pre + acc.quantity, 0);
      setTotalStock(Number(totalStock));
    }
    setVariantTitle(varTitle);
  }, [attribue, variants, language, lang]);

  //for adding attribute values
  const handleAddAtt = (v, el) => {
    const result = attribue.filter((att) => {
      return v.some((item) => item.value === att._id);
    });

    const attributeArray = result.map((value) => {
      const title = showingTranslateValue(value?.title) || showingTranslateValue(value?.name) || value?._id || "Sin nombre";
      return {
        ...value,
        label: title,
        value: value._id,
      };
    });

    setAttributes(attributeArray);
  };

  //generate all combination combination
  const handleGenerateCombination = () => {
    if (Object.keys(values).length === 0) {
      return notifyError("Por favor, seleccione al menos un atributo.");
    }

    const result = variants.filter(
      ({
        originalPrice,
        discount,
        price,
        quantity,
        barcode,
        sku,
        productId,
        image,
        ...rest
      }) => JSON.stringify({ ...rest }) !== "{}"
    );

    // console.log("result", result);

    setVariants(result);

    const combo = combinate(values);

    combo.map((com, i) => {
      if (JSON.stringify(variant).includes(JSON.stringify(com))) {
        return setVariant((pre) => [...pre, com]);
      } else {
        const newCom = {
          ...com,

          originalPrice: getNumberTwo(originalPrice),
          price: getNumber(price),
          quantity: Number(quantity),
          discount: Number(originalPrice - price),
          productId: productId && productId + "-" + (variants.length + i),
          barcode: barcode,
          sku: sku,
          image: imageUrl[0] || "",
        };

        setVariants((pre) => [...pre, newCom]);
        return setVariant((pre) => [...pre, com]);
      }
    });

    setValues({});

    // resetRef?.current?.map((v, i) =>
    //   resetRef?.current[i]?.resetSelectedValues()
    // );
  };

  //for clear selected combination
  const handleClearVariant = () => {
    setVariants([]);
    setVariant([]);
    setValues({});
    resetRef?.current?.map(
      async (v, i) => await resetRef?.current[i]?.resetSelectedValues()
    );

    // console.log('value', selectedList, removedItem, resetRef.current);
  };

  //for edit combination values
  const handleEditVariant = (variant) => {
    setTapValue("Combine");
  };

  //for remove combination values
  const handleRemoveVariant = (vari, ext) => {
    // console.log("handleRemoveVariant", vari, ext);
    swal({
      title: `Are you sure to delete this ${ext ? "Extra" : "combination"}!`,
      text: `(If Okay, It will be delete this ${ext ? "Extra" : "combination"
        })`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const result = variants.filter((v) => v !== vari);
        setVariants(result);
        // console.log("result", result);
        const {
          originalPrice,
          price,
          discount,
          quantity,
          barcode,
          sku,
          productId,
          image,
          ...rest
        } = vari;
        const res = variant.filter(
          (obj) => JSON.stringify(obj) !== JSON.stringify(rest)
        );
        setVariant(res);
        setIsBulkUpdate(true);
        // setTimeout(() => setIsBulkUpdate(false), 500);
        const timeOutId = setTimeout(() => setIsBulkUpdate(false), 500);
        return clearTimeout(timeOutId);
      }
    });
  };

  // handle notification for combination and extras
  const handleIsCombination = () => {
    if ((isCombination && variantTitle.length) > 0) {
      swal({
        title: "Are you sure to remove combination from this product!",
        text: "(It will be delete all your combination and extras)",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((value) => {
        // console.log(value);
        if (value) {
          setIsCombination(!isCombination);
          setTapValue("Información Básica");
          setVariants([]);
          setVariant([]);
        }
      });
    } else {
      setIsCombination(!isCombination);
      setTapValue("Información Básica");
    }
  };

  //for select bulk action images
  const handleSelectImage = (img) => {
    if (openModal) {
      variants[imgId].image = img;
      setOpenModal(false);
    }
  };

  //for select individual combination image
  const handleSelectInlineImage = (id) => {
    setImgId(id);
    setOpenModal(!openModal);
  };

  //this for variant/combination list
  const handleSkuBarcode = (value, name, id) => {
    variants[id][name] = value;
  };

  const handleProductTap = (e, value, name) => {
    // console.log(e);

    if (value) {
      if (!value)
        return notifyError(
          `${"Please save product before adding combinations!"}`
        );
    } else {
      if (!isBasicComplete)
        return notifyError(
          `${"Please save product before adding combinations!"}`
        );
    }
    setTapValue(e);
  };

  //this one for combination list
  const handleQuantityPrice = (value, name, id, variant) => {
    // console.log(
    //   "handleQuantityPrice",
    //   "name",
    //   name,
    //   "value",
    //   value,
    //   "variant",
    //   variant
    // );
    if (name === "originalPrice" && Number(value) < Number(variant.price)) {
      // variants[id][name] = Number(variant.originalPrice);
      notifyError("El precio de oferta debe ser menor al precio del producto!");
      setValue("originalPrice", variant.originalPrice);
      setIsBulkUpdate(true);
      const timeOutId = setTimeout(() => setIsBulkUpdate(false), 100);
      return () => clearTimeout(timeOutId);
    }
    if (name === "price" && Number(variant.originalPrice) < Number(value)) {
      // variants[id][name] = Number(variant.originalPrice);      
      notifyError("El precio de oferta debe ser menor o igual al precio del producto!");
      setValue("price", variant.originalPrice);
      setIsBulkUpdate(true);
      const timeOutId = setTimeout(() => setIsBulkUpdate(false), 100);
      return () => clearTimeout(timeOutId);
    }
    setVariants((pre) =>
      pre.map((com, i) => {
        if (i === id) {
          const updatedCom = {
            ...com,
            [name]: Math.round(value),
          };

          if (name === "price") {
            updatedCom.price = getNumberTwo(value);
            updatedCom.discount = Number(variant.originalPrice) - Number(value);
          }
          if (name === "originalPrice") {
            updatedCom.originalPrice = getNumberTwo(value);
            updatedCom.discount = Number(value) - Number(variant.price);
          }

          return updatedCom;
        }
        return com;
      })
    );

    const totalStock = variants.reduce(
      (pre, acc) => Number(pre) + Number(acc.quantity),
      0
    );
    setTotalStock(Number(totalStock));
  };

  //for change language in product drawer
  const handleSelectLanguage = (lang) => {
    console.log("language changed to:", lang);

    setLanguage(lang);
    if (Object.keys(resData).length > 0) {
      setValue("title", resData.title[lang ? lang : "es"]);
      setValue("description", resData.description[lang ? lang : "es"]);
    }
  };

  //for handle product slug
  const handleProductSlug = (value) => {
    setValue("slug", value.toLowerCase().replace(/[^A-Z0-9]+/gi, "-"));
    setSlug(value.toLowerCase().replace(/[^A-Z0-9]+/gi, "-"));
  };

  // ─── Apply AI-generated data to all form fields ────────────────────────────
  const applyAiData = (aiData) => {
    if (!aiData) return;

    const categoryMap = new Map(
      (Array.isArray(allCategories) ? allCategories : []).map((category) => [
        String(category?._id),
        showingTranslateValue(category?.name, lang),
      ])
    );

    const toCategoryOption = (categoryId) => {
      const normalizedId = String(categoryId || "").trim();
      if (!normalizedId) {
        return null;
      }

      return {
        _id: normalizedId,
        name: categoryMap.get(normalizedId) || normalizedId,
      };
    };

    // Basic fields
    if (aiData.title?.es) setValue("title", aiData.title.es);
    if (aiData.description?.es) setValue("description", aiData.description.es);
    if (aiData.slug) {
      setValue("slug", aiData.slug);
      setSlug(aiData.slug);
    }
    if (aiData.prices) {
      setValue("originalPrice", aiData.prices.originalPrice || 0);
      setValue("price", aiData.prices.price || 0);
      setOriginalPrice(aiData.prices.originalPrice || 0);
      setPrice(aiData.prices.price || 0);
    }
    if (aiData.stock != null) {
      setValue("stock", aiData.stock);
      setQuantity(aiData.stock);
    }
    if (aiData.sku) {
      setValue("sku", aiData.sku);
      setSku(aiData.sku);
    }
    if (aiData.barcode) {
      setValue("barcode", aiData.barcode);
      setBarcode(aiData.barcode);
    }
    if (Array.isArray(aiData.tag)) setTag(aiData.tag);

    // Category & Brand & Pet (IDs from backend)
    if (aiData.pet) setSelectedPet(aiData.pet);
    if (aiData.brand) setSelectedBrand(aiData.brand);
    if (aiData.category || Array.isArray(aiData.categories)) {
      const selectedFromAi = [
        ...(Array.isArray(aiData.categories) ? aiData.categories : []),
        aiData.category,
      ]
        .map((categoryId) => toCategoryOption(categoryId))
        .filter(Boolean)
        .filter(
          (item, index, self) =>
            self.findIndex((it) => String(it._id) === String(item._id)) === index
        );

      if (selectedFromAi.length > 0) {
        setSelectedCategory(selectedFromAi);
      }

      const primaryCategory = toCategoryOption(aiData.category) || selectedFromAi[0] || null;
      if (primaryCategory) {
        setDefaultCategory([primaryCategory]);
      }
    }

    // Product type
    if (aiData.productType) setProductType(aiData.productType);

    // Pet compatibility
    if (aiData.petCompatibility) {
      setPetCompatibility({
        petType: aiData.petCompatibility.petType || [],
        ageRange: aiData.petCompatibility.ageRange || [],
        size: aiData.petCompatibility.size || [],
        breed: aiData.petCompatibility.breed || [],
        specialNeeds: aiData.petCompatibility.specialNeeds || [],
      });
    }

    // Quick info
    if (aiData.quickInfo) {
      setQuickInfo({
        pet: aiData.quickInfo.pet || "",
        age: aiData.quickInfo.age || "",
        size: aiData.quickInfo.size || "",
        weightRange: aiData.quickInfo.weightRange || "",
        highlight: aiData.quickInfo.highlight || "",
      });
    }

    // Package info
    if (aiData.packageInfo) {
      setPackageInfo({
        weight: aiData.packageInfo.weight || "",
        unit: aiData.packageInfo.unit || "kg",
        servings: aiData.packageInfo.servings || "",
      });
    }

    // Rich text fields (multilingual)
    if (aiData.benefits) setBenefits(aiData.benefits);
    if (aiData.features) setFeatures(aiData.features);
    if (aiData.ingredients) setIngredients(aiData.ingredients);
    if (aiData.feedingGuide) setFeedingGuide(aiData.feedingGuide);
    if (aiData.indications) setIndications(aiData.indications);
    if (aiData.warnings) setWarnings(aiData.warnings);
    if (aiData.dosage) setDosage(aiData.dosage);
    if (aiData.recommendedFor) setRecommendedFor(aiData.recommendedFor);
    if (aiData.brandInfo) setBrandInfo(aiData.brandInfo);

    // Nutrition
    if (aiData.nutritionTable) {
      setNutritionTable({
        guaranteedAnalysis: aiData.nutritionTable.guaranteedAnalysis || [],
        calories: aiData.nutritionTable.calories || "",
        caloriesPerKg: aiData.nutritionTable.caloriesPerKg || "",
      });
    }

    // Technical specs
    if (Array.isArray(aiData.technicalSpecs)) setTechnicalSpecs(aiData.technicalSpecs);

    // Consumption guide
    if (Array.isArray(aiData.consumptionGuide)) setConsumptionGuide(aiData.consumptionGuide);

    // Marketing fields
    if (Array.isArray(aiData.productHighlights)) setProductHighlights(aiData.productHighlights);
    if (Array.isArray(aiData.keyFacts)) setKeyFacts(aiData.keyFacts);
    if (Array.isArray(aiData.visualTags)) setVisualTags(aiData.visualTags);
    if (Array.isArray(aiData.iconTags)) setIconTags(aiData.iconTags);

    // Variants (AI generates with _variantLabel format — store for reference but don't map to attribute IDs)
    if (Array.isArray(aiData.variants) && aiData.variants.length > 0) {
      setIsCombination(true);
      // Filter out AI-generated variants with _variantLabel (need manual attribute mapping)
      // but set combination flag so user knows variants are expected
    } else {
      setIsCombination(false);
    }

    setIsBasicComplete(false);
    handleProductTap("Información Básica", true);
  };

  return {
    tag,
    control,
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
    productId,
    onCloseModal,
    isBulkUpdate,
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
  };
};

export default useProductSubmit;
