import { Storage } from '@google-cloud/storage';
import path from 'path';
import { fileURLToPath } from 'url';

// Ruta absoluta al archivo JSON
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyPath = path.join(__dirname, '../service-account.json');

const storage = new Storage({
  keyFilename: keyPath,
  projectId: 'eventspace-442007' // lo encuentras en el archivo JSON
});

const bucketName = 'urbanite-documents'; 
const bucket = storage.bucket(bucketName);

export { bucket };
