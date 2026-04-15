const EMBEDDING_DIMENSION = 64;

const tokenize = (text = '') =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

const hashToken = (token, salt) => {
  let hash = 2166136261 ^ salt;
  for (let i = 0; i < token.length; i += 1) {
    hash ^= token.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
};

const normalize = (vector) => {
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => Number((value / magnitude).toFixed(6)));
};

export const getTextEmbedding = (text = '') => {
  const tokens = tokenize(text);
  const vector = Array.from({ length: EMBEDDING_DIMENSION }, () => 0);

  if (!tokens.length) {
    return vector;
  }

  tokens.forEach((token) => {
    const indexA = hashToken(token, 17) % EMBEDDING_DIMENSION;
    const indexB = hashToken(token, 31) % EMBEDDING_DIMENSION;
    vector[indexA] += 1;
    vector[indexB] += 0.5;
  });

  return normalize(vector);
};

export const cosineSimilarity = (a = [], b = []) => {
  if (!a.length || !b.length || a.length !== b.length) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (!normA || !normB) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const buildNoteEmbedding = ({ title = '', content = '' }) => {
  return getTextEmbedding(`${title} ${content}`.trim());
};
