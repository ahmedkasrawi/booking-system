const { Service } = require("../models/Service");
const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");
const getData = require("../utils/getData");

const getServices = asyncWrapper(async (req, res, next) => {
  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.provider) {
    filter.provider = req.query.provider;
  }
  if (req.query.isActive) {
    filter.isActive = req.query.isActive === "true"; // Convert string to boolean
  }
  const populateOptions = { path: "provider", select: "name specialization" };
  const [data, pagination] = await getData(
    req,
    filter,
    Service,
    populateOptions,
  );

  res.status(200).json({
    status: "success",
    pagination: pagination,
    results: data.length,
    data: { services: data },
  });
});

const addService = asyncWrapper(async (req, res, next) => {
  req.body.provider = req.user.id;
  const service = await Service.create(req.body);
  res.status(201).json({ status: "success", data: { service } });
});

const getOneService = asyncWrapper(async (req, res, next) => {
  const service = await Service.findById(req.params.id, { __v: 0 }).populate(
    "provider",
    "name specialization bio",
  );
  if (!service) {
    return next(new appError("Service not found", 404));
  }
  res.status(200).json({ status: "success", data: { service } });
});

const updateService = asyncWrapper(async (req, res, next) => {
  if (req.body.provider) {
    delete req.body.provider;
  }
  let service = await Service.findById(req.params.id);
  if (!service) {
    return next(new appError("Service not found", 404));
  }
  if (
    service.provider.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(new appError("Not authorized to update this service", 403));
  }
  service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: "success", data: { service } });
});

const deleteService = asyncWrapper(async (req, res, next) => {
  let service = await Service.findById(req.params.id);
  if (!service) {
    return next(new appError("Service not found", 404));
  }
  if (
    service.provider.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(new appError("Not authorized to delete this service", 403));
  }
  service = await Service.findByIdAndDelete(req.params.id);

  res.status(200).json({ status: "success", data: null });
});

const toggleServiceStatus = asyncWrapper(async (req, res, next) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return next(new appError("Service not found", 404));
  }
  if (
    service.provider.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(new appError("Not authorized to toggle this service", 403));
  }
  service.isActive = !service.isActive;
  await service.save();
  res.status(200).json({
    status: "success",
    message: service.isActive
      ? "Service is now active"
      : "Service has been stopped",
    isActive: service.isActive,
    data: null,
  });
});

module.exports = {
  getServices,
  addService,
  getOneService,
  updateService,
  deleteService,
  toggleServiceStatus,
};
