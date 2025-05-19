import React, { useState } from 'react';
import { 
  CssBaseline, 
  ThemeProvider, 
  createTheme, 
  AppBar, 
  Toolbar, 
  Typography, 
  Box,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import NetWorthCalculator from './components/NetWorthCalculator';
import QuadrantNetWorthCalculator from './components/QuadrantNetWorthCalculator';
import './App.css';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  const [calculatorType, setCalculatorType] = useState<'single' | 'quadrant'>('single');

  const handleCalculatorTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: 'single' | 'quadrant' | null,
  ) => {
    if (newType !== null) {
      setCalculatorType(newType);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Net Worth Projection Calculator
            </Typography>
            <ToggleButtonGroup
              color="standard"
              value={calculatorType}
              exclusive
              onChange={handleCalculatorTypeChange}
              aria-label="Calculator Type"
              size="small"
              sx={{ 
                bgcolor: 'white', 
                '& .MuiToggleButton-root.Mui-selected': {
                  bgcolor: 'rgba(25, 118, 210, 0.2)',
                  color: 'primary.main',
                  fontWeight: 'bold'
                }
              }}
            >
              <ToggleButton value="single" aria-label="Single Calculator">
                Single View
              </ToggleButton>
              <ToggleButton value="quadrant" aria-label="Four Quadrant Calculator">
                Four Quadrants
              </ToggleButton>
            </ToggleButtonGroup>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ mt: 2 }}>
          {calculatorType === 'single' ? (
            <NetWorthCalculator />
          ) : (
            <QuadrantNetWorthCalculator />
          )}
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
