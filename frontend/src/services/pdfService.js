import { apiClient } from "./api/apiClient";

/**
 * PDF Service - Handles PDF upload, chat creation, and querying
 * 
 * Backend endpoints needed:
 * - POST /api/pdf/upload - Upload PDF file and create PDFDocument
 * - POST /api/chat/pdf/create - Create PDF chat with AI user
 * - POST /api/pdf/query - Query PDF with RAG pipeline
 */

export const pdfService = {
  /**
   * Upload PDF file to backend
   * @param {File} file - PDF file object
   * @param {Function} onProgress - Callback for upload progress (0-100)
   * @returns {Promise<Object>} - { pdfDocumentId, pdfUrl, fileName, fileSize }
   */
  async uploadPdf(file, onProgress) {
    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const { data } = await apiClient.post('/pdf/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(progress);
        },
      });

      return data.data;
    } catch (error) {
      console.error("Failed to upload PDF:", error);
      throw error?.response?.data || new Error("Failed to upload PDF");
    }
  },

  /**
   * Create a new PDF chat
   * @param {string} pdfDocumentId - ID of the uploaded PDF document
   * @returns {Promise<Object>} - Full chat object with PDF metadata
   */
  async createPdfChat(pdfDocumentId) {
    try {
      const { data } = await apiClient.post('/chat/pdf/create', {
        pdfDocumentId,
      });

      return data.data;
    } catch (error) {
      console.error("Failed to create PDF chat:", error);
      throw error?.response?.data || new Error("Failed to create PDF chat");
    }
  },

  /**
   * Query PDF with a question (triggers RAG pipeline) - Non-streaming version
   * @param {string} chatId - Chat ID
   * @param {string} question - User's question
   * @returns {Promise<Object>} - AI response message
   */
  async queryPdf(chatId, question) {
    try {
      const { data } = await apiClient.post('/pdf/query', {
        chatId,
        question,
      });

      return data.data;
    } catch (error) {
      console.error("Failed to query PDF:", error);
      throw error?.response?.data || new Error("Failed to query PDF");
    }
  },

  /**
   * Query PDF with streaming response (Server-Sent Events)
   * @param {string} chatId - Chat ID
   * @param {string} question - User's question
   * @param {Object} callbacks - Event callbacks
   * @param {Function} callbacks.onStart - Called when streaming starts with userMessage
   * @param {Function} callbacks.onChunk - Called for each text chunk
   * @param {Function} callbacks.onDone - Called when complete with aiMessage
   * @param {Function} callbacks.onError - Called on error
   * @param {AbortSignal} signal - Optional abort signal for cancellation
   * @returns {Promise<Object>} - Complete AI message object
   */
  async queryPdfStream(chatId, question, callbacks = {}, signal = null) {
    const { onStart, onChunk, onDone, onError } = callbacks;

    try {
      // Get auth token from localStorage
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      
      const response = await fetch(`${apiClient.defaults.baseURL}/pdf/query?stream=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ chatId, question }),
        signal, // Support for aborting the request
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let completeMessage = null;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        // Decode the chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE messages (ending with \n\n)
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep incomplete message in buffer

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data: ')) continue;

          try {
            // Extract JSON from "data: {...}"
            const jsonStr = line.substring(6); // Remove "data: " prefix
            const event = JSON.parse(jsonStr);

            switch (event.type) {
              case 'start':
                onStart?.(event.userMessage);
                break;
              
              case 'chunk':
                onChunk?.(event.content);
                break;
              
              case 'done':
                completeMessage = event.aiMessage;
                onDone?.(event.aiMessage);
                break;
              
              case 'error':
                const error = new Error(event.message || 'Streaming error');
                onError?.(error);
                throw error;
              
              default:
                console.warn('Unknown SSE event type:', event.type);
            }
          } catch (parseError) {
            console.error('Failed to parse SSE event:', line, parseError);
          }
        }
      }

      return completeMessage;
    } catch (error) {
      console.error("Failed to query PDF with streaming:", error);
      onError?.(error);
      throw error;
    }
  },

  /**
   * Upload PDF and create chat in one flow
   * @param {File} file - PDF file object
   * @param {Function} onProgress - Callback for upload progress
   * @returns {Promise<Object>} - Full chat object
   */
  async uploadAndCreateChat(file, onProgress) {
    try {
      // Step 1: Upload PDF
      const pdfDocument = await this.uploadPdf(file, onProgress);

      // Step 2: Create PDF chat
      const chat = await this.createPdfChat(pdfDocument.pdfDocumentId);

      return chat;
    } catch (error) {
      console.error("Failed to upload and create chat:", error);
      throw error;
    }
  },
};
