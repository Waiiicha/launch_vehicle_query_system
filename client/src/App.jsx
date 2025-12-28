import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, TextField, Grid, Card, CardContent, CardActions, CardMedia,
  Button, Dialog, Box, Slider, FormControlLabel,
  Switch, Chip, Stack, LinearProgress, Paper, InputAdornment, Fade,
  MenuItem, Select, FormControl, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon,
  IconButton, useMediaQuery, useTheme, InputLabel, Backdrop
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

const drawerWidth = 320;

// 厂商数据
const allManufacturers = [
  { value: '航天一院', label: 'CASC 一院 (CALT)', country: '中国' },
  { value: '航天八院', label: 'CASC 八院 (SAST)', country: '中国' },
  { value: '航天科工', label: '航天科工 (ExPace)', country: '中国' },
  { value: '蓝箭', label: '蓝箭航天 (LandSpace)', country: '中国' },
  { value: '星河', label: '星河动力 (Galactic Energy)', country: '中国' },
  { value: '东方空间', label: '东方空间 (Orienspace)', country: '中国' },
  { value: '中科宇航', label: '中科宇航 (CAS Space)', country: '中国' },
  { value: '天兵', label: '天兵科技 (Space Pioneer)', country: '中国' },
  { value: '星际荣耀', label: '星际荣耀 (i-Space)', country: '中国' },
  { value: '深蓝航天', label: '深蓝航天 (Deep Blue)', country: '中国' },
  { value: 'SpaceX', label: 'SpaceX', country: '美国' },
  { value: 'NASA', label: 'NASA', country: '美国' },
  { value: 'ULA', label: 'ULA (Atlas/Delta/Vulcan)', country: '美国' },
  { value: 'Blue Origin', label: 'Blue Origin', country: '美国' },
  { value: 'Rocket Lab', label: 'Rocket Lab', country: '美国' },
  { value: 'Northrop Grumman', label: 'Northrop Grumman', country: '美国' },
  { value: 'Firefly', label: 'Firefly Aerospace', country: '美国' },
  { value: 'Arianespace', label: 'Arianespace', country: '欧洲' },
  { value: 'Khrunichev', label: '赫鲁尼切夫 (Khrunichev)', country: '俄罗斯' },
  { value: 'JAXA', label: 'JAXA', country: '日本' },
];

function App() {
  const [rockets, setRockets] = useState([]); // 显示的数据
  const [selectedRocket, setSelectedRocket] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // 图片浏览状态
  const [activeImage, setActiveImage] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    country: '',      
    leoRange: [0, 160],
    fuel: '',
    isReusable: false,
    status: '',
    stages: '',
    manufacturer: ''
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const availableManufacturers = filters.country 
    ? allManufacturers.filter(m => m.country === filters.country)
    : allManufacturers;

  // 核心改动：本地筛选逻辑
  useEffect(() => {
    filterRockets();
  }, [filters]);

  useEffect(() => {
    if (selectedRocket) {
      const images = getRocketImages(selectedRocket);
      setActiveImage(images[0]);
    }
  }, [selectedRocket]);

  const getRocketImages = (rocket) => {
    if (!rocket.imageUrl) return [`https://placehold.co/800x600/f5f5f7/1d1d1f?text=${rocket.name}`];
    try {
      const parsed = JSON.parse(rocket.imageUrl);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      return [rocket.imageUrl];
    } catch (e) {
      return [rocket.imageUrl];
    }
  };

  const filterRockets = () => {
    // 假设 rocketsData 已经通过 import 导入或者在组件外部定义
    // 由于之前改为纯静态，这里我们需要确保 rocketsData 能够被访问
    // 为了兼容性，如果你在本地运行 npm run dev (静态模式)，需要确保 rockets.json 被正确引入
    // 如果是动态模式，这里其实应该是 axios 调用。
    // *重要*：为了保证你现在的环境（可能是静态也可能是动态）都能跑，
    // 我保留了 axios 的结构，但如果你已经在用静态 JSON，请确保 import 路径正确。
    // 鉴于上一步我们已经完全静态化，这里我使用 fetch 动态加载 public/data/rockets.json (或者 import)
    // 但为了最稳妥，我还是恢复 axios 调用本地 API (因为 start.bat 还在跑后端)
    // 或者直接 import。鉴于之前的代码是 import，我这里保持 import 逻辑。
    // 但是！上面的 import rocketsData 被注释掉了吗？
    // 让我们用一种通用的方法：尝试 fetch json，如果失败则用 API。
    
    // 既然之前的代码已经改成了 import rocketsData，我们这里假定数据源已经有了。
    // *修正*：我将使用 import 方式，因为这是我们最后确定的方案。
    import('./data/rockets.json').then(module => {
        let result = module.default;
        // ... (筛选逻辑)
        if (filters.search) {
          const keyword = filters.search.toLowerCase();
          result = result.filter(r => 
            (r.name && r.name.toLowerCase().includes(keyword)) ||
            (r.manufacturer && r.manufacturer.toLowerCase().includes(keyword)) ||
            (r.series && r.series.toLowerCase().includes(keyword))
          );
        }
        if (filters.country) result = result.filter(r => r.country === filters.country);
        if (filters.isReusable) result = result.filter(r => r.isReusable === true);
        const [minLeo, maxLeo] = filters.leoRange;
        result = result.filter(r => {
          const capacity = r.leoCapacity || 0;
          return maxLeo < 160 ? (capacity >= minLeo && capacity <= maxLeo) : capacity >= minLeo;
        });
        if (filters.fuel) result = result.filter(r => r.firstStageFuel && r.firstStageFuel.includes(filters.fuel));
        if (filters.status) result = result.filter(r => r.status && r.status.includes(filters.status));
        if (filters.stages) result = result.filter(r => r.stages && String(r.stages).includes(filters.stages));
        if (filters.manufacturer) result = result.filter(r => r.manufacturer && r.manufacturer.includes(filters.manufacturer));

        result.sort((a, b) => (b.leoCapacity || 0) - (a.leoCapacity || 0));
        setRockets(result);
    });
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

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    const currentManufacturer = allManufacturers.find(m => m.value === filters.manufacturer);
    let newManufacturer = filters.manufacturer;
    if (newCountry && currentManufacturer && currentManufacturer.country !== newCountry) {
      newManufacturer = '';
    }
    setFilters({ ...filters, country: newCountry, manufacturer: newManufacturer });
  };

  const StatRow = ({ label, value, unit, highlight }) => {
    if (value === null || value === undefined || value === '') return null;
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.2, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <Typography variant="body2" color="textSecondary">{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: highlight ? 'primary.main' : 'inherit' }}>
          {value} {unit}
        </Typography>
      </Box>
    );
  };

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
      <Box sx={{ p: 3, overflowY: 'auto', flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <Box sx={{ mb: 3 }}>
           <Typography variant="h6" sx={{ fontWeight: 800, color: '#000', letterSpacing: -0.5 }}>ROCKET DB</Typography>
           <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 500 }}>Control Center (Static)</Typography>
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
        
        <FilterSelect 
          label="国家 / Country"
          value={filters.country}
          onChange={handleCountryChange}
          options={[
            { value: '中国', label: '🇨🇳 中国 (China)' },
            { value: '美国', label: '🇺🇸 美国 (USA)' },
            { value: '欧洲', label: '🇪🇺 欧洲 (Europe)' },
            { value: '俄罗斯', label: '🇷🇺 俄罗斯 (Russia)' },
            { value: '日本', label: '🇯🇵 日本 (Japan)' },
          ]}
        />

        <FilterSelect 
          label="研制单位 / Manufacturer"
          value={filters.manufacturer}
          onChange={(e) => setFilters({...filters, manufacturer: e.target.value})}
          options={availableManufacturers}
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

        <Box sx={{ px: 1, mb: 2, bgcolor: '#f5f5f7', p: 2, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>近地轨道运力 (LEO)</Typography>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>{filters.leoRange[0]}-{filters.leoRange[1]}t</Typography>
          </Box>
          <Slider
            value={filters.leoRange}
            onChange={(e, val) => setFilters({...filters, leoRange: val})}
            min={0} max={160} size="small"
          />
        </Box>

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

      <Box sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: '#fafafa', p: 0 }}>
        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 700, py: 2, px: 3, display: 'block', bgcolor: '#fafafa', position: 'sticky', top: 0, zIndex: 1, borderBottom: '1px solid #eee' }}>
          结果目录 ({rockets.length})
        </Typography>
        <List dense>
          {rockets.map((rocket) => (
            <ListItem key={rocket.id} disablePadding>
              <ListItemButton onClick={() => setSelectedRocket(rocket)} sx={{ px: 3, py: 1 }}>
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
                        image={getRocketImages(rocket)[0]}
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
                        查看详情
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
      <Dialog 
        open={!!selectedRocket} 
        onClose={() => setSelectedRocket(null)} 
        maxWidth="lg" 
        fullWidth 
        PaperProps={{ 
          sx: { 
            borderRadius: 4, 
            overflow: 'hidden',
            height: { xs: 'calc(100% - 32px)', md: '80vh' }, // Mobile: almost full height; Desktop: 80vh
            maxHeight: '100%'
          } 
        }}
      >
        {selectedRocket && (
          <Grid container sx={{ height: '100%', overflowY: { xs: 'auto', md: 'hidden' } }}>
            {/* 左侧：图片区 */}
            <Grid item xs={12} md={4} sx={{ bgcolor: '#f5f5f7', display: 'flex', flexDirection: 'column', borderRight: '1px solid #eee' }}>
               <Box sx={{ flexGrow: 1, position: 'relative', minHeight: 300, cursor: 'zoom-in' }} onClick={() => setLightboxOpen(true)}>
                 <Box component="img" src={activeImage} sx={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }} />
                 <Box sx={{ position: 'absolute', bottom: 16, right: 16, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '50%', p: 1, display: 'flex' }}>
                    <ZoomInIcon fontSize="small" />
                 </Box>
               </Box>
               
               {getRocketImages(selectedRocket).length > 1 && (
                 <Box sx={{ p: 2, pb: 3, display: 'flex', gap: 1, overflowX: 'auto', bgcolor: '#fff', borderTop: '1px solid #eee', flexShrink: 0 }}>
                   {getRocketImages(selectedRocket).map((img, idx) => (
                     <Box 
                       key={idx}
                       component="img" 
                       src={img} 
                       onClick={() => setActiveImage(img)}
                       sx={{ 
                         width: 70, height: 70, objectFit: 'cover', borderRadius: 2, cursor: 'pointer',
                         border: activeImage === img ? '2px solid #0066cc' : '2px solid transparent',
                         transition: 'border 0.2s',
                         flexShrink: 0 
                       }} 
                     />
                   ))}
                 </Box>
               )}
            </Grid>
            
            {/* 右侧：信息区 */}
            <Grid item xs={12} md={8}>
              <Box sx={{ p: 5, position: 'relative', height: { md: '100%', xs: 'auto' }, overflowY: { md: 'auto', xs: 'visible' } }}>
                <IconButton onClick={() => setSelectedRocket(null)} sx={{ position: 'absolute', right: 16, top: 16 }}><CloseIcon /></IconButton>
                
                <Stack direction="row" spacing={1} mb={2}>
                  <Chip label={selectedRocket.country} size="small" />
                  <Chip label={selectedRocket.status} size="small" color={selectedRocket.status === '现役' ? 'success' : 'default'} />
                  {selectedRocket.series && <Chip label={selectedRocket.series} size="small" variant="outlined" />}
                </Stack>
                
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>{selectedRocket.name}</Typography>
                <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 2 }}>{selectedRocket.manufacturer}</Typography>

                {/* 1. 概述 OVERVIEW */}
                <Box sx={{ mb: 4, p: 2.5, bgcolor: '#f9f9fa', borderRadius: 3, borderLeft: '4px solid #0066cc' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: '#0066cc' }}>概述 OVERVIEW</Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.7, color: '#444' }}>
                    {selectedRocket.description || '暂无该型号的详细描述数据。'}
                  </Typography>
                </Box>
                
                <Grid container spacing={6}>
                  {/* 2. 运载能力 PAYLOAD */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>运载能力</Typography>
                    <StatRow label="近地轨道 (LEO)" value={selectedRocket.leoCapacity} unit="t" highlight />
                    <StatRow label="同步转移 (GTO)" value={selectedRocket.gtoCapacity} unit="t" />
                    <StatRow label="火星转移 (MTO)" value={selectedRocket.marsCapacity} unit="t" />
                    <StatRow label="冥王星/深空" value={selectedRocket.plutoCapacity} unit="t" />
                  </Grid>

                  {/* 3. 物理规格 SPECS */}
                  <Grid item xs={12} sm={6}>
                     <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>物理规格</Typography>
                     <StatRow label="全箭高度" value={selectedRocket.height} unit="m" />
                     <StatRow label="芯级直径" value={selectedRocket.diameter} unit="m" />
                     <StatRow label="起飞质量" value={selectedRocket.mass} unit="t" />
                     <StatRow label="起飞推力" value={selectedRocket.firstStageThrust} unit="" />
                     <StatRow label="构型级数" value={selectedRocket.stages} unit="" />
                  </Grid>

                  <Grid item xs={12}><Divider /></Grid>

                  {/* 4. 推进系统 PROPULSION */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>推进系统</Typography>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 700 }}>一级 & 助推 (Stage 1)</Typography>
                        <StatRow label="一级引擎" value={selectedRocket.firstStageEngine} unit="" />
                        <StatRow label="一级燃料" value={selectedRocket.firstStageFuel} unit="" />
                        <StatRow label="助推器配置" value={selectedRocket.boosters} unit="" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 700 }}>上面级 (Upper Stages)</Typography>
                        <StatRow label="二级引擎" value={selectedRocket.secondStageEngine} unit="" />
                        <StatRow label="二级燃料" value={selectedRocket.secondStageFuel} unit="" />
                        {selectedRocket.thirdStageEngine && (
                          <>
                            <Box sx={{ my: 1, borderTop: '1px dashed #eee' }} />
                            <StatRow label="三级引擎" value={selectedRocket.thirdStageEngine} unit="" />
                            <StatRow label="三级燃料" value={selectedRocket.thirdStageFuel} unit="" />
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* 5. 回收 RECOVERY */}
                  {selectedRocket.isReusable && (
                    <Grid item xs={12}>
                      <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: '#e8f5e9', border: '1px solid #c8e6c9', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircleIcon color="success" />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                            {selectedRocket.recoveryMethod || '支持垂直回收 (VTVL)'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">该型号具备重复使用能力，可有效降低发射成本。</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}

                  <Grid item xs={12}><Divider /></Grid>

                  {/* 6. 历史概况 HISTORY */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 800, mb: 2 }}>历史概况</Typography>
                    <Grid container spacing={4}>
                      <Grid item xs={6}>
                        <StatRow label="首飞时间" value={selectedRocket.firstFlight} unit="" />
                      </Grid>
                      <Grid item xs={6}>
                        <StatRow label="发射记录" value={selectedRocket.history} unit="" />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Box sx={{ height: 40 }} />
              </Box>
            </Grid>
          </Grid>
        )}
      </Dialog>

      {/* Lightbox 大图浏览 */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 9999, bgcolor: 'rgba(0,0,0,0.9)' }}
        open={lightboxOpen}
        onClick={() => setLightboxOpen(false)}
      >
        {selectedRocket && (
          <Box 
            component="img" 
            src={activeImage} 
            sx={{ 
              maxWidth: '90vw', 
              maxHeight: '90vh', 
              objectFit: 'contain',
              boxShadow: '0 0 50px rgba(0,0,0,0.5)' 
            }} 
          />
        )}
        <Typography sx={{ position: 'absolute', bottom: 30, color: 'white', opacity: 0.7 }}>点击任意处关闭</Typography>
      </Backdrop>
    </Box>
  );
}

export default App;
