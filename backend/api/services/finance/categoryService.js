const FinanceCategory = require("../../models/finance/categoryModel");

const listCategories = async (userId, query = {}) => {
  const filter = { user: userId };
  if (query.type) filter.type = query.type;
  return await FinanceCategory.find(filter).sort({ name: 1 });
};

const createCategory = async (userId, data) => {
  const { name, type, icon, color } = data;
  return await FinanceCategory.create({
    user: userId,
    name,
    type,
    icon,
    color,
  });
};

const updateCategory = async (userId, id, data) => {
  const category = await FinanceCategory.findOne({ _id: id, user: userId });
  if (!category) {
    const error = new Error("Category not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }
  Object.assign(category, data);
  await category.save();
  return category;
};

const deleteCategory = async (userId, id) => {
  const category = await FinanceCategory.findOne({ _id: id, user: userId });
  if (!category) {
    const error = new Error("Category not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }
  await category.deleteOne();
  return category;
};

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
