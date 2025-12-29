import React from 'react';
import {
  Container, Typography, Grid, Card, CardContent, CardActions,
  Button, Box, Fade, Chip, Stack
} from '@mui/material';

export default function EngineList({ engines, onSelectEngine }) {
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: -1, mb: 3 }}>
          火箭发动机引擎库
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {engines.map((engine) => (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={engine.id}>
            <Fade in={true}>
              <Card sx={{ 
                height: '100%', display: 'flex', flexDirection: 'column', 
                borderRadius: 4,
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }
              }}>
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Chip label={engine.propellant || '未知燃料'} size="small" sx={{ bgcolor: '#f0f0f0', fontWeight: 600, fontSize: '0.7rem' }} />
                    <Typography variant="caption" color="textSecondary">{engine.manufacturer}</Typography>
                  </Stack>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 0 }}>{engine.name}</Typography>
                </CardContent>
                <CardActions sx={{ p: 2.5, pt: 0 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={() => onSelectEngine(engine.name)}
                    sx={{ borderRadius: 3, fontWeight: 700, borderColor: '#eee', color: '#333', '&:hover': { borderColor: '#333', bgcolor: 'transparent' } }}
                  >
                    查看详情
                  </Button>
                </CardActions>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
