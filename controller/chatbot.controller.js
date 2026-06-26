const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatHistory = require('../model/ChatHistory.model');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });

const systemPrompt = `You are VyaparSewa's AI assistant, a helpful CA firm in India. 
Your role is to:
- Answer questions about taxation, GST, compliance, and business registration
- Provide accurate information about services
- Be professional, friendly, and concise
- Escalate complex issues to human support
- Never provide legal or financial advice, always suggest consulting a CA

Available services: Company Registration, GST Registration, Income Tax Filing, 
Auditing, MCA Services, Start Up support, Loan assistance, Advisory services.

Contact information:
- Phone: +91 98765 43210
- Email: info@vyaparsewa.com
- WhatsApp: +91 98765 43210`;

async function handleChatMessage(req, res) {
  const { message, userId, sessionId, context } = req.body;
  
  try {
    // Get conversation history
    let conversation = await ChatHistory.findOne({ sessionId });
    
    if (!conversation) {
      conversation = await ChatHistory.create({
        userId,
        sessionId,
        messages: [],
        context: context || {}
      });
    }
    
    // Add user message to history
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });
    
    // Build conversation history for context
    const history = conversation.messages.slice(-6).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    // Start chat with history
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });
    
    // Send message with system prompt
    const prompt = `${systemPrompt}\n\nUser: ${message}`;
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const aiResponse = response.text();
    
    // Add AI response to history
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });
    
    await conversation.save();
    
    res.json({
      success: true,
      response: aiResponse,
      sessionId: conversation.sessionId
    });
    
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message',
      error: error.message
    });
  }
}

async function getChatHistory(req, res) {
  try {
    const { sessionId } = req.params;
    const conversation = await ChatHistory.findOne({ sessionId });
    
    if (!conversation) {
      return res.json({
        success: true,
        messages: []
      });
    }
    
    res.json({
      success: true,
      messages: conversation.messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat history'
    });
  }
}

async function clearChatHistory(req, res) {
  try {
    const { sessionId } = req.params;
    await ChatHistory.deleteOne({ sessionId });
    
    res.json({
      success: true,
      message: 'Chat history cleared'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear chat history'
    });
  }
}

module.exports = {
  handleChatMessage,
  getChatHistory,
  clearChatHistory
};
