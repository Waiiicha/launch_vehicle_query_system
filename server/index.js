const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
// 挂载 pic 目录到 /images 路径
app.use('/images', express.static(path.join(__dirname, '../pic')));

// 获取所有火箭 (支持复杂筛选)
app.get('/api/rockets', async (req, res) => {
  const { 
    search, 
    country, 
    minLeo, 
    maxLeo, // 支持区间
    isReusable,
    fuel,
    stages,
    status,
    manufacturer
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
    
    // 厂商筛选
    if (manufacturer) {
      where.AND.push({ manufacturer: { contains: manufacturer } });
    }

    // 状态筛选
    if (status) {
      where.AND.push({ status: { contains: status } });
    }

    // 级数筛选
    if (stages) {
      where.AND.push({ stages: { contains: stages } });
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

// --- Engine APIs ---

// Get all engines (with basic filtering)
app.get('/api/engines', async (req, res) => {
  const { search, manufacturer, propellant, minIsp, maxIsp } = req.query;
  try {
    const where = { AND: [] };
    if (search) where.AND.push({ name: { contains: search } });
    if (manufacturer) where.AND.push({ manufacturer: { contains: manufacturer } });
    if (propellant) where.AND.push({ propellant: { contains: propellant } });
    
    // Specific impulse range filtering (in seconds)
    if (minIsp) where.AND.push({ specificImpulseSecond: { gte: parseFloat(minIsp) } });
    if (maxIsp) where.AND.push({ specificImpulseSecond: { lte: parseFloat(maxIsp) } });

    const engines = await prisma.engine.findMany({ where, orderBy: { name: 'asc' } });
    res.json(engines);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch engines' });
  }
});

// Get engine details by name (include related rockets)
app.get('/api/engines/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const engine = await prisma.engine.findUnique({
      where: { name },
    });
    if (!engine) return res.status(404).json({ error: 'Engine not found' });

    // Fuzzy match related rockets
    // Look for this engine name in rocket engine fields
    const relatedRockets = await prisma.rocket.findMany({
      where: {
        OR: [
          { firstStageEngine: { contains: name } },
          { secondStageEngine: { contains: name } },
          { thirdStageEngine: { contains: name } },
        ]
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        manufacturer: true
      }
    });

    res.json({ ...engine, relatedRockets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch engine details' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
