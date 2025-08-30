import Certificate from '../models/Certificate.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createCertificate(req, res) {
  try {
    const { name, issuer, dateIssued, fileUrl, thumbnail } = req.body;
    if (!name || !issuer || !fileUrl) return res.status(400).json({ error: 'Missing required fields' });

    let thumbnailUrl = '';
    if (thumbnail) {
      const matches = thumbnail.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches.length !== 3) {
        return res.status(400).json({ error: 'Invalid thumbnail format' });
      }

      const imageBuffer = Buffer.from(matches[2], 'base64');
      const thumbnailFilename = `${Date.now()}-thumbnail.png`;
      const thumbnailPath = path.join(__dirname, '..', '..', 'uploads', thumbnailFilename);
      fs.writeFileSync(thumbnailPath, imageBuffer);
      thumbnailUrl = `/uploads/${thumbnailFilename}`;
    }

    const doc = await Certificate.create({
      userId: req.user.id,
      name,
      issuer,
      dateIssued,
      fileUrl,
      thumbnailUrl,
    });
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function listCertificates(req, res) {
  try {
    const docs = await Certificate.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function listPublicCertificates(req, res) {
  try {
    const { userId } = req.params;
    console.log('Fetching public certificates for userId:', userId);
    const docs = await Certificate.find({ userId }).sort({ createdAt: -1 });
    console.log('Found certificates:', docs);
    res.json(docs);
  } catch (e) {
    console.error('Error in listPublicCertificates:', e);
    res.status(500).json({ error: e.message });
  }
}

export async function deleteCertificate(req, res) {
  try {
    const { id } = req.params;
    // Ensure the user owns the certificate before deleting
    const cert = await Certificate.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!cert) {
      return res.status(404).json({ error: 'Certificate not found or not owned by user' });
    }
    res.json({ message: 'Certificate deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}


