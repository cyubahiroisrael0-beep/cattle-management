import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Select,
  MenuItem,
  FormControl,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Grow from '@mui/material/Grow';
import { alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PetsIcon from '@mui/icons-material/Pets';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useThemeMode } from '../contexts/ThemeModeContext';

const drawerWidth = 240;

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { logout, user } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDashboard = location.pathname === '/dashboard';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLanguageChange = (event) => {
    const lang = event.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const menuItems = [
    { text: t('dashboard.title'), icon: <DashboardIcon />, path: '/dashboard' },
    { text: t('animals.title'), icon: <PetsIcon />, path: '/animals' },
  ];

  const drawer = (
    <Box>
      <Toolbar sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}` }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          {t('app.title')}
        </Typography>
      </Toolbar>
      <List sx={{ px: 1.5, py: 2 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem
              button
              key={item.text}
              selected={active}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  '& .MuiListItemIcon-root': { color: theme.palette.primary.main },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: active ? 600 : 400 }} />
            </ListItem>
          );
        })}
        <ListItem 
          button 
          onClick={logout} 
          sx={{ borderRadius: 2, mt: 2, color: theme.palette.error.main }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={t('auth.logout')} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          // Optimized for the Deep Sea Emerald theme colors:
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: 'none', // Cleaner, modern flat look
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {user?.name || t('common.welcome')}
          </Typography>
          
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 1 }}>
            <Select
              value={i18n.language}
              onChange={handleLanguageChange}
              sx={{
                fontSize: '0.875rem',
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.action.hover, 0.05),
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              }}
            >
              <MenuItem value="en">{t('language.english')}</MenuItem>
              <MenuItem value="fr">{t('language.french')}</MenuItem>
              <MenuItem value="rw">{t('language.kinyarwanda')}</MenuItem>
              <MenuItem value="sw">{t('language.kiswahili')}</MenuItem>
            </Select>
          </FormControl>

          <IconButton 
            sx={{ 
              ml: 1, 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
            }} 
            color="primary" 
            onClick={toggleMode}
          >
            <Brightness4Icon sx={{ 
              transition: 'transform 0.4s ease', 
              transform: mode === 'dark' ? 'rotate(180deg)' : 'rotate(0deg)' 
            }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: theme.palette.background.paper,
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}