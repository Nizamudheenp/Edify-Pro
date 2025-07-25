const multer = require('multer');
const path = require('path');

// assignments
const assignmentFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and DOC/DOCX files are allowed'), false);
    }
};

// thumbnail
const imageFilter = (req, file, cb) => {
    const allowedTypes = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, JPEG, and PNG images are allowed'), false);
    }
};

const storage = multer.diskStorage({});

const uploadAssignment = multer({ storage, fileFilter: assignmentFilter });
const uploadImage = multer({ storage, fileFilter: imageFilter });

module.exports = {
    uploadAssignment,
    uploadImage
};
