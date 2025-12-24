import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import PetsIcon from '@mui/icons-material/Pets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCow } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@iconify/react';
import { API_URL } from '../utils/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    cows: 0,
    goats: 0,
    active: 0,
    sold: 0,
    dead: 0,
  });
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/animals`);
      const animals = response.data;

      const stats = {
        total: animals.length,
        cows: animals.filter((a) => a.type === 'cow').length,
        goats: animals.filter((a) => a.type === 'goat').length,
        active: animals.filter((a) => a.status === 'active').length,
        sold: animals.filter((a) => a.status === 'sold').length,
        dead: animals.filter((a) => a.status === 'dead').length,
      };

      setStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
      <CardContent sx={{ px: 3, py: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="subtitle2">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 2,
              background: `linear-gradient(135deg, ${color} 0%, ${color}aa 100%)`,
              mr: 0
            }}>
              <Box sx={{ color: '#fff', fontSize: 36 }}>{icon}</Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('dashboard.title')}
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={t('dashboard.totalAnimals')}
            value={stats.total}
            icon={<PetsIcon fontSize="inherit" />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={t('dashboard.cows')}
            value={stats.cows}
            icon={<FontAwesomeIcon icon={faCow} style={{ fontSize: 'inherit' }} />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={t('dashboard.goats')}
            value={stats.goats}
            icon={<Icon icon="mdi:sheep" color="white" width="36" height="36" />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={t('dashboard.active')}
            value={stats.active}
            icon={<PetsIcon fontSize="inherit" />}
            color="#8bc34a"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={t('dashboard.sold')}
            value={stats.sold}
            icon={<PetsIcon fontSize="inherit" />}
            color="#ffc107"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={t('dashboard.dead')}
            value={stats.dead}
            icon={<PetsIcon fontSize="inherit" />}
            color="#f44336"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

