import React, { useMemo } from 'react';
import {
  Container, Typography, Grid, Paper, Box, Card, CardContent,
  useTheme, alpha
} from '@mui/material';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

const Statistics = ({ rockets, engines }) => {
  const theme = useTheme();

  // 火箭统计数据处理
  const rocketStats = useMemo(() => {
    if (!rockets || rockets.length === 0) return null;

    // 运力分布 (LEO)
    const leoDistribution = [
      { range: '0-5t', count: 0 },
      { range: '5-10t', count: 0 },
      { range: '10-25t', count: 0 },
      { range: '25-50t', count: 0 },
      { range: '50-100t', count: 0 },
      { range: '>100t', count: 0 },
    ];
    
    rockets.forEach(r => {
      if (r.leoCapacity) {
        if (r.leoCapacity < 5) leoDistribution[0].count++;
        else if (r.leoCapacity < 10) leoDistribution[1].count++;
        else if (r.leoCapacity < 25) leoDistribution[2].count++;
        else if (r.leoCapacity < 50) leoDistribution[3].count++;
        else if (r.leoCapacity < 100) leoDistribution[4].count++;
        else leoDistribution[5].count++;
      }
    });

    // 国家分布
    const countryCount = {};
    rockets.forEach(r => {
      if (r.country) {
        countryCount[r.country] = (countryCount[r.country] || 0) + 1;
      }
    });
    const countryDistribution = Object.entries(countryCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // 级数分布
    const stagesCount = {};
    rockets.forEach(r => {
      if (r.stages) {
        const stage = r.stages.includes('2') ? '2级' : 
                      r.stages.includes('3') ? '3级' : 
                      r.stages.includes('1') ? '1级' : '其他';
        stagesCount[stage] = (stagesCount[stage] || 0) + 1;
      }
    });
    const stagesDistribution = Object.entries(stagesCount)
      .map(([name, value]) => ({ name, value }));

    // 状态分布
    const statusCount = {};
    rockets.forEach(r => {
      if (r.status) {
        statusCount[r.status] = (statusCount[r.status] || 0) + 1;
      }
    });
    const statusDistribution = Object.entries(statusCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // 厂商TOP10
    const manufacturerCount = {};
    rockets.forEach(r => {
      if (r.manufacturer) {
        manufacturerCount[r.manufacturer] = (manufacturerCount[r.manufacturer] || 0) + 1;
      }
    });
    const manufacturerDistribution = Object.entries(manufacturerCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // 可回收火箭统计
    const reusableCount = rockets.filter(r => r.isReusable).length;
    const nonReusableCount = rockets.length - reusableCount;
    const reusabilityDistribution = [
      { name: '可回收', value: reusableCount },
      { name: '不可回收', value: nonReusableCount }
    ];

    return {
      leoDistribution,
      countryDistribution,
      stagesDistribution,
      statusDistribution,
      manufacturerDistribution,
      reusabilityDistribution,
      totalCount: rockets.length
    };
  }, [rockets]);

  // 发动机统计数据处理
  const engineStats = useMemo(() => {
    if (!engines || engines.length === 0) return null;

    // 国家分布
    const countryCount = {};
    engines.forEach(e => {
      if (e.country) {
        countryCount[e.country] = (countryCount[e.country] || 0) + 1;
      }
    });
    const countryDistribution = Object.entries(countryCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // 比冲分布
    const ispDistribution = [
      { range: '<260s', count: 0 },
      { range: '260-280s', count: 0 },
      { range: '280-300s', count: 0 },
      { range: '300-320s', count: 0 },
      { range: '320-350s', count: 0 },
      { range: '>350s', count: 0 },
    ];
    
    engines.forEach(e => {
      if (e.specificImpulseSecond) {
        const isp = e.specificImpulseSecond;
        if (isp < 260) ispDistribution[0].count++;
        else if (isp < 280) ispDistribution[1].count++;
        else if (isp < 300) ispDistribution[2].count++;
        else if (isp < 320) ispDistribution[3].count++;
        else if (isp < 350) ispDistribution[4].count++;
        else ispDistribution[5].count++;
      }
    });

    // 推进剂分布
    const propellantCount = {};
    engines.forEach(e => {
      if (e.propellant) {
        // 简化推进剂名称
        let propellant = e.propellant;
        if (propellant.includes('液氧') && propellant.includes('煤油')) propellant = '液氧/煤油';
        else if (propellant.includes('液氧') && propellant.includes('甲烷')) propellant = '液氧/甲烷';
        else if (propellant.includes('液氧') && propellant.includes('液氢')) propellant = '液氧/液氢';
        else if (propellant.includes('四氧化二氮') || propellant.includes('N2O4')) propellant = '四氧化二氮/偏二甲肼';
        
        propellantCount[propellant] = (propellantCount[propellant] || 0) + 1;
      }
    });
    const propellantDistribution = Object.entries(propellantCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // 循环方式分布
    const cycleCount = {};
    engines.forEach(e => {
      if (e.cycle) {
        cycleCount[e.cycle] = (cycleCount[e.cycle] || 0) + 1;
      }
    });
    const cycleDistribution = Object.entries(cycleCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // 厂商TOP10
    const manufacturerCount = {};
    engines.forEach(e => {
      if (e.manufacturer) {
        manufacturerCount[e.manufacturer] = (manufacturerCount[e.manufacturer] || 0) + 1;
      }
    });
    const manufacturerDistribution = Object.entries(manufacturerCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    return {
      countryDistribution,
      ispDistribution,
      propellantDistribution,
      cycleDistribution,
      manufacturerDistribution,
      totalCount: engines.length
    };
  }, [engines]);

  if (!rocketStats || !engineStats) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>数据加载中...</Typography>
      </Container>
    );
  }

  const renderCustomLabel = (entry) => {
    return `${entry.name}: ${entry.value}`;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        🚀 火箭与发动机统计信息
      </Typography>

      {/* 火箭统计部分 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 500 }}>
          火箭统计 (共 {rocketStats.totalCount} 款)
        </Typography>
        
        <Grid container spacing={3}>
          {/* 运力分布 */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  LEO运力分布
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rocketStats.leoDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill={theme.palette.primary.main} name="数量" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* 国家分布 */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  国家分布
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={rocketStats.countryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {rocketStats.countryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* 级数分布 */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  级数分布
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={rocketStats.stagesDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {rocketStats.stagesDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* 状态分布 */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  火箭状态分布
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rocketStats.statusDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill={theme.palette.secondary.main} name="数量" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* 可回收性分布 */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  可回收性分布
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={rocketStats.reusabilityDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {rocketStats.reusabilityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* 厂商分布TOP10 */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  厂商分布 (TOP10)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={rocketStats.manufacturerDistribution}
                    layout="vertical"
                    margin={{ left: 150 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={140} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill={theme.palette.info.main} name="数量" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* 发动机统计部分 */}
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 500 }}>
          发动机统计 (共 {engineStats.totalCount} 款)
        </Typography>
        
        <Grid container spacing={3}>
          {/* 国家分布 */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  国家分布
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={engineStats.countryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {engineStats.countryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* 比冲分布 */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  比冲分布
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engineStats.ispDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill={theme.palette.success.main} name="数量" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* 推进剂分布 */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  推进剂分布
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={engineStats.propellantDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {engineStats.propellantDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* 循环方式分布 */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  循环方式分布
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engineStats.cycleDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill={theme.palette.warning.main} name="数量" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* 厂商分布TOP10 */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  厂商分布 (TOP10)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={engineStats.manufacturerDistribution}
                    layout="vertical"
                    margin={{ left: 150 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={140} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill={theme.palette.error.main} name="数量" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Statistics;
