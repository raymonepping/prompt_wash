import { describe, it, expect, vi } from 'vitest';
import {
  validateRequiredString,
  validateWorkspaceAnalyze,
  validateWorkspaceRun,
  validateExperimentRun,
  sanitizeInput,
} from '../../api/middleware/validation.js';

describe('API Validation Middleware', () => {
  describe('validateRequiredString', () => {
    it('should pass validation for valid string', () => {
      const req = { body: { test: 'valid string' } };
      const res = {};
      const next = vi.fn();

      validateRequiredString('test')(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should fail validation for empty string', () => {
      const req = { body: { test: '' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const next = vi.fn();

      validateRequiredString('test')(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail validation for missing field', () => {
      const req = { body: {} };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const next = vi.fn();

      validateRequiredString('test')(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateWorkspaceAnalyze', () => {
    it('should pass validation for valid raw_input', () => {
      const req = { body: { raw_input: 'Tell me about Vault' } };
      const res = {};
      const next = vi.fn();

      validateWorkspaceAnalyze(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should fail validation for empty raw_input', () => {
      const req = { body: { raw_input: '   ' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const next = vi.fn();

      validateWorkspaceAnalyze(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateWorkspaceRun', () => {
    it('should pass validation for valid request', () => {
      const req = {
        body: {
          prompt: 'Test prompt',
          provider: 'ollama',
          render_mode: 'generic',
        },
      };
      const res = {};
      const next = vi.fn();

      validateWorkspaceRun(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should fail validation for invalid provider', () => {
      const req = {
        body: {
          prompt: 'Test prompt',
          provider: 'invalid',
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const next = vi.fn();

      validateWorkspaceRun(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail validation for invalid render_mode', () => {
      const req = {
        body: {
          prompt: 'Test prompt',
          render_mode: 'invalid',
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const next = vi.fn();

      validateWorkspaceRun(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateExperimentRun', () => {
    it('should pass validation for valid request', () => {
      const req = {
        body: {
          prompt: 'Test prompt',
          variants: ['generic', 'compact'],
        },
      };
      const res = {};
      const next = vi.fn();

      validateExperimentRun(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should fail validation for invalid variants', () => {
      const req = {
        body: {
          prompt: 'Test prompt',
          variants: ['generic', 'invalid'],
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const next = vi.fn();

      validateExperimentRun(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('sanitizeInput', () => {
    it('should remove null bytes from strings', () => {
      const req = {
        body: {
          test: 'string\0with\0nulls',
        },
      };
      const res = {};
      const next = vi.fn();

      sanitizeInput(req, res, next);

      expect(req.body.test).toBe('stringwithnulls');
      expect(next).toHaveBeenCalled();
    });

    it('should handle non-string values', () => {
      const req = {
        body: {
          number: 123,
          boolean: true,
          object: { key: 'value' },
        },
      };
      const res = {};
      const next = vi.fn();

      sanitizeInput(req, res, next);

      expect(req.body.number).toBe(123);
      expect(req.body.boolean).toBe(true);
      expect(next).toHaveBeenCalled();
    });
  });
});

// Made with Bob
