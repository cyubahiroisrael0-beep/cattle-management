import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TextField } from '@mui/material';

const DatePickerField = ({ selected, onChange, label, maxDate, required }) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      maxDate={maxDate}
      dateFormat="yyyy-MM-dd"
      customInput={
        <TextField
          fullWidth
          label={label}
          required={required}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
      }
    />
  );
};

export default DatePickerField;

