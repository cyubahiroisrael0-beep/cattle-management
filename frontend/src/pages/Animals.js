import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import DatePickerField from '../components/DatePickerField';
import axios from 'axios';
import { API_URL } from '../utils/api';

export default function Animals() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [formData, setFormData] = useState({
    number: '',
    type: 'cow',
    age: new Date(),
    status: 'active',
    gender: 'male',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const params = {};
      if (filterType !== 'all') params.type = filterType;
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterGender !== 'all') params.gender = filterGender;
      if (search) params.search = search;

      const response = await axios.get(`${API_URL}/animals`, { params });
      setAnimals(response.data);
    } catch (error) {
      setError('Failed to fetch animals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, [filterType, filterStatus, filterGender, search]);

  const handleOpen = (animal = null) => {
    if (animal) {
      setEditingAnimal(animal);
      setFormData({
        number: animal.number,
        type: animal.type,
        age: new Date(animal.age),
        gender: animal.gender || 'male',
        status: animal.status,
        image: null,
      });
      setImagePreview(animal.image ? `${API_URL.replace('/api', '')}${animal.image}` : null);
    } else {
      setEditingAnimal(null);
      setFormData({
        number: '',
        type: 'cow',
        age: new Date(),
        gender: 'male',
        status: 'active',
        image: null,
      });
      setImagePreview(null);
    }
    setOpen(true);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAnimal(null);
    setFormData({
      number: '',
      type: 'cow',
      age: new Date(),
      gender: 'male',
      status: 'active',
      image: null,
    });
    setImagePreview(null);
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.number) {
      setError(t('animals.required'));
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('number', formData.number);
      submitData.append('type', formData.type);
      submitData.append('age', formData.age.toISOString().split('T')[0]);
      submitData.append('gender', formData.gender);
      submitData.append('status', formData.status);
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (editingAnimal) {
        await axios.put(`${API_URL}/animals/${editingAnimal.id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(`${API_URL}/animals`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      handleClose();
      fetchAnimals();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save animal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('animals.deleteConfirm'))) {
      try {
        await axios.delete(`${API_URL}/animals/${id}`);
        fetchAnimals();
      } catch (error) {
        setError('Failed to delete animal');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'success',
      sold: 'warning',
      dead: 'error',
      other: 'default',
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h4">{t('animals.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          {t('animals.addAnimal')}
        </Button>
      </Box>

      <Box mb={3} display="flex" gap={2} flexWrap="wrap">
        <TextField
          label={t('animals.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>{t('animals.type')}</InputLabel>
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} label={t('animals.type')}>
            <MenuItem value="all">{t('animals.allTypes')}</MenuItem>
            <MenuItem value="cow">{t('animals.cow')}</MenuItem>
            <MenuItem value="goat">{t('animals.goat')}</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>{t('animals.status')}</InputLabel>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label={t('animals.status')}>
            <MenuItem value="all">{t('animals.allStatuses')}</MenuItem>
            <MenuItem value="active">{t('animals.active')}</MenuItem>
            <MenuItem value="sold">{t('animals.sold')}</MenuItem>
            <MenuItem value="dead">{t('animals.dead')}</MenuItem>
            <MenuItem value="other">{t('animals.other')}</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>{t('animals.gender')}</InputLabel>
          <Select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} label={t('animals.gender')}>
            <MenuItem value="all">{t('animals.allGenders')}</MenuItem>
            <MenuItem value="male">{t('animals.male')}</MenuItem>
            <MenuItem value="female">{t('animals.female')}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {animals.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 4 }}>
          {t('animals.noAnimals')}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {animals.map((animal) => (
            <Grid item xs={12} sm={6} md={4} key={animal.id}>
              <Card>
                {animal.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${API_URL.replace('/api', '')}${animal.image}`}
                    alt={animal.number}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" mb={1}>{t('animals.code')}: {animal.number}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {t('animals.type')}: {t(`animals.${animal.type}`)}<br />
                    {t('animals.age')}: {calculateAge(animal.age)}<br />
                    {t('animals.gender')}: {t(`animals.${animal.gender || 'male'}`)}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Chip
                      label={t(`animals.${animal.status}`)}
                      color={getStatusColor(animal.status)}
                      size="small"
                    />
                    <Box display="flex" gap={1}>
                      <IconButton size="small" onClick={() => handleOpen(animal)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(animal.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingAnimal ? t('animals.editAnimal') : t('animals.addAnimal')}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label={t('animals.number')}
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('animals.type')}</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              label={t('animals.type')}
            >
              <MenuItem value="cow">{t('animals.cow')}</MenuItem>
              <MenuItem value="goat">{t('animals.goat')}</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('animals.gender')}</InputLabel>
            <Select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              label={t('animals.gender')}
            >
              <MenuItem value="male">{t('animals.male')}</MenuItem>
              <MenuItem value="female">{t('animals.female')}</MenuItem>
            </Select>
          </FormControl>
          <DatePickerField
            selected={formData.age}
            onChange={(date) => setFormData({ ...formData, age: date })}
            label={t('animals.age')}
            maxDate={new Date()}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('animals.status')}</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              label={t('animals.status')}
            >
              <MenuItem value="active">{t('animals.active')}</MenuItem>
              <MenuItem value="sold">{t('animals.sold')}</MenuItem>
              <MenuItem value="dead">{t('animals.dead')}</MenuItem>
              <MenuItem value="other">{t('animals.other')}</MenuItem>
            </Select>
          </FormControl>
          <Box mt={2}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload">
              <Button variant="outlined" component="span" fullWidth>
                {imagePreview ? t('animals.changeImage') : t('animals.selectImage')}
              </Button>
            </label>
            {imagePreview && (
              <Box mt={2}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('common.cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

