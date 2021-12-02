import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { format } from 'date-fns';

function Chart(props) {
  const options = {
    title: {
      text: props.title
    },
    plotOptions: {
      series: {
        showInNavigator: true,
        gapSize: 6
      }
    },
    tooltip: {
      shared: true,
      formatter: function () {
        return `${format(new Date(this.points[0].key), 'dd/MM/yyyy')}<br/><b>Cases: ${this.y}</b>`;
      }
    },
    xAxis: {
      type: 'category',
      labels: {
        formatter: function() {
          return format(new Date(this.value), 'dd/MM/yyyy');
        }
      }
    },
    series: [
      {
        data: props.records.map(r => [r.date, r.value]),
        type: 'line'
      }],
    legend: {
      enabled: false
    }
  };

  return (<HighchartsReact
    highcharts={Highcharts}
    options={options}
  />);
}

export default Chart;