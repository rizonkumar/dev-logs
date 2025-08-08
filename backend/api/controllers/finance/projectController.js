const asyncHandler = require("../../middleware/asyncHandler");
const projectService = require("../../services/finance/projectService");

const listProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.listProjects(req.user.id);
  res.status(200).json(projects);
});

const createProject = asyncHandler(async (req, res) => {
  const created = await projectService.createProject(req.user.id, req.body);
  res.status(201).json(created);
});

const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await projectService.updateProject(req.user.id, id, req.body);
  res.status(200).json(updated);
});

const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await projectService.deleteProject(req.user.id, id);
  res.status(200).json({ id, message: "Project removed successfully" });
});

const getProfitability = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await projectService.getProjectProfitability(req.user.id, id);
  res.status(200).json(result);
});

module.exports = {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  getProfitability,
};
