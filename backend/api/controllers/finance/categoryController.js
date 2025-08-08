const asyncHandler = require("../../middleware/asyncHandler");
const categoryService = require("../../services/finance/categoryService");

const listCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.listCategories(
    req.user.id,
    req.query || {}
  );
  res.status(200).json(categories);
});

const createCategory = asyncHandler(async (req, res) => {
  const created = await categoryService.createCategory(req.user.id, req.body);
  res.status(201).json(created);
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await categoryService.updateCategory(
    req.user.id,
    id,
    req.body
  );
  res.status(200).json(updated);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await categoryService.deleteCategory(req.user.id, id);
  res.status(200).json({ id, message: "Category removed successfully" });
});

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
