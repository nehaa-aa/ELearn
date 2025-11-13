const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

router.post('/chat', async (req, res) => {
  const { message, context, courseContent } = req.body;
  
  if(!OPENAI_API_KEY) {
    return res.json({
      reply: `AI Tutor: I received your question about "${message}". ${context ? `Based on ${context}, ` : ''}I can help explain concepts, clarify doubts, and guide you through learning. (Note: OpenAI API key not configured)`
    });
  }
  
  try {
    // Real OpenAI integration would go here
    // For now, return intelligent stub
    const reply = `AI Tutor: Great question about "${message}"! ${
      courseContent 
        ? `Based on the course material, here's what you need to know: [AI-generated explanation would appear here]` 
        : 'Let me help you understand this concept step by step.'
    }`;
    
    res.json({ reply });
  } catch(e) {
    console.error(e);
    res.status(500).json({message: 'AI service error'});
  }
});

router.post('/generate-quiz', async (req, res) => {
  const { topic, difficulty, questionCount } = req.body;
  
  // AI-generated quiz stub
  const questions = Array.from({length: questionCount || 5}, (_, i) => ({
    question: `Question ${i+1}: What is the key concept of ${topic}?`,
    type: 'mcq',
    choices: ['Option A', 'Option B', 'Option C', 'Option D'],
    answer: 0
  }));
  
  res.json({
    title: `AI-Generated Quiz: ${topic}`,
    difficulty: difficulty || 'medium',
    questions,
    generatedByAI: true
  });
});