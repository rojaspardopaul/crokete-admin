/**
 * Shared helpers for category/brand ID normalization and category tree manipulation.
 *
 * Used by: BrandServices, AiProductModal, and any component that needs to work
 * with the hierarchical category tree returned by the backend.
 */

/**
 * Robustly extract a string ID from any shape:
 *   string | ObjectId | populated doc { _id } | null/undefined
 * Returns empty string if not extractable.
 */
export const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value._id) return normalizeId(value._id);
  return String(value);
};

/**
 * Flatten a hierarchical category tree into a flat list suitable for <Select> inputs.
 * Skips the root "Home" container node, keeping real categories with their depth level.
 *
 * @param {Array} nodes  - Category tree from CategoryServices.getAllCategory()
 * @param {number} level - Current depth (used for indentation)
 * @returns {Array<{ _id: string, name: object|string, level: number }>}
 */
export const flattenCategoryTree = (nodes = [], level = 0) => {
  const result = [];

  for (const node of nodes) {
    if (!node?._id) continue;

    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    const isHome = isHomeContainer(node);

    if (!isHome) {
      result.push({ _id: String(node._id), name: node.name, level });
    }

    if (hasChildren) {
      result.push(
        ...flattenCategoryTree(node.children, isHome ? level : level + 1)
      );
    }
  }

  return result;
};

/**
 * Detect the synthetic "Home" root node that wraps all real categories.
 */
const isHomeContainer = (node) => {
  if (node.parentId) return false;
  if (!Array.isArray(node.children) || node.children.length === 0) return false;

  const name =
    typeof node.name === "string"
      ? node.name
      : node.name?.es || node.name?.en || "";

  return name.trim().toLowerCase() === "home";
};
