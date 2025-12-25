import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Box, Grid, Chip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';

function App() {
  const [rockets, setRockets] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRocket, setSelectedRocket] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchRockets();
  }, [search]);

  const fetchRockets = async () => {
    try {
      const response = await axios.get(`/api/rockets?search=${search}`);
      setRockets(response.data);
    } catch (error) {
      console.error("Error fetching rockets:", error);
    }
  };

  const handleOpenDetail = (rocket) => {
    setSelectedRocket(rocket);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
        全球运载火箭信息查询系统
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-end' }}>
        <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
        <TextField
          fullWidth
          label="按名称、制造商或系列搜索"
          variant="standard"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>型号</TableCell>
              <TableCell>系列</TableCell>
              <TableCell>国家</TableCell>
              <TableCell>制造商</TableCell>
              <TableCell>LEO运力 (t)</TableCell>
              <TableCell>状态</TableCell>
              <TableCell align="center">详情</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rockets.map((rocket) => (
              <TableRow key={rocket.id} hover>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                  {rocket.name}
                </TableCell>
                <TableCell>{rocket.series}</TableCell>
                <TableCell>{rocket.country}</TableCell>
                <TableCell>{rocket.manufacturer}</TableCell>
                <TableCell>{rocket.leoCapacity || '-'}</TableCell>
                <TableCell>
                  <Chip 
                    label={rocket.status || '未知'} 
                    size="small" 
                    color={rocket.status === '现役' ? 'success' : 'default'} 
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleOpenDetail(rocket)}>
                    <InfoIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 详情对话框 */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        {selectedRocket && (
          <>
            <DialogTitle sx={{ backgroundColor: '#1976d2', color: '#fff' }}>
              {selectedRocket.name} 详细参数
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={6}><Typography variant="subtitle2">系列:</Typography><Typography>{selectedRocket.series}</Typography></Grid>
                <Grid item xs={6}><Typography variant="subtitle2">制造商:</Typography><Typography>{selectedRocket.manufacturer}</Typography></Grid>
                <Grid item xs={6}><Typography variant="subtitle2">国家:</Typography><Typography>{selectedRocket.country}</Typography></Grid>
                <Grid item xs={6}><Typography variant="subtitle2">首发时间:</Typography><Typography>{selectedRocket.firstFlight || '-'}</Typography></Grid>
                <Grid item xs={6}><Typography variant="subtitle2">高度/直径:</Typography><Typography>{selectedRocket.height}m / {selectedRocket.diameter}m</Typography></Grid>
                <Grid item xs={6}><Typography variant="subtitle2">LEO/GTO 运力:</Typography><Typography>{selectedRocket.leoCapacity}t / {selectedRocket.gtoCapacity}t</Typography></Grid>
                <Grid item xs={12}><Typography variant="subtitle2">燃料类型:</Typography><Typography>{selectedRocket.fuel}</Typography></Grid>
                <Grid item xs={12}><Typography variant="subtitle2">是否可回收:</Typography><Typography>{selectedRocket.isReusable ? '是' : '否'}</Typography></Grid>
                <Grid item xs={12}><Typography variant="subtitle2">核心特征:</Typography><Typography>{selectedRocket.description}</Typography></Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>关闭</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}

export default App;
