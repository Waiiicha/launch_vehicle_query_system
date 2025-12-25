import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, TextField, Grid, Card, CardContent, CardActions,
  Button, Dialog, DialogTitle, DialogContent, Box, Slider, FormControlLabel,
  Switch, Checkbox, FormGroup, Chip, Stack, LinearProgress
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PublicIcon from '@mui/icons-material/Public';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

function App() {
  const [rockets, setRockets] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRocket, setSelectedRocket] = useState(null);
  const [filters, setFilters] = useState({
    minLeo: 0,
    maxLeo: 150,
    isReusable: false,
    country: { '中国': false, '美国': false },
    minThrust: 0
  });

  useEffect(() => {
    fetchRockets();
  }, [search, filters]);

  const fetchRockets = async () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filters.isReusable) params.append('isReusable', 'true');
    if (filters.minLeo > 0) params.append('minLeo', filters.minLeo);
    if (filters.maxLeo < 150) params.append('maxLeo', filters.maxLeo);
    if (filters.minThrust > 0) params.append('minThrust', filters.minThrust);

    const selectedCountries = Object.keys(filters.country).filter(c => filters.country[c]);
    if (selectedCountries.length > 0) params.append('country', selectedCountries.join(','));

    try {
      const response = await axios.get(`/api/rockets?${params.toString()}`);
      setRockets(response.data);
    } catch (error) {
      console.error("Error fetching rockets:", error);
    }
  };

  const handleCountryChange = (event) => {
    setFilters({
      ...filters,
      country: { ...filters.country, [event.target.name]: event.target.checked }
    });
  };

  // 辅助组件：能力条
  const StatBar = ({ label, value, max, color = "primary" }) => (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="textSecondary">{label}</Typography>
        <Typography variant="caption" color="primary">{value}</Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={Math.min((value / max) * 100, 100)} 
        color={color}
        sx={{ height: 8, borderRadius: 1 }}
      />
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, minHeight: '100vh' }}>
      <Box sx={{ textAlign: 'center', mb: 6, borderBottom: '1px solid #00f3ff', pb: 2 }}>
        <Typography variant="h3" sx={{ color: '#00f3ff', textTransform: 'uppercase' }}>
          Orbit // Database
        </Typography>
        <Typography variant="subtitle1" color="secondary" sx={{ letterSpacing: 4 }}>
          全球运载火箭情报系统 V2.0
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* 左侧控制面板 */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, position: 'sticky', top: 20 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              /// 筛选参数
            </Typography>
            
            <TextField
              fullWidth
              label="搜索型号/代号"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Typography gutterBottom>LEO 运力 (吨)</Typography>
            <Slider
              value={[filters.minLeo, filters.maxLeo]}
              onChange={(e, val) => setFilters({ ...filters, minLeo: val[0], maxLeo: val[1] })}
              valueLabelDisplay="auto"
              min={0}
              max={160}
              sx={{ mb: 3 }}
            />

            <Typography gutterBottom>起飞推力 (kN) &gt; {filters.minThrust}</Typography>
            <Slider
              value={filters.minThrust}
              onChange={(e, val) => setFilters({ ...filters, minThrust: val })}
              min={0}
              max={80000} // Starship 级别
              step={1000}
              sx={{ mb: 3 }}
            />

            <FormGroup sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.isReusable}
                    onChange={(e) => setFilters({ ...filters, isReusable: e.target.checked })}
                  />
                }
                label="可重复使用"
              />
            </FormGroup>

            <Typography variant="caption" color="textSecondary" display="block" mb={1}>
              所属阵营
            </Typography>
            <FormGroup row>
              <FormControlLabel
                control={<Checkbox checked={filters.country['中国']} onChange={handleCountryChange} name="中国" />}
                label="CN"
              />
              <FormControlLabel
                control={<Checkbox checked={filters.country['美国']} onChange={handleCountryChange} name="美国" />}
                label="US"
              />
            </FormGroup>
          </Card>
        </Grid>

        {/* 右侧数据网格 */}
        <Grid item xs={12} md={9}>
          <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255,255,255,0.5)' }}>
            检测到 {rockets.length} 个目标对象
          </Typography>
          
          <Grid container spacing={3}>
            {rockets.map((rocket) => (
              <Grid item xs={12} sm={6} lg={4} key={rocket.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.02)' }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                       <Box>
                         <Typography variant="h5" component="div" sx={{ color: '#fff' }}>
                           {rocket.name}
                         </Typography>
                         <Typography color="secondary" variant="body2">
                           {rocket.manufacturer}
                         </Typography>
                       </Box>
                       <RocketLaunchIcon color={rocket.isReusable ? "success" : "disabled"} />
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip 
                        label={rocket.country} 
                        size="small" 
                        variant="outlined" 
                        color="primary"
                        icon={<PublicIcon />} 
                      />
                      {rocket.isReusable && <Chip label="REUSABLE" size="small" color="success" />}
                    </Stack>

                    <StatBar label="LEO 运力 (t)" value={rocket.leoCapacity || 0} max={150} />
                    <StatBar label="起飞推力 (kN)" value={rocket.liftoffThrust || 0} max={75000} color="secondary" />
                  </CardContent>
                  <CardActions>
                    <Button size="small" fullWidth onClick={() => setSelectedRocket(rocket)}>
                      查看全息数据
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* 详情模态框 */}
      <Dialog 
        open={!!selectedRocket} 
        onClose={() => setSelectedRocket(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { border: '2px solid #00f3ff', borderRadius: 0 }
        }}
      >
        {selectedRocket && (
          <>
            <DialogTitle sx={{ borderBottom: '1px solid rgba(0,243,255,0.3)', display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h4">{selectedRocket.name}</Typography>
              <Chip label={selectedRocket.status || 'ACTIVE'} color="primary" variant="outlined" />
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" color="secondary" gutterBottom>/// 动力核心</Typography>
                  <Box sx={{ p: 2, border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <Typography gutterBottom><LocalGasStationIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }}/>一级燃料: {selectedRocket.firstStageFuel || '未知'}</Typography>
                    <Typography gutterBottom>一级引擎: {selectedRocket.firstStageEngine || '未知'}</Typography>
                    <Typography gutterBottom>二级燃料: {selectedRocket.secondStageFuel || '未知'}</Typography>
                    <Typography gutterBottom>起飞推力: {selectedRocket.liftoffThrust ? `${selectedRocket.liftoffThrust} kN` : 'N/A'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" color="secondary" gutterBottom>/// 运载能力矩阵</Typography>
                   <StatBar label="LEO (近地轨道)" value={selectedRocket.leoCapacity || 0} max={150} />
                   <StatBar label="GTO (地球同步转移)" value={selectedRocket.gtoCapacity || 0} max={50} />
                   <StatBar label="MARS (火星转移)" value={selectedRocket.marsCapacity || 0} max={45} color="error" />
                   {selectedRocket.description && selectedRocket.description.includes('冥王星') && (
                     <Typography color="primary" sx={{ mt: 2, fontStyle: 'italic' }}>* 已确认具备冥王星深空探测潜力</Typography>
                   )}
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" color="secondary" gutterBottom>/// 战术简报</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', lineHeight: 1.8 }}>
                    {selectedRocket.description || "暂无详细描述数据。"}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <Button onClick={() => setSelectedRocket(null)} variant="contained" color="primary">
                关闭通讯
              </Button>
            </Box>
          </>
        )}
      </Dialog>
    </Container>
  );
}

export default App;