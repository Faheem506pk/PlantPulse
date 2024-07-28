import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const ChartComponent = () => {
  const options = {
    chart: {
      type: 'line'
    },
    title: {
      text: 'My chart'
    },
    series: [{
      data: [1, 2, 3]
    }]
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ToastContainer />
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};

export default ChartComponent;
