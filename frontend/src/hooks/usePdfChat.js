import { useState, useCallback } from 'react';
import { pdfService } from '../services/pdfService';
import { ChatState } from '../Context/chatProvider';

/**
 * Custom hook for managing PDF chat functionality
 * Handles PDF upload, validation, chat creation, and error states
 */
const usePdfChat = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const { setChats, setSelectedChat } = ChatState();

  /**
   * Validate PDF file
   * @param {File} file - File to validate
   * @returns {Object} - { valid: boolean, error: string }
   */
  const validateFile = useCallback((file) => {
    // Check file type
    if (file.type !== 'application/pdf') {
      return { valid: false, error: 'Please select a PDF file' };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { valid: false, error: 'PDF size must be less than 10MB' };
    }

    return { valid: true };
  }, []);

  /**
   * Handle file selection
   * @param {File} file - Selected file
   */
  const handleFileSelect = useCallback((file) => {
    const validation = validateFile(file);

    if (!validation.valid) {
      setError(validation.error);
      setSelectedFile(null);
      return false;
    }

    setError(null);
    setSelectedFile(file);
    return true;
  }, [validateFile]);

  /**
   * Remove selected file
   */
  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    setProgress(0);
  }, []);

  /**
   * Upload PDF and create chat
   * @returns {Promise<Object>} - Created chat object
   */
  const uploadAndCreateChat = useCallback(async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return null;
    }

    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      // Upload PDF with progress tracking
      const chat = await pdfService.uploadAndCreateChat(
        selectedFile,
        (progressValue) => {
          setProgress(progressValue);
        }
      );

      // Show processing state while backend processes PDF
      setUploading(false);
      setProcessing(true);

      // Add new chat to chat list (at the top)
      setChats((prevChats) => {
        // Check if chat already exists
        const existingChat = prevChats?.find((c) => c._id === chat._id);
        if (existingChat) return prevChats;

        // Add new chat at the beginning
        return [chat, ...(prevChats || [])];
      });

      // Select the new PDF chat
      setSelectedChat(chat);

      // Reset states
      setProcessing(false);
      setProgress(100);
      setSelectedFile(null);

      return chat;
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload PDF. Please try again.');
      setUploading(false);
      setProcessing(false);
      return null;
    }
  }, [selectedFile, setChats, setSelectedChat]);

  /**
   * Reset all states
   */
  const reset = useCallback(() => {
    setSelectedFile(null);
    setUploading(false);
    setProgress(0);
    setProcessing(false);
    setError(null);
  }, []);

  return {
    // State
    selectedFile,
    uploading,
    progress,
    processing,
    error,
    isLoading: uploading || processing,

    // Methods
    handleFileSelect,
    removeFile,
    uploadAndCreateChat,
    reset,
  };
};

export default usePdfChat;
