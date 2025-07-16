import { Storage } from '@google-cloud/storage';
import { GCS } from '../config/config.js';

// Ruta absoluta al archivo JSON
const serviceAccount = JSON.parse(GCS || '{}');


console.log(serviceAccount);
const storage = new Storage({
  credentials: serviceAccount,
  projectId: 'eventspace-442007' // lo encuentras en el archivo JSON
});

const bucketName = 'urbanite-documents'; 
const bucket = storage.bucket(bucketName);

export { bucket };
