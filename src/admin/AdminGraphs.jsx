import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function AdminGraphs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const fetchData = async () => {
    try {
      const response = await fetch("https://sheetdb.io/api/v1/vvg3hfwnsr9pi");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log("Fetched data:", result); // Debugging line

      // Process data for charts
      const dates = result.map(row => row.Date + ' ' + row.Time);
      const temperatures = result.map(row => parseFloat(row.Temperature));
      const humidities = result.map(row => parseFloat(row.Humidity));
      const moistureValues = result.map(row => parseFloat(row.MoistureValue));

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
    const intervalId = setInterval(fetchData, 2000); // Fetch new data every 60 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error fetching data: {error.message}</p>;
  }

  return (
    <div>
     
      <div>
        <h3>Temperature Chart</h3>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions.temperature}
        />
      </div>
      <div>
        <h3>Humidity Chart</h3>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions.humidity}
        />
      </div>
      <div>
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
