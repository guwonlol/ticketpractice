import * as requestService from '../services/requestService.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { validationResult } from 'express-validator';

export const createRequest = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, category } = req.body;
  const request = await requestService.createRequest(title, description, category, req.user.id);
  res.status(201).json(request);
});

export const getRequest = asyncHandler(async (req, res) => {
  const request = await requestService.getRequestById(req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });

  const ownerId = request.owner._id
    ? request.owner._id.toString()
    : request.owner.toString();
  if (req.user.role !== 'admin' && ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  res.json(request);
});

export const getMyRequests = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const filters = {
    status: req.query.status,
    category: req.query.category,
    search: req.query.search,
    startDate: req.query.startDate,
    endDate: req.query.endDate
  };
  const result = await requestService.getUserRequests(req.user.id, filters, page, limit);
  res.json(result);
});

export const getAllRequests = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const filters = {
    status: req.query.status,
    category: req.query.category,
    search: req.query.search,
    startDate: req.query.startDate,
    endDate: req.query.endDate
  };
  const result = await requestService.getAllRequests(filters, page, limit);
  res.json(result);
});

export const updateRequest = asyncHandler(async (req, res) => {
  const request = await requestService.updateRequest(req.params.id, req.body, req.user.id);
  res.json(request);
});

export const deleteRequest = asyncHandler(async (req, res) => {
  await requestService.deleteRequest(req.params.id, req.user.id);
  res.json({ message: 'Request deleted' });
});

export const changeStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const request = await requestService.changeStatus(req.params.id, status, req.user.id);
  res.json(request);
});

export const getStatusHistory = asyncHandler(async (req, res) => {
  const request = await requestService.getRequestById(req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });

  const ownerId = request.owner._id
    ? request.owner._id.toString()
    : request.owner.toString();
  if (req.user.role !== 'admin' && ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const history = await requestService.getStatusHistory(req.params.id);
  res.json(history);
});

export const getStatistics = asyncHandler(async (req, res) => {
  const stats = await requestService.getStatistics();
  res.json(stats);
});
