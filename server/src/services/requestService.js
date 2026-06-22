import Request from '../models/Request.js';
import StatusHistory from '../models/StatusHistory.js';
import { AppError } from '../utils/AppError.js';

export const createRequest = async (title, description, category, owner) => {
  const request = new Request({
    title,
    description,
    category,
    owner,
    status: 'New'
  });
  await request.save();
  return request.populate('owner category');
};

export const getRequestById = async (id) => {
  return Request.findById(id).populate('owner category');
};

export const getUserRequests = async (userId, filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const query = { owner: userId };

  if (filters.status) query.status = filters.status;
  if (filters.category) query.category = filters.category;
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } }
    ];
  }
  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
    if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
  }

  const requests = await Request.find(query)
    .populate('owner category')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const total = await Request.countDocuments(query);
  return { requests, total, pages: Math.ceil(total / limit) };
};

export const getAllRequests = async (filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const query = {};

  if (filters.status) query.status = filters.status;
  if (filters.category) query.category = filters.category;
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } }
    ];
  }
  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
    if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
  }

  const requests = await Request.find(query)
    .populate('owner category')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const total = await Request.countDocuments(query);
  return { requests, total, pages: Math.ceil(total / limit) };
};

export const updateRequest = async (id, updates, userId) => {
  const request = await Request.findById(id);
  if (!request) throw new AppError('Request not found', 404);
  if (request.owner.toString() !== userId) throw new AppError('Not authorized', 403);
  if (request.status !== 'New') throw new AppError('Can only edit requests with status "New"', 403);

  Object.assign(request, updates);
  request.updatedAt = new Date();
  await request.save();
  return request.populate('owner category');
};

export const deleteRequest = async (id, userId) => {
  const request = await Request.findById(id);
  if (!request) throw new AppError('Request not found', 404);
  if (request.owner.toString() !== userId) throw new AppError('Not authorized', 403);
  if (request.status !== 'New') throw new AppError('Can only delete requests with status "New"', 403);

  await Request.deleteOne({ _id: id });
};

export const changeStatus = async (id, newStatus, adminId) => {
  const request = await Request.findById(id);
  if (!request) throw new AppError('Request not found', 404);

  const oldStatus = request.status;
  request.status = newStatus;
  request.updatedAt = new Date();
  await request.save();

  // Record status change
  const history = new StatusHistory({
    requestId: id,
    oldStatus,
    newStatus,
    changedBy: adminId
  });
  await history.save();

  return request.populate('owner category');
};

export const getStatusHistory = async (requestId) => {
  return StatusHistory.find({ requestId }).populate('changedBy').sort({ changedAt: -1 });
};

export const getStatistics = async () => {
  const stats = await Request.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    total: 0,
    byStatus: {}
  };
  stats.forEach(stat => {
    result.byStatus[stat._id] = stat.count;
    result.total += stat.count;
  });

  return result;
};
