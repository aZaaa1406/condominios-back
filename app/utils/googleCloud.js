import { Storage } from '@google-cloud/storage';
import { GCP } from '../config/config.js';

// Ruta absoluta al archivo JSON
const serviceAccount = JSON.parse(GCP || '{}');

const storage = new Storage({
  credentials: GCP,
  projectId: 'eventspace-442007' // lo encuentras en el archivo JSON
});

const bucketName = 'urbanite-documents'; 
const bucket = storage.bucket(bucketName);

export { bucket };
