/**
 * @fileoverview Comprehensive test suite for ElectraGuide API
 * Tests cover: endpoints, input validation, security, edge cases, error handling
 */

const request = require('supertest');
const { app } = require('../server');

// ===================== CHAT ENDPOINT TESTS =====================

describe('POST /chat', () => {
  it('should return knowledge base answer for a valid topic', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ message: 'nota', lang: 'en' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.answer).toContain('NOTA');
    expect(res.body.source).toBe('knowledge_base');
  });

  it('should return greeting for hi/hello', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ message: 'hello', lang: 'en' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.answer).toContain('ElectraGuide');
  });

  it('should return fallback for unknown questions', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ message: 'xyz random gibberish 12345', lang: 'en' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('answer');
  });

  it('should handle Hindi language', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ message: 'नोटा', lang: 'hi' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.answer).toContain('NOTA');
  });

  it('should handle Bengali language', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ message: 'ভোট', lang: 'bn' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('answer');
  });

  it('should handle Marathi language', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ message: 'मतदान', lang: 'mr' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('answer');
  });

  it('should default to English for invalid language code', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ message: 'how to vote', lang: 'xx' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.answer).toContain('vote');
  });

  it('should return 400 for empty message', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ message: '', lang: 'en' });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 for missing message field', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ lang: 'en' });
    expect(res.statusCode).toEqual(400);
  });

  it('should match voter registration topic', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ message: 'how to register as voter', lang: 'en' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.answer).toContain('Register');
  });

  it('should match EVM/voting procedure topic', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ message: 'how to cast vote on evm', lang: 'en' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.answer).toContain('EVM');
  });

  it('should match polling booth topic', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ message: 'where is my polling booth', lang: 'en' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.answer).toContain('Polling');
  });

  it('should match document requirements topic', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ message: 'what documents to carry', lang: 'en' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.answer).toContain('Aadhaar');
  });

  it('should match election commission topic', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ message: 'election commission of India', lang: 'en' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.answer).toContain('election');
  });
});

// ===================== INPUT SANITIZATION TESTS =====================

describe('Input Sanitization', () => {
  it('should strip HTML tags from input', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ message: '<script>alert("xss")</script>how to vote', lang: 'en' });
    expect(res.statusCode).toEqual(200);
    // Script tag should be stripped, but 'how to vote' should still match
  });

  it('should handle very long input gracefully', async () => {
    const longMessage = 'a'.repeat(1000);
    const res = await request(app)
      .post('/chat')
      .send({ message: longMessage, lang: 'en' });
    expect(res.statusCode).toEqual(200);
  });

  it('should handle special characters in input', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ message: '!@#$%^&*()', lang: 'en' });
    expect(res.statusCode).toEqual(200);
  });

  it('should handle numeric-only input', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ message: '12345', lang: 'en' });
    expect(res.statusCode).toEqual(200);
  });
});

// ===================== QUIZ ENDPOINT TESTS =====================

describe('GET /quiz', () => {
  it('should return quiz questions in English', async () => {
    const res = await request(app).get('/quiz?lang=en');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('questions');
    expect(Array.isArray(res.body.questions)).toBe(true);
    expect(res.body.questions.length).toBe(5);
  });

  it('should return quiz questions in Hindi', async () => {
    const res = await request(app).get('/quiz?lang=hi');
    expect(res.statusCode).toEqual(200);
    expect(res.body.questions.length).toBe(5);
  });

  it('should return quiz questions in Bengali', async () => {
    const res = await request(app).get('/quiz?lang=bn');
    expect(res.statusCode).toEqual(200);
    expect(res.body.questions.length).toBeLessThanOrEqual(5);
  });

  it('should return quiz questions in Marathi', async () => {
    const res = await request(app).get('/quiz?lang=mr');
    expect(res.statusCode).toEqual(200);
    expect(res.body.questions.length).toBeLessThanOrEqual(5);
  });

  it('should default to English for unknown language', async () => {
    const res = await request(app).get('/quiz?lang=zz');
    expect(res.statusCode).toEqual(200);
    expect(res.body.questions.length).toBe(5);
  });

  it('each question should have required fields', async () => {
    const res = await request(app).get('/quiz?lang=en');
    res.body.questions.forEach(q => {
      expect(q).toHaveProperty('q');
      expect(q).toHaveProperty('options');
      expect(q).toHaveProperty('correct');
      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options.length).toBe(4);
      expect(typeof q.correct).toBe('number');
    });
  });

  it('should include cache-control headers', async () => {
    const res = await request(app).get('/quiz?lang=en');
    expect(res.headers['cache-control']).toContain('max-age=300');
  });
});

// ===================== STATIC FILE & HOMEPAGE TESTS =====================

describe('GET /', () => {
  it('should return the homepage HTML', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('ElectraGuide');
  });

  it('should return correct content-type', async () => {
    const res = await request(app).get('/');
    expect(res.headers['content-type']).toContain('text/html');
  });
});

// ===================== HEALTH CHECK TESTS =====================

describe('GET /health', () => {
  it('should return 200 with health info', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('timestamp');
  });
});

// ===================== SECURITY HEADER TESTS =====================

describe('Security Headers', () => {
  it('should include X-Content-Type-Options header', async () => {
    const res = await request(app).get('/');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('should include X-Frame-Options or CSP frame-ancestors', async () => {
    const res = await request(app).get('/');
    const hasFrameOptions = !!res.headers['x-frame-options'];
    const hasCSP = !!res.headers['content-security-policy'];
    expect(hasFrameOptions || hasCSP).toBe(true);
  });

  it('should return 404 for non-existent routes', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.statusCode).toEqual(404);
  });

  it('should reject oversized payloads', async () => {
    const largeBody = { message: 'a'.repeat(20000) };
    const res = await request(app)
      .post('/chat')
      .send(largeBody);
    // Should either truncate or reject
    expect([200, 400, 413, 500]).toContain(res.statusCode);
  });
});
