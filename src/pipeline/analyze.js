function splitLines(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function isHeading(line) {
  return /^#{1,6}\s+/.test(line);
}

function isMarkdownLinkOnly(line) {
  return /^\[[^\]]+\]\([^)]+\)$/.test(line);
}

function isCommandLike(line) {
  return /^(npm |node |promptwash |pw |ollama )/.test(line);
}

function isBulletLine(line) {
  return /^(?:-|\*|\d+\.)\s+/.test(line);
}

function stripBullet(line) {
  return line.replace(/^(?:-|\*|\d+\.)\s+/, "").trim();
}

function normalizeSentence(sentence) {
  return sentence.replace(/\s+/g, " ").trim();
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((part) => normalizeSentence(part))
    .filter(Boolean);
}

function looksLikeConstraint(text) {
  return (
    /\bdo not\b/i.test(text) ||
    /\bmust\b/i.test(text) ||
    /\bshould\b/i.test(text) ||
    /\bwithout\b/i.test(text) ||
    /\bavoid\b/i.test(text) ||
    /\bno\b\s+\w+/i.test(text)
  );
}

function looksLikeOutputInstruction(text) {
  return (
    /\bjson\b/i.test(text) ||
    /\bmarkdown\b/i.test(text) ||
    /\btable\b/i.test(text) ||
    /\bbullet(?:ed)? list\b/i.test(text) ||
    /\bsummary\b/i.test(text)
  );
}

function looksLikeTaskSentence(text) {
  return /^(explain|write|summarize|compare|generate|create|list|describe|analyze|review|refactor|translate)\b/i.test(
    text,
  );
}

function looksLikeAudienceSentence(text) {
  return (
    /\bfor executives?\b/i.test(text) ||
    /\bfor developers?\b/i.test(text) ||
    /\bfor engineers?\b/i.test(text) ||
    /\bfor beginners?\b/i.test(text) ||
    /\bfor students?\b/i.test(text) ||
    /\baudience\b/i.test(text)
  );
}

function looksLikePromptDocument(text) {
  const lines = splitLines(text);

  const headingCount = lines.filter(isHeading).length;
  const bulletCount = lines.filter(isBulletLine).length;
  const commandCount = lines.filter(isCommandLike).length;

  return headingCount >= 2 || bulletCount >= 6 || commandCount >= 3;
}

export function detectAudience(text) {
  const lower = text.toLowerCase();

  if (looksLikePromptDocument(text)) {
    return "general";
  }

  if (/\bexecutives?\b|\bcxo\b|\bleadership\b/.test(lower)) {
    return "executives";
  }

  if (/\bdevelopers?\b|\bengineers?\b|\bdevops\b/.test(lower)) {
    return "developers";
  }

  if (/\bbeginners?\b|\bstarters?\b|\bnewcomers?\b/.test(lower)) {
    return "beginners";
  }

  if (/\bstudents?\b/.test(lower)) {
    return "students";
  }

  return "general";
}

export function detectTone(text) {
  const lower = text.toLowerCase();

  if (/\bformal\b|\bprofessional\b|\bexecutive\b/.test(lower)) {
    return "professional";
  }

  if (/\bfriendly\b|\bcasual\b/.test(lower)) {
    return "friendly";
  }

  return "neutral";
}

export function detectLanguage(text) {
  const lower = text.toLowerCase();

  if (/\bde\b|\bhet\b|\been\b|\bniet\b/.test(lower)) {
    return "nl";
  }

  return "en";
}

export function detectOutputFormat(text) {
  if (looksLikePromptDocument(text)) {
    return "";
  }

  const lower = text.toLowerCase();

  if (/\bjson\b/.test(lower)) {
    return "json";
  }

  if (/\bmarkdown\b/.test(lower)) {
    return "markdown";
  }

  if (/\bbullet(?:ed)? list\b/.test(lower)) {
    return "bullet_list";
  }

  if (/\btable\b/.test(lower)) {
    return "table";
  }

  if (/\bsummary\b/.test(lower)) {
    return "summary";
  }

  return "";
}

export function classifySentences(text) {
  const sentences = splitSentences(text);

  const classification = {
    tasks: [],
    constraints: [],
    outputInstructions: [],
    audienceHints: [],
    context: [],
  };

  for (const sentence of sentences) {
    if (!sentence) {
      continue;
    }

    if (looksLikeConstraint(sentence)) {
      classification.constraints.push(sentence);
      continue;
    }

    if (looksLikeOutputInstruction(sentence)) {
      classification.outputInstructions.push(sentence);
      continue;
    }

    if (looksLikeAudienceSentence(sentence)) {
      classification.audienceHints.push(sentence);
      continue;
    }

    if (looksLikeTaskSentence(sentence)) {
      classification.tasks.push(sentence);
      continue;
    }

    classification.context.push(sentence);
  }

  return classification;
}

export function detectConstraints(text) {
  if (looksLikePromptDocument(text)) {
    return [];
  }

  const classification = classifySentences(text);
  const lines = splitLines(text);
  const constraints = [...classification.constraints];

  for (const line of lines) {
    if (isHeading(line) || isMarkdownLinkOnly(line) || isCommandLike(line)) {
      continue;
    }

    if (!isBulletLine(line)) {
      continue;
    }

    const candidate = stripBullet(line);

    if (!candidate) {
      continue;
    }

    if (looksLikeConstraint(candidate)) {
      constraints.push(candidate);
    }
  }

  return [...new Set(constraints)];
}

export function detectSteps(text) {
  if (looksLikePromptDocument(text)) {
    const lines = splitLines(text);
    const likelyTaskBullets = lines
      .filter(isBulletLine)
      .map(stripBullet)
      .filter(
        (line) =>
          looksLikeTaskSentence(line) ||
          looksLikeConstraint(line) ||
          looksLikeOutputInstruction(line),
      )
      .slice(0, 8);

    return likelyTaskBullets;
  }

  const classification = classifySentences(text);
  const ordered = [
    ...classification.tasks,
    ...classification.constraints,
    ...classification.outputInstructions,
  ];

  return [...new Set(ordered)];
}

export function detectGoal(text) {
  if (looksLikePromptDocument(text)) {
    const lines = splitLines(text).filter(
      (line) => !isHeading(line) && !isBulletLine(line) && !isCommandLike(line),
    );

    return lines[0] ?? "";
  }

  const classification = classifySentences(text);

  if (classification.tasks.length > 0) {
    return classification.tasks[0];
  }

  const firstSentence = splitSentences(text)[0];
  return firstSentence ?? text.trim();
}

export function detectContext(text) {
  if (looksLikePromptDocument(text)) {
    return "";
  }

  const classification = classifySentences(text);
  return classification.context.join(" ");
}

export function detectDocumentSignals(text) {
  const lines = splitLines(text);

  return {
    heading_count: lines.filter(isHeading).length,
    bullet_count: lines.filter(isBulletLine).length,
    command_count: lines.filter(isCommandLike).length,
    looks_like_document: looksLikePromptDocument(text),
  };
}

export function computeComplexityScore({ steps, constraints, outputFormat }) {
  let score = 1;

  score += Math.min(steps.length, 4);
  score += Math.min(constraints.length, 3);

  if (outputFormat) {
    score += 1;
  }

  return Math.min(score, 10);
}
