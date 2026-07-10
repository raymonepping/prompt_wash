/**
 * Request validation middleware for PromptWash API
 * Provides schema validation and input sanitization
 */

/**
 * Validate that a field exists and is a non-empty string
 */
export function validateRequiredString(fieldName) {
  return (req, res, next) => {
    const value = req.body?.[fieldName];
    
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({
        status: "error",
        error: {
          code: "VALIDATION_ERROR",
          message: `${fieldName} must be a non-empty string`,
          field: fieldName,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    }
    
    next();
  };
}

/**
 * Validate workspace analyze request
 */
export function validateWorkspaceAnalyze(req, res, next) {
  const { raw_input } = req.body ?? {};
  
  if (!raw_input || typeof raw_input !== "string" || raw_input.trim() === "") {
    return res.status(400).json({
      status: "error",
      error: {
        code: "VALIDATION_ERROR",
        message: "raw_input must be a non-empty string",
        field: "raw_input",
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  }
  
  next();
}

/**
 * Validate workspace run request
 */
export function validateWorkspaceRun(req, res, next) {
  const { prompt, provider, render_mode } = req.body ?? {};
  
  const errors = [];
  
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    errors.push({
      field: "prompt",
      message: "prompt must be a non-empty string",
    });
  }
  
  if (provider && !["ollama"].includes(provider)) {
    errors.push({
      field: "provider",
      message: "provider must be one of: ollama",
    });
  }
  
  if (render_mode && !["generic", "compact", "openai", "claude"].includes(render_mode)) {
    errors.push({
      field: "render_mode",
      message: "render_mode must be one of: generic, compact, openai, claude",
    });
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      status: "error",
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        errors,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  }
  
  next();
}

/**
 * Validate experiment run request
 */
export function validateExperimentRun(req, res, next) {
  const { prompt, variants } = req.body ?? {};
  
  const errors = [];
  
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    errors.push({
      field: "prompt",
      message: "prompt must be a non-empty string",
    });
  }
  
  if (variants && !Array.isArray(variants)) {
    errors.push({
      field: "variants",
      message: "variants must be an array",
    });
  }
  
  if (variants && Array.isArray(variants)) {
    const validVariants = ["generic", "compact", "openai", "claude"];
    const invalidVariants = variants.filter(v => !validVariants.includes(v));
    
    if (invalidVariants.length > 0) {
      errors.push({
        field: "variants",
        message: `Invalid variants: ${invalidVariants.join(", ")}. Must be one of: ${validVariants.join(", ")}`,
      });
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      status: "error",
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        errors,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  }
  
  next();
}

/**
 * Sanitize string input to prevent injection attacks
 */
export function sanitizeInput(req, res, next) {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === "string") {
        // Remove null bytes
        req.body[key] = req.body[key].replace(/\0/g, "");
      }
    });
  }
  
  next();
}

// Made with Bob
