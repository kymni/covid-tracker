import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function Chart(props) {
  const options = {
    title: {
      text: props.title
    },
    series: [props.records.map(r => r.date),{
      data: props.records.map(r => r.value)
    }]
  };

  return (<HighchartsReact
    highcharts={Highcharts}
    options={options}
  />);
}

export default Chart;