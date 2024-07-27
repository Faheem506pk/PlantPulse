import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function AdminGraphs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('day'); // Default filter
  const [chartOptions, setChartOptions] = useState({
    temperature: {
      chart: { type: 'line' },
      title: { text: 'Temperature Over Time' },
      xAxis: { categories: [], title: { text: 'Date and Time' } },
      yAxis: { title: { text: 'Temperature (°C)' } },
      series: [{ name: 'Temperature', data: [] }],
    },
    humidity: {
      chart: { type: 'line' },
      title: { text: 'Humidity Over Time' },
      xAxis: { categories: [], title: { text: 'Date and Time' } },
      yAxis: { title: { text: 'Humidity (%)' } },
      series: [{ name: 'Humidity', data: [] }],
    },
    moisture: {
      chart: { type: 'line' },
      title: { text: 'Moisture Values Over Time' },
      xAxis: { categories: [], title: { text: 'Date and Time' } },
      yAxis: { title: { text: 'Moisture Value' } },
      series: [{ name: 'Moisture Value', data: [] }],
    },
  });

  const getFilteredData = (data, filter) => {
    const now = new Date();
    const startDate = new Date();

    switch (filter) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      default:
        break;
    }

    return data.filter(row => {
      const rowDate = new Date(row.Date + ' ' + row.Time);
      return rowDate >= startDate && rowDate <= now;
    });
  };

  const fetchData = async () => {
    try {
      const response = await fetch("https://sheetdb.io/api/v1/vvg3hfwnsr9pi");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log("Fetched data:", result); // Debugging line

      // Filter data based on selected filter
      const filteredData = getFilteredData(result, filter);

      // Process data for charts
      const dates = filteredData.map(row => row.Date + ' ' + row.Time);
      const temperatures = filteredData.map(row => parseFloat(row.Temperature));
      const humidities = filteredData.map(row => parseFloat(row.Humidity));
      const moistureValues = filteredData.map(row => parseFloat(row.MoistureValue));

      setChartOptions(prevOptions => ({
        temperature: {
          ...prevOptions.temperature,
          xAxis: { ...prevOptions.temperature.xAxis, categories: dates },
          series: [{ ...prevOptions.temperature.series[0], data: temperatures }],
        },
        humidity: {
          ...prevOptions.humidity,
          xAxis: { ...prevOptions.humidity.xAxis, categories: dates },
          series: [{ ...prevOptions.humidity.series[0], data: humidities }],
        },
        moisture: {
          ...prevOptions.moisture,
          xAxis: { ...prevOptions.moisture.xAxis, categories: dates },
          series: [{ ...prevOptions.moisture.series[0], data: moistureValues }],
        },
      }));

      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching data:", error); // Debugging line
      setError(error);
      setLoading(false); // Set loading to false even if there's an error
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 2000); // Fetch new data every 20 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [filter]); // Dependency on filter

  const handleFilterChange = (newFilter) => {
    setLoading(true); // Show loading indicator when filter changes
    setFilter(newFilter);
  };

  if (error) {
    return <p className="error">Error fetching data: {error.message}</p>;
  }

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="admin-graphs">
      <div className="filter-buttons">
        <button
          className={`filter-button ${filter === 'day' ? 'active' : ''}`}
          onClick={() => handleFilterChange('day')}
        >
          Day
        </button>
        <button
          className={`filter-button ${filter === 'week' ? 'active' : ''}`}
          onClick={() => handleFilterChange('week')}
        >
          Week
        </button>
        <button
          className={`filter-button ${filter === 'month' ? 'active' : ''}`}
          onClick={() => handleFilterChange('month')}
        >
          Month
        </button>
      </div>
      <div className="chart-container">
        <h3>Temperature Chart</h3>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions.temperature}
        />
      </div>
      <div className="chart-container">
        <h3>Humidity Chart</h3>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions.humidity}
        />
      </div>
      <div className="chart-container">
        <h3>Moisture Values Chart</h3>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions.moisture}
        />
      </div>
    </div>
  );
}

export default AdminGraphs;
