/**
 * @file file-center.controller.js
 * @description Express Route Handlers mapping HTTP requests to Service logic
 */
const service = require('./file-center.service');
const validator = require('./file-center.validator');

class FileCenterController {
  async upload(req, res, next) {
    try {
      // TODO: Handle req.file (Multer), validate, pass to service.uploadFile
      res.status(201).json({ message: 'FILE_UPLOADED' });
    } catch (error) {
      next(error);
    }
  }

  async getMetadata(req, res, next) {
    try {
      // TODO: Extract req.params.id, pass to service.getFileMetadata
      res.status(200).json({ data: 'MOCK_METADATA' });
    } catch (error) {
      next(error);
    }
  }

  async download(req, res, next) {
    try {
      // TODO: Pass to service.downloadFile, pipe stream to res
      res.status(200).send('STREAM_PLACEHOLDER');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      // TODO: Pass to service.deleteFile
      res.status(200).json({ message: 'FILE_DELETED' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FileCenterController();
