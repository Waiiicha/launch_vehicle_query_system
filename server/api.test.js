const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');

// 构造一个用于测试的 app 实例 (不启动监听)
const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.get('/api/rockets', async (req, res) => {
  const rockets = await prisma.rocket.findMany();
  res.json(rockets);
});

describe('GET /api/rockets', () => {
  it('should return a list of rockets', async () => {
    const res = await request(app).get('/api/rockets');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should contain special rockets from seed data', async () => {
    const res = await request(app).get('/api/rockets');
    const names = res.body.map(r => r.name);
    expect(names).toContain('Starship');
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
