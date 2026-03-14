function splitParagraphs(text) {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function countMarkdownSignals(text) {
  return {
    headings: (text.match(/^#{1,6}\s+/gm) ?? []).length,
    bullets: (text.match(/^\s*[-*]\s+/gm) ?? []).length,
    numbered: (text.match(/^\s*\d+\.\s+/gm) ?? []).length,
    emphasis: (text.match(/\*\*[^*]+\*\*/g) ?? []).length,
  };
}

function scoreClarity(text) {
  const sentences = splitSentences(text);
  const sentenceLengths = sentences.map(
    (sentence) => sentence.split(/\s+/).filter(Boolean).length,
  );

  const averageSentenceLength =
    sentenceLengths.length === 0
      ? 0
      : Math.round(
          sentenceLengths.reduce((sum, value) => sum + value, 0) /
            sentenceLengths.length,
        );

  let score = 100;
  const notes = [];

  if (averageSentenceLength > 28) {
    score -= 25;
    notes.push(
      "Average sentence length is long, which may reduce readability.",
    );
  } else if (averageSentenceLength > 22) {
    score -= 10;
    notes.push("Average sentence length is slightly long.");
  }

  if (sentences.length < 2) {
    score -= 15;
    notes.push("Very short response may limit clarity.");
  }

  if (text.length < 120) {
    score -= 10;
    notes.push("Response may be too brief for the requested topic.");
  }

  return {
    score: Math.max(0, score),
    notes,
    metrics: {
      sentence_count: sentences.length,
      average_sentence_length: averageSentenceLength,
    },
  };
}

function scoreStructure(text, expectedFormat = "") {
  const paragraphs = splitParagraphs(text);
  const markdownSignals = countMarkdownSignals(text);

  let score = 100;
  const notes = [];

  if (expectedFormat.toLowerCase() === "markdown") {
    const markdownSignalCount =
      markdownSignals.headings +
      markdownSignals.bullets +
      markdownSignals.numbered +
      markdownSignals.emphasis;

    if (markdownSignalCount === 0) {
      score -= 40;
      notes.push(
        "Expected markdown output, but few or no markdown signals were detected.",
      );
    } else if (markdownSignalCount < 3) {
      score -= 15;
      notes.push("Markdown output is present but structurally light.");
    }
  }

  if (paragraphs.length < 2) {
    score -= 15;
    notes.push("Response structure is shallow with limited paragraphing.");
  }

  return {
    score: Math.max(0, score),
    notes,
    metrics: {
      paragraph_count: paragraphs.length,
      markdown_signals: markdownSignals,
    },
  };
}

function scoreConstraintAdherence(runArtifact) {
  const renderedPrompt = runArtifact.input?.rendered_prompt ?? "";
  const responseText = runArtifact.output?.text ?? "";

  let score = 100;
  const notes = [];
  const checks = [];

  const expectsNoJargon = /do not use jargon/i.test(renderedPrompt);
  if (expectsNoJargon) {
    const jargonTerms = [
      "certificate authority",
      "non-repudiation",
      "public key infrastructure",
      "revocation",
      "cryptographic",
      "ca",
      "pki",
    ];

    const matchedTerms = jargonTerms.filter((term) =>
      responseText.toLowerCase().includes(term.toLowerCase()),
    );

    checks.push({
      constraint: "Do not use jargon",
      matched: matchedTerms.length === 0,
      details: matchedTerms,
    });

    if (matchedTerms.length > 0) {
      score -= Math.min(40, matchedTerms.length * 8);
      notes.push(
        `Jargon-sensitive terms detected despite the prompt requesting simpler language: ${matchedTerms.join(", ")}.`,
      );
    }
  }

  return {
    score: Math.max(0, score),
    notes,
    metrics: {
      checks,
    },
  };
}

function scoreAudienceFit(runArtifact) {
  const audience = runArtifact.prompt?.audience ?? "";
  const responseText = runArtifact.output?.text ?? "";

  let score = 100;
  const notes = [];

  if (audience.toLowerCase() === "executives") {
    const tooTechnicalSignals = [
      "cryptographic",
      "x.509",
      "csr",
      "ca hierarchy",
      "revocation list",
      "certificate authority",
    ];

    const matched = tooTechnicalSignals.filter((term) =>
      responseText.toLowerCase().includes(term.toLowerCase()),
    );

    if (matched.length > 0) {
      score -= Math.min(35, matched.length * 7);
      notes.push(
        `Some terminology may be too technical for an executive audience: ${matched.join(", ")}.`,
      );
    }

    const businessSignals = [
      "risk",
      "compliance",
      "security",
      "operations",
      "cost",
      "governance",
    ];

    const businessMatches = businessSignals.filter((term) =>
      responseText.toLowerCase().includes(term.toLowerCase()),
    );

    if (businessMatches.length === 0) {
      score -= 15;
      notes.push(
        "Response could better connect the explanation to executive priorities.",
      );
    }
  }

  return {
    score: Math.max(0, score),
    notes,
    metrics: {
      audience,
    },
  };
}

function averageScores(scores) {
  if (scores.length === 0) {
    return 0;
  }

  return Math.round(
    scores.reduce((sum, value) => sum + value, 0) / scores.length,
  );
}

function scoreToLevel(score) {
  if (score >= 85) {
    return "excellent";
  }

  if (score >= 70) {
    return "good";
  }

  if (score >= 50) {
    return "fair";
  }

  return "poor";
}

export function evaluateRunArtifact(runArtifact) {
  const responseText = runArtifact.output?.text ?? "";
  const expectedFormat = runArtifact.prompt?.output_format ?? "";

  const clarity = scoreClarity(responseText);
  const structure = scoreStructure(responseText, expectedFormat);
  const constraint_adherence = scoreConstraintAdherence(runArtifact);
  const audience_fit = scoreAudienceFit(runArtifact);

  const overallScore = averageScores([
    clarity.score,
    structure.score,
    constraint_adherence.score,
    audience_fit.score,
  ]);

  const recommendations = [];

  if (clarity.score < 80) {
    recommendations.push(
      "Shorten or simplify sentences to improve readability.",
    );
  }

  if (structure.score < 80) {
    recommendations.push(
      "Improve formatting and visible structure for easier scanning.",
    );
  }

  if (constraint_adherence.score < 80) {
    recommendations.push("Tighten output against explicit prompt constraints.");
  }

  if (audience_fit.score < 80) {
    recommendations.push(
      "Tune the language and framing more explicitly for the target audience.",
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "This run appears strong across the current deterministic evaluation dimensions.",
    );
  }

  return {
    overall_score: overallScore,
    overall_level: scoreToLevel(overallScore),
    dimensions: {
      clarity,
      structure,
      constraint_adherence,
      audience_fit,
    },
    recommendations,
  };
}
