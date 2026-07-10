import { describe, it, expect } from 'vitest';
import { normalizePrompt } from '../../src/pipeline/normalize.js';

describe('Pipeline - Normalize', () => {
  it('should trim whitespace from prompt', () => {
    const input = '  Tell me about Vault  ';
    const result = normalizePrompt(input);
    expect(result).toBe('Tell me about Vault');
  });

  it('should collapse multiple spaces', () => {
    const input = 'Tell  me    about     Vault';
    const result = normalizePrompt(input);
    expect(result).toBe('Tell me about Vault');
  });

  it('should handle empty string', () => {
    const input = '';
    const result = normalizePrompt(input);
    expect(result).toBe('');
  });

  it('should handle string with only whitespace', () => {
    const input = '   \n\t  ';
    const result = normalizePrompt(input);
    expect(result).toBe('');
  });

  it('should preserve single spaces', () => {
    const input = 'Tell me about Vault';
    const result = normalizePrompt(input);
    expect(result).toBe('Tell me about Vault');
  });

  it('should normalize line breaks to spaces', () => {
    const input = 'Tell me\nabout\nVault';
    const result = normalizePrompt(input);
    expect(result).toContain('Tell me');
    expect(result).toContain('about');
    expect(result).toContain('Vault');
  });
});

// Made with Bob
