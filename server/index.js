const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 获取所有火箭 (支持复杂筛选)
app.get('/api/rockets', async (req, res) => {
  const { 
    search, 
    country, 
    minLeo, 
    maxLeo, // 支持区间
    isReusable,
    fuel // 新增: 燃料类型
  } = req.query;

  try {
    const where = { AND: [] };

    // 模糊搜索
    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: search } },
          { manufacturer: { contains: search } },
          { series: { contains: search } },
        ],
      });
    }

    // 国家筛选
    if (country) {
      const countries = country.split(',');
      where.AND.push({ country: { in: countries } });
    }

    // LEO 运力范围
    if (minLeo) where.AND.push({ leoCapacity: { gte: parseFloat(minLeo) } });
    if (maxLeo) where.AND.push({ leoCapacity: { lte: parseFloat(maxLeo) } });

    // 可回收
    if (isReusable === 'true') where.AND.push({ isReusable: true });

    // 燃料筛选 (模糊匹配)
    if (fuel) {
      where.AND.push({
        firstStageFuel: { contains: fuel } 
      });
    }

    const rockets = await prisma.rocket.findMany({
      where,
      orderBy: { leoCapacity: 'desc' }, 
    });
    res.json(rockets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch rockets' });
  }
});

// 获取详情
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
