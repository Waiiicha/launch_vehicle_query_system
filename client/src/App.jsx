import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, TextField, Grid, Card, CardContent, CardActions, CardMedia,
  Button, Dialog, DialogTitle, DialogContent, Box, Slider, FormControlLabel,
  Switch, Chip, Stack, LinearProgress, Paper, InputAdornment, Fade,
  MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

function App() {
  const [rockets, setRockets] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRocket, setSelectedRocket] = useState(null);
  
  // 增强筛选状态
  const [filters, setFilters] = useState({
    leoRange: [0, 160], // [min, max]
    country: '', 
    fuel: '',
    isReusable: false
  });

  useEffect(() => {
    fetchRockets();
  }, [search, filters]);

  const fetchRockets = async () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filters.isReusable) params.append('isReusable', 'true');
    
    // Range
    params.append('minLeo', filters.leoRange[0]);
    if (filters.leoRange[1] < 160) params.append('maxLeo', filters.leoRange[1]);
    
    if (filters.country) params.append('country', filters.country);
    if (filters.fuel) params.append('fuel', filters.fuel);

    try {
      const response = await axios.get(`/api/rockets?${params.toString()}`);
      setRockets(response.data);
    } catch (error) {
      console.error("Error fetching rockets:", error);
    }
  };

  const StatRow = ({ label, value, unit }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <Typography variant="body2" color="textSecondary">{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>{value ? `${value} ${unit}` : 'N/A'}</Typography>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 10 }}>
      {/* 顶部标题区 */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h3" gutterBottom>
          Launch Vehicles.
        </Typography>
        <Typography variant="h5" color="textSecondary" sx={{ fontWeight: 400 }}>
          Exploring humanity's bridge to the stars.
        </Typography>
      </Box>

      {/* 增强型控制栏 */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, mb: 6, borderRadius: 4, 
          backgroundColor: 'rgba(255,255,255,0.8)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,0,0,0.05)',
          position: 'sticky', top: 20, zIndex: 100
        }}
      >
        <Grid container spacing={3} alignItems="center">
          {/* 搜索 */}
          <Grid item xs={12} md={3}>
            <TextField
              placeholder="Search models..."
              variant="standard"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                disableUnderline: true,
                startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                style: { fontSize: '1.1rem', fontWeight: 500 }
              }}
            />
          </Grid>
          
          {/* LEO 运力范围 */}
          <Grid item xs={12} md={3}>
            <Typography variant="caption" color="textSecondary">LEO Capacity: {filters.leoRange[0]}t - {filters.leoRange[1] === 160 ? '160t+' : `${filters.leoRange[1]}t`}</Typography>
            <Slider
              value={filters.leoRange}
              onChange={(e, val) => setFilters({...filters, leoRange: val})}
              valueLabelDisplay="auto"
              min={0}
              max={160}
              size="small"
            />
          </Grid>

          {/* 燃料类型 */}
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small" variant="standard">
              <Select
                value={filters.fuel}
                onChange={(e) => setFilters({...filters, fuel: e.target.value})}
                displayEmpty
                disableUnderline
                sx={{ fontWeight: 500 }}
              >
                <MenuItem value=""><em>Fuel Type</em></MenuItem>
                <MenuItem value="煤油">Kerosene (煤油)</MenuItem>
                <MenuItem value="氢">Hydrogen (氢氧)</MenuItem>
                <MenuItem value="甲烷">Methane (甲烷)</MenuItem>
                <MenuItem value="固体">Solid (固体)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* 国家 */}
          <Grid item xs={6} md={2}>
             <FormControl fullWidth size="small" variant="standard">
              <Select
                value={filters.country}
                onChange={(e) => setFilters({...filters, country: e.target.value})}
                displayEmpty
                disableUnderline
                sx={{ fontWeight: 500 }}
              >
                <MenuItem value=""><em>All Countries</em></MenuItem>
                <MenuItem value="中国">China</MenuItem>
                <MenuItem value="美国">USA</MenuItem>
                <MenuItem value="欧洲">Europe</MenuItem>
                <MenuItem value="俄罗斯">Russia</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* 可回收开关 */}
          <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
             <FormControlLabel
              control={
                <Switch 
                  checked={filters.isReusable} 
                  onChange={(e) => setFilters({...filters, isReusable: e.target.checked})}
                />
              }
              label={<Typography variant="body2" sx={{ fontWeight: 500 }}>Reusable</Typography>}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* 数据网格 */}
      <Grid container spacing={4}>
        {rockets.map((rocket) => (
          <Grid item xs={12} sm={6} md={4} key={rocket.id}>
            <Fade in={true} timeout={500}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={rocket.imageUrl || `https://placehold.co/800x600/f5f5f7/1d1d1f?text=${rocket.name}`}
                  alt={rocket.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>
                      {rocket.series || rocket.manufacturer}
                    </Typography>
                    {rocket.isReusable && <Chip label="Reusable" size="small" color="success" variant="soft" sx={{ height: 20, fontSize: '0.65rem' }} />}
                  </Stack>
                  
                  <Typography variant="h5" sx={{ mb: 1, letterSpacing: '-0.02em', fontWeight: 600 }}>
                    {rocket.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 3, minHeight: 40 }}>
                    {rocket.description ? (rocket.description.length > 50 ? rocket.description.substring(0, 50) + '...' : rocket.description) : 'No description.'}
                  </Typography>
                  
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                       <Typography variant="caption" color="textSecondary">LEO Payload</Typography>
                       <Typography variant="caption" sx={{ fontWeight: 600 }}>{rocket.leoCapacity || 0}t</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(((rocket.leoCapacity || 0) / 150) * 100, 100)} 
                      sx={{ height: 4, borderRadius: 2, bgcolor: '#f0f0f0' }} 
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ px: 3, pb: 3 }}>
                  <Button variant="contained" fullWidth onClick={() => setSelectedRocket(rocket)}>
                    View Specs
                  </Button>
                </CardActions>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* 详情模态框 */}
      <Dialog 
        open={!!selectedRocket} 
        onClose={() => setSelectedRocket(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 6, overflow: 'hidden' }
        }}
      >
        {selectedRocket && (
          <Grid container>
            {/* 左侧图片区 (仅在大屏显示) */}
            <Grid item xs={12} md={5} sx={{ bgcolor: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Box 
                 component="img" 
                 src={selectedRocket.imageUrl} 
                 sx={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: 600 }}
               />
            </Grid>
            
            {/* 右侧信息区 */}
            <Grid item xs={12} md={7}>
              <Box sx={{ p: 4, position: 'relative' }}>
                <Button 
                  onClick={() => setSelectedRocket(null)} 
                  sx={{ position: 'absolute', right: 16, top: 16, minWidth: 0, p: 1, borderRadius: '50%', color: '#000' }}
                >
                   <CloseIcon />
                </Button>
                
                <Typography variant="overline" color="textSecondary">{selectedRocket.manufacturer} / {selectedRocket.country}</Typography>
                <Typography variant="h3" sx={{ mt: 1, mb: 3 }}>{selectedRocket.name}</Typography>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>Performance</Typography>
                    <StatRow label="LEO Capacity" value={selectedRocket.leoCapacity} unit="t" />
                    <StatRow label="GTO Capacity" value={selectedRocket.gtoCapacity} unit="t" />
                    <StatRow label="Mars Transfer" value={selectedRocket.marsCapacity} unit="t" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                     <Typography variant="h6" gutterBottom>Propulsion</Typography>
                     <StatRow label="Fuel (Stage 1)" value={selectedRocket.firstStageFuel} unit="" />
                     <StatRow label="Engine" value={selectedRocket.firstStageEngine} unit="" />
                     <StatRow label="Thrust" value={selectedRocket.firstStageThrust} unit="" />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, p: 3, bgcolor: '#fafafa', borderRadius: 4 }}>
                   <Typography variant="subtitle2" gutterBottom>Mission Profile</Typography>
                   <Typography variant="body2" color="textSecondary" align="justify">
                    {selectedRocket.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </Dialog>
    </Container>
  );
}

export default App;