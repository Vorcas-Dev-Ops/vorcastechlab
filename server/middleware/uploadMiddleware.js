import multer from 'multer';

// Use memory storage for transient asset handling. 
// Files are temporarily held in RAM before being streamed to Cloudinary for permanent storage.
const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 10 * 1024 * 1024, // 10MB per file
        fieldSize: 50 * 1024 * 1024  // 50MB per text field (Essential for Base64 gallery)
    } 
});

export default upload;
