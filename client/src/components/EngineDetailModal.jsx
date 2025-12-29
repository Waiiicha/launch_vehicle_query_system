import React, { useState, useEffect } from 'react';
import enginesData from '../data/engines.json';
import {
  Dialog, Box, Typography, IconButton, Grid, Chip, Divider,
  Stack, Card, CardContent, CardMedia, Button, List, ListItem, ListItemButton, ListItemText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function EngineDetailModal({ engineName, currentList, onClose, onSelectRocket, onSelectEngine }) {
  const [engine, setEngine] = useState(null);

  useEffect(() => {
    if (engineName) {
        // Find engine from static data
        const found = enginesData.find(e => e.name === engineName);
        setEngine(found || null);
    }
  }, [engineName]);

  if (!engine) return null;

  const StatRow = ({ label, value }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
      <Typography variant="body2" color="textSecondary">{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>{value || '-'}</Typography>
    </Box>
  );

  return (
    <Dialog 
      open={!!engineName} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{ 
        sx: { 
          borderRadius: 4, 
          height: { xs: 'calc(100% - 32px)', md: '80vh' },
          maxHeight: '100%',
          overflow: 'hidden'
        } 
      }}
    >
      <Grid container sx={{ height: '100%' }}>
        {/* Left Column: Image & Navigation List */}
        <Grid item xs={12} md={4} sx={{ bgcolor: '#f5f5f7', display: 'flex', flexDirection: 'column', borderRight: '1px solid #eee' }}>
           {/* Image Placeholder */}
           <Box sx={{ height: '100%', bgcolor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
             {/* Future: Add engine image logic here */}
             <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>NO ENGINE IMAGE AVAILABLE</Typography>
             <Box sx={{ position: 'absolute', bottom: 12, left: 12 }}>
                <Chip label="ENGINE VIEW" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: '0.65rem' }} />
             </Box>
           </Box>
        </Grid>

        {/* Right Column: Info */}
        <Grid item xs={12} md={8} sx={{ height: '100%', overflowY: 'auto', position: 'relative' }}>
          <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16, zIndex: 10 }}><CloseIcon /></IconButton>
          
          <Box sx={{ p: 5 }}>
                    <Stack direction="row" spacing={1} mb={2}>
                      <Chip icon={<LocalFireDepartmentIcon fontSize="small" />} label={engine.propellant} color="error" size="small" variant="outlined" />
                    </Stack>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{engine.name}</Typography>
            <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 4 }}>{engine.manufacturer}</Typography>

            {/* Overview Section */}
            <Box sx={{ mb: 4, p: 2.5, bgcolor: '#f9f9fa', borderRadius: 3, borderLeft: '4px solid #0066cc' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: '#0066cc' }}>概述 OVERVIEW</Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.7, color: '#444' }}>
                {engine.description ? engine.description.replace(/^变推\/复用:\s*/, '') : '暂无详细技术描述。'}
              </Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>技术规格 SPECS</Typography>
                <StatRow label="海平面推力" value={engine.thrust} />
                <StatRow label="真空/海平面比冲" value={engine.specificImpulse} />
                <StatRow label="循环方式" value={engine.cycle} />
                <StatRow label="研制状态" value={engine.status} />
                
                <Box sx={{ my: 2, borderTop: '1px dashed #eee' }} />
                
                <StatRow label="发动机重量" value={engine.weight} />
                <StatRow label="推重比" value={engine.twRatio} />
                <StatRow label="推力调节" value={engine.throttleRange} />
                <StatRow label="摇摆角度" value={engine.gimbalAngle} />
                <StatRow label="启动次数" value={engine.restartCount} />
                <StatRow label="成组方式" value={engine.clustering} />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>应用载具 Powered By</Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {engine.relatedRockets && engine.relatedRockets.length > 0 ? (
                      engine.relatedRockets.map(rocket => (
                        <Button
                          key={rocket.id}
                          variant="outlined"
                          onClick={() => onSelectRocket(rocket)}
                          endIcon={<ArrowForwardIosIcon fontSize="small" />}
                          sx={{ 
                            justifyContent: 'space-between', 
                            textTransform: 'none', 
                            borderColor: '#eee', 
                            color: '#333',
                            py: 1,
                            '&:hover': { borderColor: '#0066cc', bgcolor: '#f0f7ff' } 
                          }}
                        >
                          <Box sx={{ textAlign: 'left' }}>
                            <Typography variant="body2" fontWeight={700}>{rocket.name}</Typography>
                            <Typography variant="caption" color="textSecondary">{rocket.manufacturer}</Typography>
                          </Box>
                        </Button>
                      ))
                  ) : (
                    <Typography variant="caption" color="textSecondary" sx={{ fontStyle: 'italic', p: 1 }}>
                      暂无关联数据 (Ref: {engine.usedBy})
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
}
