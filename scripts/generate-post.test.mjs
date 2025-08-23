import { generatePost } from './generate-post.mjs';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

// Mock GoogleGenerativeAI
jest.mock('@google/genai', () => {
  const mockText = JSON.stringify({
    filename: 'test-post.md',
    title: 'Test Post Title',
    date: '2025-08-23',
    tags: ['test', 'mock', 'gemini'],
    content: 'This is the content of the test post.'
  });

  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: { // <--- New: models submodule
          generateContent: jest.fn().mockResolvedValue({
            text: mockText // <--- New: text is a property, not a method
          })
        }
      };
    })
  };
});

// Mock fs.writeFileSync
jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // Import and retain default behavior
  writeFileSync: jest.fn(),
}));

describe('generatePost', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset process.env for each test
    process.env = {
      ...originalEnv,
      GEMINI_API_KEY: 'test-api-key',
      ISSUE_TITLE: 'Test Issue Title',
      ISSUE_BODY: 'Test Issue Body'
    };
  });

  afterAll(() => {
    process.env = originalEnv; // Restore original process.env
  });

  test('should generate a post successfully', async () => {
    await generatePost();

    // Check if GoogleGenerativeAI was called with the API key
    expect(GoogleGenAI).toHaveBeenCalledWith({ apiKey: 'test-api-key' });

    // Check if generateContent was called
    const mockGoogleGenAIInstance = GoogleGenAI.mock.results[0].value;
    
    expect(mockGoogleGenAIInstance.models.generateContent).toHaveBeenCalledTimes(1);

    // Check if fs.writeFileSync was called with the correct content
    const expectedFilePath = path.join(process.cwd(), 'posts', 'test-post.md');
    const expectedContent = `---\ntitle: Test Post Title
date: 2025-08-23
tags: [test, mock, gemini]
---\n\nThis is the content of the test post.`;

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(expectedFilePath, expectedContent);
  });

  test('should throw an error if GEMINI_API_KEY is not set', async () => {
    delete process.env.GEMINI_API_KEY;
    await expect(generatePost()).rejects.toThrow('GEMINI_API_KEY is not set');
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  test('should throw an error if ISSUE_TITLE is not set', async () => {
    delete process.env.ISSUE_TITLE;
    await expect(generatePost()).rejects.toThrow('ISSUE_TITLE or ISSUE_BODY is not set');
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  test('should throw an error if ISSUE_BODY is not set', async () => {
    delete process.env.ISSUE_BODY;
    await expect(generatePost()).rejects.toThrow('ISSUE_TITLE or ISSUE_BODY is not set');
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  test('should throw an error if AI response is invalid JSON', async () => {
    // Mock the AI to return invalid JSON
    GoogleGenAI.mockImplementationOnce(() => {
      return {
        models: {
          generateContent: jest.fn().mockResolvedValue({
            text: 'invalid json' // text is a property, not a method
          })
        }
      };
    });

    await expect(generatePost()).rejects.toThrow('Invalid JSON response from AI.');
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });
});
