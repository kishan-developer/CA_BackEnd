const express = require('express');
const router = express.Router();
const { handleChatMessage, getChatHistory, clearChatHistory } = require('../controller/chatbot.controller');

// Chatbot API routes
router.post('/message', handleChatMessage);
router.get('/history/:sessionId', getChatHistory);
router.delete('/history/:sessionId', clearChatHistory);

module.exports = router;
