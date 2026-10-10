import prisma from '../config/prisma.js';

export async function listAdminMessages({ page = 1, limit = 20, status, search }) {
  const skip = (page - 1) * limit;
  const where = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { subject: { contains: search, mode: 'insensitive' } },
      { message: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, messages] = await Promise.all([
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        message: true,
        status: true,
        emailSent: true,
        emailError: true,
        adminNotes: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return {
    messages,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}

export async function getAdminMessageById(id) {
  const message = await prisma.contactMessage.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      subject: true,
      message: true,
      status: true,
      ipAddress: true,
      userAgent: true,
      emailSent: true,
      emailError: true,
      adminNotes: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return message;
}

export async function updateAdminMessage(id, { status, adminNotes }) {
  const data = {};
  if (status) data.status = status;
  if (typeof adminNotes === 'string') data.adminNotes = adminNotes;

  const updated = await prisma.contactMessage.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      subject: true,
      message: true,
      status: true,
      emailSent: true,
      adminNotes: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updated;
}

export async function deleteAdminMessage(id) {
  const deleted = await prisma.contactMessage.delete({
    where: { id },
    select: {
      id: true,
    },
  });

  return deleted;
}

