import { authenticateAdmin } from '../services/auth.service.js';
import {
  listAdminMessages,
  getAdminMessageById,
  updateAdminMessage,
  deleteAdminMessage,
} from '../services/admin.service.js';

export async function adminLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const authResult = await authenticateAdmin({ email, password });

    res.json({
      success: true,
      message: 'Login successful',
      token: authResult.token,
      admin: authResult.admin,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminProfile(req, res) {
  res.json({
    success: true,
    admin: req.admin,
  });
}

export async function getMessages(req, res, next) {
  try {
    const { page, limit, status, search } = req.query;
    const result = await listAdminMessages({ page, limit, status, search });

    res.json({
      success: true,
      data: result.messages,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMessage(req, res, next) {
  try {
    const { id } = req.params;
    const message = await getAdminMessageById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: `Message with ID '${id}' not found`,
      });
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMessage(req, res, next) {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const updated = await updateAdminMessage(id, { status, adminNotes });

    res.json({
      success: true,
      message: 'Message status updated',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMessage(req, res, next) {
  try {
    const { id } = req.params;
    await deleteAdminMessage(id);

    res.json({
      success: true,
      message: 'Message deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
}

