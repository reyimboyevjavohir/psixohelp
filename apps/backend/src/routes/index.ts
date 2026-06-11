import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, logout, refresh, me } from '../controllers/auth.controller.js';
import {
  dashboard, listUsers, updateUserRole, toggleUserActive, resetUserPassword,
  createPsychologist, updatePsychologist, deletePsychologist,
  createBook, updateBook, deleteBook,
  createResource, updateResource, deleteResource,
  createTest, updateTest, deleteTest,
  listBookings, updateBookingStatus,
} from '../controllers/admin.controller.js';
import {
  listCategories, listPsychologists, getPsychologist,
  listBooks, listResources, updateProfile,
} from '../controllers/other.controller.js';
import { createBooking, myBookings, cancelBooking } from '../controllers/booking.controller.js';
import { listTests, getTest, submitTest, myResults } from '../controllers/test.controller.js';
import { getAiAdvice } from '../controllers/ai.controller.js';
import { getMoodEntries, createMoodEntry } from '../controllers/mood.controller.js';
import { requireAuth, requireAdmin, requireSuperAdmin, requirePsychologist } from '../middleware/auth.middleware.js';
import { getMyProfile, updateMySchedule, updateMyContact, listMyAdvices, createMyAdvice, deleteMyAdvice } from '../controllers/psychologist.controller.js';
import { validateBody } from '../middleware/validate.middleware.js';
import {
  registerSchema, loginSchema, refreshSchema, createBookingSchema,
  upsertPsychologistSchema, upsertBookSchema, upsertResourceSchema, upsertTestSchema,
  updateRoleSchema, updateBookingStatusSchema, resetPasswordSchema, updateProfileSchema,
} from '../validators/index.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => res.json({ success: true, message: 'Backend ishlayapti ✅' }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { success: false, message: "Juda ko'p urinish. 15 daqiqadan keyin qaytadan urining." } });
apiRouter.post('/auth/register', authLimiter, validateBody(registerSchema), register);
apiRouter.post('/auth/login', authLimiter, validateBody(loginSchema), login);
apiRouter.post('/auth/refresh', validateBody(refreshSchema), refresh);
apiRouter.post('/auth/logout', logout);
apiRouter.get('/auth/me', requireAuth, me);

apiRouter.get('/categories', listCategories);
apiRouter.get('/psychologists', listPsychologists);
apiRouter.get('/psychologists/:slug', getPsychologist);
apiRouter.get('/books', listBooks);
apiRouter.get('/resources', listResources);
apiRouter.get('/tests', listTests);
apiRouter.get('/tests/:slug', getTest);

const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 20, message: { success: false, message: "Juda ko'p so'rov. 1 daqiqadan keyin qaytadan urining." } });
apiRouter.post('/ai/advice', aiLimiter, getAiAdvice);

apiRouter.patch('/profile', requireAuth, validateBody(updateProfileSchema), updateProfile);
apiRouter.get('/bookings/my', requireAuth, myBookings);
apiRouter.post('/bookings', requireAuth, validateBody(createBookingSchema), createBooking);
apiRouter.patch('/bookings/:id/cancel', requireAuth, cancelBooking);
apiRouter.get('/tests/my/results', requireAuth, myResults);
apiRouter.post('/tests/:slug/submit', requireAuth, submitTest);

apiRouter.get('/admin/dashboard', requireAuth, requireAdmin, dashboard);
apiRouter.get('/admin/bookings', requireAuth, requireAdmin, listBookings);
apiRouter.patch('/admin/bookings/:id/status', requireAuth, requireAdmin, validateBody(updateBookingStatusSchema), updateBookingStatus);
apiRouter.post('/admin/psychologists', requireAuth, requireAdmin, validateBody(upsertPsychologistSchema), createPsychologist);
apiRouter.patch('/admin/psychologists/:id', requireAuth, requireAdmin, validateBody(upsertPsychologistSchema.partial()), updatePsychologist);
apiRouter.delete('/admin/psychologists/:id', requireAuth, requireAdmin, deletePsychologist);
apiRouter.post('/admin/books', requireAuth, requireAdmin, validateBody(upsertBookSchema), createBook);
apiRouter.patch('/admin/books/:id', requireAuth, requireAdmin, validateBody(upsertBookSchema.partial()), updateBook);
apiRouter.delete('/admin/books/:id', requireAuth, requireAdmin, deleteBook);
apiRouter.post('/admin/resources', requireAuth, requireAdmin, validateBody(upsertResourceSchema), createResource);
apiRouter.patch('/admin/resources/:id', requireAuth, requireAdmin, validateBody(upsertResourceSchema.partial()), updateResource);
apiRouter.delete('/admin/resources/:id', requireAuth, requireAdmin, deleteResource);
apiRouter.post('/admin/tests', requireAuth, requireAdmin, validateBody(upsertTestSchema), createTest);
apiRouter.patch('/admin/tests/:id', requireAuth, requireAdmin, validateBody(upsertTestSchema.partial()), updateTest);
apiRouter.delete('/admin/tests/:id', requireAuth, requireAdmin, deleteTest);

apiRouter.get('/superadmin/users', requireAuth, requireSuperAdmin, listUsers);
apiRouter.patch('/superadmin/users/:id/role', requireAuth, requireSuperAdmin, validateBody(updateRoleSchema), updateUserRole);
apiRouter.patch('/superadmin/users/:id/toggle-active', requireAuth, requireSuperAdmin, toggleUserActive);
apiRouter.patch('/superadmin/users/:id/reset-password', requireAuth, requireSuperAdmin, validateBody(resetPasswordSchema), resetUserPassword);

apiRouter.get('/mood', requireAuth, getMoodEntries);
apiRouter.post('/mood', requireAuth, createMoodEntry);

// Psychologist routes
apiRouter.get('/psixolog/profile', requireAuth, requirePsychologist, getMyProfile);
apiRouter.patch('/psixolog/schedule', requireAuth, requirePsychologist, updateMySchedule);
apiRouter.patch('/psixolog/contact', requireAuth, requirePsychologist, updateMyContact);
apiRouter.get('/psixolog/advices', requireAuth, requirePsychologist, listMyAdvices);
apiRouter.post('/psixolog/advices', requireAuth, requirePsychologist, createMyAdvice);
apiRouter.delete('/psixolog/advices/:id', requireAuth, requirePsychologist, deleteMyAdvice);
