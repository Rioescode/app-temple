import Anthropic from '@anthropic-ai/sdk';

export const initClaudeClient = (apiKey) => {
  return new Anthropic({
    apiKey: apiKey,
  });
};

export const generateResume = async (client, userInfo) => {
  try {
    const response = await client.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `Generate a professional resume in JSON format based on the following information: ${JSON.stringify(userInfo)}. 
        The resume should include sections for personal information, professional summary, work experience, education, skills, and achievements.`
      }]
    });
    
    return JSON.parse(response.content[0].text);
  } catch (error) {
    console.error('Error generating resume:', error);
    throw error;
  }
}; 