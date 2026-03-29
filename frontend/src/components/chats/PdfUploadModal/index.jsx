import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button } from '../../ui';
import { Upload, X, FileText, Loader } from 'lucide-react';
import usePdfChat from '../../../hooks/usePdfChat';

const PdfUploadModal = ({ isOpen, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const {
    selectedFile,
    uploading,
    progress,
    processing,
    error,
    isLoading,
    handleFileSelect,
    removeFile,
    uploadAndCreateChat,
    reset,
  } = usePdfChat();

  // Reset hook state when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleRemoveFile = () => {
    removeFile();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const chat = await uploadAndCreateChat();

    // Close modal on success
    if (chat) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Upload PDF Document</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drag-drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          `}
          onClick={() => !isLoading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isLoading}
          />

          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium mb-2">
            Drag & drop your PDF here
          </p>
          <p className="text-sm text-gray-500 mb-4">
            or click to browse
          </p>
          <p className="text-xs text-gray-400">
            Maximum file size: 10MB
          </p>
        </div>

        {/* Selected file info */}
        {selectedFile && (
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="text-gray-400 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Uploading...</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Processing Status */}
        {processing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
            <Loader className="w-5 h-5 text-blue-600 animate-spin" />
            <p className="text-sm text-blue-600">Processing PDF... This may take a moment.</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isLoading}
            className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                {uploading ? 'Uploading...' : 'Processing...'}
              </>
            ) : (
              'Upload & Create Chat'
            )}
          </Button>
          <Button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:opacity-50"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PdfUploadModal;
