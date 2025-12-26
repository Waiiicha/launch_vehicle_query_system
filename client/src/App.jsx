import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, TextField, Grid, Card, CardContent, CardActions, CardMedia,
  Button, Dialog, Box, Slider, FormControlLabel,
  Switch, Chip, Stack, LinearProgress, Paper, InputAdornment, Fade,
  MenuItem, Select, FormControl, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon,
  IconButton, useMediaQuery, useTheme, InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const drawerWidth = 320;

function App() {
  const [rockets, setRockets] = useState([]);
  const [selectedRocket, setSelectedRocket] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // 纯净的筛选状态
  const [filters, setFilters] = useState({
    search: '',
    country: '',      // 国家筛选归位
    leoRange: [0, 160],
    fuel: '',
    isReusable: false,
    status: '',
    stages: '',
    manufacturer: ''
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchRockets();
  }, [filters]);

  const fetchRockets = async () => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.country) params.append('country', filters.country);
    if (filters.isReusable) params.append('isReusable', 'true');
    params.append('minLeo', filters.leoRange[0]);
    if (filters.leoRange[1] < 160) params.append('maxLeo', filters.leoRange[1]);
    
    if (filters.fuel) params.append('fuel', filters.fuel);
    if (filters.status) params.append('status', filters.status);
    if (filters.stages) params.append('stages', filters.stages);
    if (filters.manufacturer) params.append('manufacturer', filters.manufacturer);

    try {
      const response = await axios.get(`/api/rockets?${params.toString()}`);
      setRockets(response.data);
    } catch (error) {
      console.error("Error fetching rockets:", error);
    }
  };

  const handleReset = () => {
    setFilters({
      search: '',
      country: '',
      leoRange: [0, 160],
      fuel: '',
      isReusable: false,
      status: '',
      stages: '',
      manufacturer: ''
    });
  };

  const StatRow = ({ label, value, unit, subLabel }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.2, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
      <Box>
        <Typography variant="body2" color="textSecondary">{label}</Typography>
        {subLabel && <Typography variant="caption" color="textSecondary" sx={{ opacity: 0.6, fontSize: '0.7rem' }}>{subLabel}</Typography>}
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>{value ? `${value} ${unit}` : 'N/A'}</Typography>
    </Box>
  );

  const filterInputStyle = {
    borderRadius: 3,
    bgcolor: '#f5f5f7',
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: '1px solid #0066cc' },
  };

  const FilterSelect = ({ label, value, onChange, options }) => (
    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
      <Typography variant="caption" sx={{ ml: 1, mb: 0.5, fontWeight: 600, color: 'text.secondary' }}>{label}</Typography>
      <Select
        value={value}
        onChange={onChange}
        displayEmpty
        sx={filterInputStyle}
        MenuProps={{ PaperProps: { sx: { borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } } }}
      >
        <MenuItem value=""><em>不限 (All)</em></MenuItem>
        {options.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 上半部分：筛选区 (固定高度，可滚动) */}
      <Box sx={{ p: 3, overflowY: 'auto', flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <Box sx={{ mb: 3 }}>
           <Typography variant="h6" sx={{ fontWeight: 800, color: '#000', letterSpacing: -0.5 }}>ROCKET DB</Typography>
           <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 500 }}>Control Center</Typography>
        </Box>

        <TextField
          placeholder="搜索型号 / Search..."
          variant="outlined"
          fullWidth
          size="small"
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
            sx: filterInputStyle
          }}
          sx={{ mb: 3 }}
        />

        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 700, mb: 2, display: 'block', px: 1 }}>筛选条件 / FILTERS</Typography>
        
        {/* 国家筛选 (原快捷分类) */}
        <FilterSelect 
          label="国家 / Country"
          value={filters.country}
          onChange={(e) => setFilters({...filters, country: e.target.value})}
          options={[
            { value: '中国', label: '🇨🇳 中国 (China)' },
            { value: '美国', label: '🇺🇸 美国 (USA)' },
            { value: '欧洲', label: '🇪🇺 欧洲 (Europe)' },
            { value: '俄罗斯', label: '🇷🇺 俄罗斯 (Russia)' },
          ]}
        />

        {/* 厂商 */}
        <FilterSelect 
          label="研制单位 / Manufacturer"
          value={filters.manufacturer}
          onChange={(e) => setFilters({...filters, manufacturer: e.target.value})}
          options={[
            { value: '航天一院', label: '🇨🇳 CASC 一院' },
            { value: '航天八院', label: '🇨🇳 CASC 八院' },
            { value: '蓝箭', label: '🇨🇳 蓝箭航天' },
            { value: '星河', label: '🇨🇳 星河动力' },
            { value: 'SpaceX', label: '🇺🇸 SpaceX' },
            { value: 'NASA', label: '🇺🇸 NASA' },
            { value: 'ULA', label: '🇺🇸 ULA' },
          ]}
        />

        <FilterSelect 
          label="服役状态 / Status"
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
          options={[
            { value: '现役', label: '🟢 现役 (Active)' },
            { value: '研发', label: '🔵 研发中 (In Dev)' },
            { value: '退役', label: '⚪️ 退役 (Retired)' },
          ]}
        />

        <FilterSelect 
          label="燃料类型 / Fuel"
          value={filters.fuel}
          onChange={(e) => setFilters({...filters, fuel: e.target.value})}
          options={[
            { value: '煤油', label: '🛢️ 煤油 (Kerosene)' },
            { value: '甲烷', label: '💨 甲烷 (Methane)' },
            { value: '氢', label: '💧 氢氧 (Hydrogen)' },
            { value: '固体', label: '🧱 固体 (Solid)' },
          ]}
        />

        <Box sx={{ px: 1, mb: 2, bgcolor: '#f5f5f7', p: 2, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>LEO 运力</Typography>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>{filters.leoRange[0]}-{filters.leoRange[1]}t</Typography>
          </Box>
          <Slider
            value={filters.leoRange}
            onChange={(e, val) => setFilters({...filters, leoRange: val})}
            min={0} max={160} size="small"
          />
        </Box>

        <Box sx={{ mt: 1, px: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>可回收型号</Typography>
           <Switch checked={filters.isReusable} onChange={(e) => setFilters({...filters, isReusable: e.target.checked})} size="small" />
        </Box>

        <Button 
          fullWidth 
          size="small"
          variant="text" 
          onClick={handleReset}
          sx={{ mt: 2, color: 'text.secondary', fontSize: '0.75rem' }}
        >
          重置所有筛选
        </Button>
      </Box>

      {/* 下半部分：结果目录 (剩余高度，可滚动) */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: '#fafafa', p: 0 }}>
        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 700, py: 2, px: 3, display: 'block', bgcolor: '#fafafa', position: 'sticky', top: 0, zIndex: 1 }}>
          结果目录 ({rockets.length})
        </Typography>
        <List dense>
          {rockets.map((rocket) => (
            <ListItem key={rocket.id} disablePadding>
              <ListItemButton onClick={() => setSelectedRocket(rocket)} sx={{ px: 3 }}>
                <ListItemText 
                  primary={rocket.name} 
                  secondary={rocket.country}
                  primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }}
                  secondaryTypographyProps={{ fontSize: '0.7rem' }}
                />
                <ArrowForwardIosIcon sx={{ fontSize: 10, color: '#ccc' }} />
              </ListItemButton>
            </ListItem>
          ))}
          {rockets.length === 0 && (
             <Box sx={{ p: 3, textAlign: 'center', opacity: 0.5 }}>
               <Typography variant="caption">无匹配结果</Typography>
             </Box>
          )}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f7' }}>
      
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1200, bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none', boxShadow: '1px 0 20px rgba(0,0,0,0.02)' },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 5 }, width: { md: `calc(100% - ${drawerWidth}px)` }, height: '100vh', overflowY: 'auto' }}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 6, mt: { xs: 8, md: 0 } }}>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: -1 }}>
              {filters.country ? `${filters.country}火箭` : '全球运载火箭库'}
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
              已筛选出 {rockets.length} 款型号
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ pb: 10 }}>
            {rockets.map((rocket) => (
              <Grid item xs={12} sm={6} lg={4} xl={3} key={rocket.id}>
                <Fade in={true}>
                  <Card sx={{ 
                    height: '100%', display: 'flex', flexDirection: 'column', 
                    borderRadius: 4,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }
                  }}>
                    <Box sx={{ position: 'relative' }}>
                       <CardMedia
                        component="img"
                        height="200"
                        image={rocket.imageUrl}
                        alt={rocket.name}
                        sx={{ bgcolor: '#f0f0f0' }}
                      />
                      <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1 }}>
                         <Chip label={rocket.status || '未知'} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', fontWeight: 700, fontSize: '0.7rem' }} />
                      </Box>
                    </Box>
                    
                    <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="overline" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '0.7rem' }}>{rocket.country}</Typography>
                        {rocket.isReusable && <Chip label="♻️" size="small" variant="outlined" sx={{ height: 20, border: 'none', bgcolor: '#e8f5e9' }} />}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.2 }}>{rocket.name}</Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2, height: 40, overflow: 'hidden', fontSize: '0.85rem' }}>
                        {rocket.description}
                      </Typography>
                      
                      <Box sx={{ bgcolor: '#f5f5f7', p: 1.5, borderRadius: 3 }}>
                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>LEO Payload</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 800 }}>{rocket.leoCapacity} t</Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={Math.min(((rocket.leoCapacity || 0) / 150) * 100, 100)} sx={{ height: 6, borderRadius: 3 }} />
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 2.5, pt: 0 }}>
                      <Button variant="contained" fullWidth disableElevation onClick={() => setSelectedRocket(rocket)} sx={{ borderRadius: 3, fontWeight: 700, bgcolor: '#000', '&:hover': { bgcolor: '#333' } }}>
                        View Specs
                      </Button>
                    </CardActions>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 详情弹窗 */}
      <Dialog open={!!selectedRocket} onClose={() => setSelectedRocket(null)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 6, overflow: 'hidden' } }}>
        {selectedRocket && (
          <Grid container>
            <Grid item xs={12} md={5} sx={{ bgcolor: '#f5f5f7' }}>
               <Box component="img" src={selectedRocket.imageUrl} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Grid>
            <Grid item xs={12} md={7}>
              <Box sx={{ p: 5, position: 'relative' }}>
                <IconButton onClick={() => setSelectedRocket(null)} sx={{ position: 'absolute', right: 16, top: 16 }}><CloseIcon /></IconButton>
                <Stack direction="row" spacing={1} mb={1}>
                  <Chip label={selectedRocket.country} size="small" />
                  <Chip label={selectedRocket.status} size="small" color={selectedRocket.status === '现役' ? 'success' : 'default'} />
                </Stack>
                
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>{selectedRocket.name}</Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>{selectedRocket.manufacturer}</Typography>
                
                <Grid container spacing={4}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 800, mb: 2 }}>PERFORMANCE</Typography>
                    <StatRow label="LEO 运力" value={selectedRocket.leoCapacity} unit="t" />
                    <StatRow label="GTO 运力" value={selectedRocket.gtoCapacity} unit="t" />
                    <StatRow label="起飞推力" value={selectedRocket.firstStageThrust} unit="" />
                  </Grid>
                  <Grid item xs={6}>
                     <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 800, mb: 2 }}>DIMENSIONS</Typography>
                     <StatRow label="高度" value={selectedRocket.height} unit="m" />
                     <StatRow label="直径" value={selectedRocket.diameter} unit="m" />
                     <StatRow label="级数" value={selectedRocket.stages} unit="" />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}><StatRow label="一级引擎" value={selectedRocket.firstStageEngine} unit="" /></Grid>
                      <Grid item xs={6}><StatRow label="一级燃料" value={selectedRocket.firstStageFuel} unit="" /></Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 4 }}>
                   <Typography variant="body2" sx={{ lineHeight: 1.8, color: '#555' }}>{selectedRocket.description}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </Dialog>
    </Box>
  );
}

export default App;
