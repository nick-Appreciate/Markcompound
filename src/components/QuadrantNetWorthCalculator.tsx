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

interface QuadrantData {
  name: string;
  inputs: CalculatorInputs;
  chartData: any;
}

// Styled components for layout
const MainContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4)
}));

const QuadrantGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gridTemplateRows: 'repeat(2, 1fr)',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(4)
}));

const QuadrantItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  height: '500px'
}));

const InputsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: theme.spacing(2)
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: '250px'
}));

const SummarySection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3)
}));

const SummaryGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2)
}));

const SummaryItem = styled(Box)(({ theme }) => ({
  flex: '1 1 200px'
}));

const QuadrantNetWorthCalculator: React.FC = () => {
  // Initialize data for each quadrant
  const [quadrants, setQuadrants] = useState<QuadrantData[]>([
    {
      name: 'Shale',
      inputs: {
        startAge: 25,
        endAge: 58,
        annualContribution: 10000,
        interestRate: 7
      },
      chartData: {
        labels: [],
        datasets: []
      }
    },
    {
      name: 'Luke',
      inputs: {
        startAge: 30,
        endAge: 58,
        annualContribution: 12000,
        interestRate: 6.5
      },
      chartData: {
        labels: [],
        datasets: []
      }
    },
    {
      name: 'Vaughan',
      inputs: {
        startAge: 22,
        endAge: 58,
        annualContribution: 8000,
        interestRate: 7.5
      },
      chartData: {
        labels: [],
        datasets: []
      }
    },
    {
      name: 'Jake',
      inputs: {
        startAge: 28,
        endAge: 58,
        annualContribution: 15000,
        interestRate: 6
      },
      chartData: {
        labels: [],
        datasets: []
      }
    }
  ]);

  // Calculate net worth based on inputs
  const calculateNetWorth = (inputs: CalculatorInputs, quadrantName: string) => {
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
    
    // Generate a unique color for each quadrant
    const colors = {
      'Shale': 'rgba(75, 192, 192, 1)',
      'Luke': 'rgba(255, 99, 132, 1)',
      'Vaughan': 'rgba(255, 205, 86, 1)',
      'Jake': 'rgba(54, 162, 235, 1)'
    };
    
    const backgroundColor = {
      'Shale': 'rgba(75, 192, 192, 0.2)',
      'Luke': 'rgba(255, 99, 132, 0.2)',
      'Vaughan': 'rgba(255, 205, 86, 0.2)',
      'Jake': 'rgba(54, 162, 235, 0.2)'
    };
    
    return {
      labels,
      datasets: [
        {
          label: `${quadrantName}'s Net Worth`,
          data: netWorthData,
          borderColor: colors[quadrantName as keyof typeof colors],
          backgroundColor: backgroundColor[quadrantName as keyof typeof backgroundColor],
          fill: true,
        }
      ]
    };
  };

  // Update chart when component mounts
  useEffect(() => {
    const updatedQuadrants = quadrants.map(quadrant => ({
      ...quadrant,
      chartData: calculateNetWorth(quadrant.inputs, quadrant.name)
    }));
    
    setQuadrants(updatedQuadrants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle input changes for a specific quadrant
  const handleInputChange = (quadrantIndex: number, name: keyof CalculatorInputs, value: number) => {
    setQuadrants(prevQuadrants => {
      const newQuadrants = [...prevQuadrants];
      newQuadrants[quadrantIndex] = {
        ...newQuadrants[quadrantIndex],
        inputs: {
          ...newQuadrants[quadrantIndex].inputs,
          [name]: value
        }
      };
      
      // Recalculate chart data for this quadrant
      newQuadrants[quadrantIndex].chartData = calculateNetWorth(
        newQuadrants[quadrantIndex].inputs,
        newQuadrants[quadrantIndex].name
      );
      
      return newQuadrants;
    });
  };

  // Chart options
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
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
        display: false
      },
    },
  };

  // Combined chart data for the summary section
  const combinedChartData = {
    labels: Array.from({ length: 81 }, (_, i) => i.toString()),
    datasets: quadrants.map(quadrant => ({
      label: `${quadrant.name}`,
      data: quadrant.chartData.datasets?.[0]?.data || [],
      borderColor: quadrant.chartData.datasets?.[0]?.borderColor,
      backgroundColor: 'transparent',
      fill: false,
      borderWidth: 2
    }))
  };

  return (
    <MainContainer maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Net Worth Projection Calculator - Four Quadrants
      </Typography>
      
      <QuadrantGrid>
        {quadrants.map((quadrant, index) => (
          <QuadrantItem key={quadrant.name} elevation={3}>
            <Typography variant="h6" gutterBottom>
              {quadrant.name}
            </Typography>
            
            <InputsContainer>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2">
                  Starting Age: {quadrant.inputs.startAge}
                </Typography>
                <Slider
                  size="small"
                  value={quadrant.inputs.startAge}
                  min={18}
                  max={70}
                  step={1}
                  onChange={(_, value) => handleInputChange(index, 'startAge', value as number)}
                  valueLabelDisplay="auto"
                />
              </Box>
              
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2">
                  Ending Age: {quadrant.inputs.endAge}
                </Typography>
                <Slider
                  size="small"
                  value={quadrant.inputs.endAge}
                  min={quadrant.inputs.startAge}
                  max={80}
                  step={1}
                  onChange={(_, value) => handleInputChange(index, 'endAge', value as number)}
                  valueLabelDisplay="auto"
                />
              </Box>
              
              <Box sx={{ mb: 1 }}>
                <TextField
                  label="Annual Contribution"
                  type="number"
                  size="small"
                  value={quadrant.inputs.annualContribution}
                  onChange={(e) => handleInputChange(index, 'annualContribution', Number(e.target.value))}
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2">
                  Interest Rate: {quadrant.inputs.interestRate}%
                </Typography>
                <Slider
                  size="small"
                  value={quadrant.inputs.interestRate}
                  min={1}
                  max={15}
                  step={0.1}
                  onChange={(_, value) => handleInputChange(index, 'interestRate', value as number)}
                  valueLabelDisplay="auto"
                />
              </Box>
            </InputsContainer>
            
            <ChartContainer>
              <Line data={quadrant.chartData} options={chartOptions} />
            </ChartContainer>
          </QuadrantItem>
        ))}
      </QuadrantGrid>
      
      {/* Summary Section with Combined Chart */}
      <SummarySection elevation={3}>
        <Typography variant="h6" gutterBottom>
          Combined Net Worth Projection
        </Typography>
        
        <Box sx={{ height: 400, mb: 4 }}>
          <Line data={combinedChartData} options={chartOptions} />
        </Box>
        
        <Typography variant="h6" gutterBottom>
          Summary
        </Typography>
        
        <SummaryGrid>
          {quadrants.map((quadrant) => (
            <SummaryItem key={quadrant.name}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {quadrant.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Years of Contributions
              </Typography>
              <Typography variant="body1">
                {quadrant.inputs.endAge - quadrant.inputs.startAge + 1} years
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total Contributions
              </Typography>
              <Typography variant="body1">
                ${((quadrant.inputs.endAge - quadrant.inputs.startAge + 1) * quadrant.inputs.annualContribution).toLocaleString()}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Final Net Worth (Age 80)
              </Typography>
              <Typography variant="body1">
                ${quadrant.chartData.datasets?.[0]?.data?.[80]?.toLocaleString() || 0}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Growth from Interest
              </Typography>
              <Typography variant="body1">
                ${((quadrant.chartData.datasets?.[0]?.data?.[80] || 0) - ((quadrant.inputs.endAge - quadrant.inputs.startAge + 1) * quadrant.inputs.annualContribution)).toLocaleString()}
              </Typography>
            </SummaryItem>
          ))}
        </SummaryGrid>
      </SummarySection>
    </MainContainer>
  );
};

export default QuadrantNetWorthCalculator;
