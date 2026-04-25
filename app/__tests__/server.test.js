const request = require('supertest');
const { app } = require('../server'); // We will modify server.js to export app

describe('API Endpoints', () => {
  it('GET / should return the homepage', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('ElectraGuide India');
  });

  it('GET /quiz should return quiz questions for english', async () => {
    const res = await request(app).get('/quiz?lang=en');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('questions');
    expect(Array.isArray(res.body.questions)).toBe(true);
  });

  it('POST /chat should return knowledge base answer for exact match', async () => {
    const res = await request(app)
      .post('/chat')
      .send({ message: 'nota', lang: 'en' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.answer).toContain('NOTA (None of the Above)');
  });
});
