/**
 * @file file-center.routes.js
 * @description API Endpoints routing and Middleware attachments for File Center
 */
const express = require('express');
const router = express.Router();
const controller = require('./file-center.controller');

// MOCK: RBAC Middlewares (To be imported from Auth module later)
const authMiddleware = (req, res, next) => next(); 
const checkPermission = (perm) => (req, res, next) => next();
// const uploadMiddleware = multer({ ... }) 

// POST /files/upload
// Requires Authentication and 'file.upload' permission
router.post('/upload', authMiddleware, checkPermission('file.upload'), controller.upload);

// GET /files/:id
// Requires Authentication for sensitive files (Service handles Visibility logic)
router.get('/:id', authMiddleware, checkPermission('file.read'), controller.getMetadata);

// GET /files/download/:id
// Download endpoint (Public access depends on 'isPublic' flag in DB, evaluated in Service)
router.get('/download/:id', controller.download);

// DELETE /files/:id
// Requires 'file.delete' permission. Service enforces Ownership vs Admin bypass
router.delete('/:id', authMiddleware, checkPermission('file.delete'), controller.delete);

module.exports = router;
