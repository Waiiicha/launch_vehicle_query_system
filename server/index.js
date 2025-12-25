const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 获取所有火箭 (支持 ?search=... 模糊查询)
app.get('/api/rockets', async (req, res) => {
  const { search } = req.query;
  try {
    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { manufacturer: { contains: search } },
            { series: { contains: search } },
          ],
        }
      : {};

    const rockets = await prisma.rocket.findMany({
      where,
      orderBy: { id: 'asc' },
    });
    res.json(rockets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rockets' });
  }
});

// 获取单个火箭详情
app.get('/api/rockets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const rocket = await prisma.rocket.findUnique({
      where: { id: parseInt(id) },
    });
    if (!rocket) return res.status(404).json({ error: 'Rocket not found' });
    res.json(rocket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rocket' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
