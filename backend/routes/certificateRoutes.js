import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createCertificate, listCertificates, deleteCertificate, listPublicCertificates } from '../src/controllers/certificateController.js';

const router = express.Router();



router.get('/hello', (req, res) => res.send('Hello from certificate routes!'));
router.get('/', authMiddleware, listCertificates);
router.post('/', authMiddleware, createCertificate);
router.get('/user/:userId', listPublicCertificates);
router.delete('/:id', authMiddleware, deleteCertificate);

export default router;


