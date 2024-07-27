import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function AdminGraphs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://sheetdb.io/api/v1/vvg3hfwnsr9pi");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error fetching data: {error.message}</p>;
  }

  // Process data for charts
  const dates = data.map(row => row.Date + ' ' + row.Time);
  const temperatures = data.map(row => parseFloat(row.Temperature));
  const humidities = data.map(row => parseFloat(row.Humidity));
  const moistureValues = data.map(row => parseFloat(row.MoistureValue));

  // Temperature Chart Options
  const tempChartOptions = {
    chart: {
      type: 'line'
    },
    title: {
      text: 'Temperature Over Time'
    },
    xAxis: {
      categories: dates,
      title: {
        text: 'Date and Time'
      }
    },
    yAxis: {
      title: {
        text: 'Temperature (°C)'
      }
    },
    series: [
      {
        name: 'Temperature',
        data: temperatures
      }
    ]
  };

  // Humidity Chart Options
  const humidityChartOptions = {
    chart: {
      type: 'line'
    },
    title: {
      text: 'Humidity Over Time'
    },
    xAxis: {
      categories: dates,
      title: {
        text: 'Date and Time'
      }
    },
    yAxis: {
      title: {
        text: 'Humidity (%)'
      }
    },
    series: [
      {
        name: 'Humidity',
        data: humidities
      }
    ]
  };

  // Moisture Values Chart Options
  const moistureChartOptions = {
    chart: {
      type: 'line'
    },
    title: {
      text: 'Moisture Values Over Time'
    },
    xAxis: {
      categories: dates,
      title: {
        text: 'Date and Time'
      }
    },
    yAxis: {
      title: {
        text: 'Moisture Value'
      }
    },
    series: [
      {
        name: 'Moisture Value',
        data: moistureValues
      }
    ]
  };

  return (
    <div>
      
      <div>
        <h3>Temperature Chart</h3>
        <HighchartsReact
          highcharts={Highcharts}
          options={tempChartOptions}
        />
      </div>
      <div>
        <h3>Humidity Chart</h3>
        <HighchartsReact
          highcharts={Highcharts}
          options={humidityChartOptions}
        />
      </div>
      <div>
        <h3>Moisture Values Chart</h3>
        <HighchartsReact
          highcharts={Highcharts}
          options={moistureChartOptions}
        />
      </div>
    </div>
  );
}

export default AdminGraphs;
