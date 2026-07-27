/**
 * @file file-center.storage.js
 * @description Storage Abstraction Layer for LOCAL, MINIO, and S3
 */

class StorageDriver {
  async upload(fileStream, metadata) { throw new Error('Not implemented'); }
  async download(path) { throw new Error('Not implemented'); }
  async delete(path) { throw new Error('Not implemented'); }
}

class LocalStorage extends StorageDriver {
  async upload(fileStream, metadata) {
    // TODO: Implement fs write stream to /opt/tcu-platform/uploads
  }
  async download(path) {
    // TODO: Implement fs read stream
  }
  async delete(path) {
    // TODO: Implement fs unlink for permanent purge
  }
}

class MinioStorage extends StorageDriver {
  async upload(fileStream, metadata) {
    // TODO: Implement aws-sdk S3 compatible upload to On-Premise MinIO
  }
  async download(path) {}
  async delete(path) {}
}

class S3Storage extends StorageDriver {
  async upload(fileStream, metadata) {
    // TODO: Implement aws-sdk upload to AWS S3 Cloud
  }
  async download(path) {}
  async delete(path) {}
}

module.exports = {
  StorageDriver,
  LocalStorage,
  MinioStorage,
  S3Storage
};
