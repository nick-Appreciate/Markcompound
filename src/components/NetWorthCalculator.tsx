import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Slider, 
  TextField, 
  Paper, 
  Container,
  InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CalculatorInputs {
  startAge: number;
  endAge: number;
  annualContribution: number;
  interestRate: number;
}

// Styled components for layout
const MainContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4)
}));

const FlexRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: theme.spacing(4),
  marginBottom: theme.spacing(4)
}));

const InputSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  flex: '1 1 300px'
}));

const ChartSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  flex: '2 1 500px',
  height: '100%'
}));

const SummarySection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%'
}));

const SummaryGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2)
}));

const SummaryItem = styled(Box)(({ theme }) => ({
  flex: '1 1 200px'
}));

const NetWorthCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    startAge: 25,
    endAge: 58,
    annualContribution: 10000,
    interestRate: 7
  });
  
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: []
  });

  // Calculate net worth based on inputs
  const calculateNetWorth = (inputs: CalculatorInputs) => {
    const { startAge, endAge, annualContribution, interestRate } = inputs;
    const years = 80; // X-axis is 80 years as specified
    const labels = Array.from({ length: years + 1 }, (_, i) => i.toString());
    
    const netWorthData = Array(years + 1).fill(0);
    let currentNetWorth = 0;
    
    for (let age = 0; age <= years; age++) {
      if (age > 0) {
        // Apply interest to existing net worth
        currentNetWorth *= (1 + interestRate / 100);
        
        // Add annual contribution if within contribution age range
        if (age >= startAge && age <= endAge) {
          currentNetWorth += annualContribution;
        }
      }
      
      netWorthData[age] = currentNetWorth;
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Net Worth',
          data: netWorthData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        }
      ]
    };
  };

  // Update chart when inputs change
  useEffect(() => {
    const data = calculateNetWorth(inputs);
    setChartData(data);
  }, [inputs]);

  // Handle input changes
  const handleInputChange = (name: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Chart options
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Net Worth ($)'
        },
        ticks: {
          callback: (value) => {
            if (typeof value === 'number') {
              return value >= 1000000
                ? `$${(value / 1000000).toFixed(1)}M`
                : value >= 1000
                ? `$${(value / 1000).toFixed(1)}K`
                : `$${value}`;
            }
            return value;
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Age'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Net Worth Projection Over Time',
      },
    },
  };

  return (
    <MainContainer maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Net Worth Projection Calculator
      </Typography>
      
      <FlexRow>
        {/* Inputs Section */}
        <InputSection elevation={3}>
          <Typography variant="h6" gutterBottom>
            Calculator Inputs
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>
              Starting Age: {inputs.startAge}
            </Typography>
            <Slider
              value={inputs.startAge}
              min={18}
              max={70}
              step={1}
              onChange={(_, value) => handleInputChange('startAge', value as number)}
              valueLabelDisplay="auto"
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>
              Ending Age: {inputs.endAge}
            </Typography>
            <Slider
              value={inputs.endAge}
              min={inputs.startAge}
              max={80}
              step={1}
              onChange={(_, value) => handleInputChange('endAge', value as number)}
              valueLabelDisplay="auto"
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Annual Contribution"
              type="number"
              value={inputs.annualContribution}
              onChange={(e) => handleInputChange('annualContribution', Number(e.target.value))}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>
              Interest Rate: {inputs.interestRate}%
            </Typography>
            <Slider
              value={inputs.interestRate}
              min={1}
              max={15}
              step={0.1}
              onChange={(_, value) => handleInputChange('interestRate', value as number)}
              valueLabelDisplay="auto"
            />
          </Box>
        </InputSection>
        
        {/* Chart Section */}
        <ChartSection elevation={3}>
          <Box sx={{ height: 400 }}>
            <Line data={chartData} options={chartOptions} />
          </Box>
        </ChartSection>
      </FlexRow>
      
      {/* Summary Section */}
      <SummarySection elevation={3}>
        <Typography variant="h6" gutterBottom>
          Summary
        </Typography>
        
        <SummaryGrid>
          <SummaryItem>
            <Typography variant="body2" color="text.secondary">
              Years of Contributions
            </Typography>
            <Typography variant="h6">
              {inputs.endAge - inputs.startAge + 1} years
            </Typography>
          </SummaryItem>
          
          <SummaryItem>
            <Typography variant="body2" color="text.secondary">
              Total Contributions
            </Typography>
            <Typography variant="h6">
              ${((inputs.endAge - inputs.startAge + 1) * inputs.annualContribution).toLocaleString()}
            </Typography>
          </SummaryItem>
          
          <SummaryItem>
            <Typography variant="body2" color="text.secondary">
              Final Net Worth (Age 80)
            </Typography>
            <Typography variant="h6">
              ${chartData.datasets[0]?.data[80]?.toLocaleString() || 0}
            </Typography>
          </SummaryItem>
          
          <SummaryItem>
            <Typography variant="body2" color="text.secondary">
              Growth from Interest
            </Typography>
            <Typography variant="h6">
              ${((chartData.datasets[0]?.data[80] || 0) - ((inputs.endAge - inputs.startAge + 1) * inputs.annualContribution)).toLocaleString()}
            </Typography>
          </SummaryItem>
        </SummaryGrid>
      </SummarySection>
    </MainContainer>
  );
};

export default NetWorthCalculator;
