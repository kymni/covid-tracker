import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import debounce from 'lodash/debounce';
import classNames from 'classnames';
import arrayMove from 'array-move';
import DatePicker from "react-datepicker";
import { Stack, TextField } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFNS from '@mui/lab/AdapterDateFns';

// import "react-datepicker/dist/react-datepicker.css";
import styles from './styles.css';
import { fetchAsync, selectRecords, selectGraphsData } from './redux/records';
import Chart from './components/chart';

// use a debounce delay to mitigate probability of overloading the api
const DEBOUNCE_DELAY = 500;
const today = new Date();

const SortableItem = SortableElement(({ value, title }) => <div className={classNames(styles.col)}>
  <Chart title={title} records={value}/>
</div>);

const SortableList = SortableContainer(({ graphsOrder, graphsData }) => {
  const graphs = [];
  graphsOrder.forEach(graphName => {
    const graphObj = graphsData.find(gd => gd.graphName === graphName);
    if (graphObj) {
      graphs.push(graphObj);
    }
  });
  return (
    <div className={classNames(styles.graphs)}>
      {graphs.map(({ graphName, records, title }, index) => (
        <SortableItem key={`item-${graphName}`} graphName={graphName} title={title} index={index} value={records} />
      ))}
    </div>
  );
});

function App() {
  const [graphsOrder, setGraphsOrder] = useState(['recovered', 'deceased', 'active']);
  const [startDate, setStartDate] = useState(new Date('01/01/2020'));
  const [endDate, setEndDate] = useState(today);
  const [filter, setFilter] = useState({
    date: {
      start: (new Date(startDate)).toISOString().split('T')[0],
      end: (new Date(endDate)).toISOString().split('T')[0]
    }
  });

  // preload data
  useEffect(() => {
    dispatch(fetchAsync(filter));
  }, []);

  const onSortEnd = ({oldIndex, newIndex}) => {
    setGraphsOrder(arrayMove(graphsOrder, oldIndex, newIndex));
  };

  const records = useSelector(selectRecords);
  const graphsData = useSelector(selectGraphsData);
  const dispatch = useDispatch();

  // dispatch action to fetch records from api
  const handleDateChange = debounce((date, filterType) => {
    const newFilter = filter;
    // remove key from filter object if currently exists
    if (newFilter.date && Object.keys(newFilter.date).indexOf(filterType) > -1) {
      delete newFilter.date[filterType];
    }
    // only set key in filter if it has a value
    if (date) {
      if (!newFilter.date) {
        newFilter['date'] = {};
      }
      newFilter.date[filterType] = date.toISOString().split('T')[0];

      if (filterType === 'start') {
        setStartDate(date);
      }

      if (filterType === 'end') {
        setEndDate(date);
      }
    }
    setFilter(newFilter);
    dispatch(fetchAsync(newFilter));
  }, DEBOUNCE_DELAY);

  const recovered = records.filter(record => record.sub_series === 'Recovered');
  const deceased = records.filter(record => record.sub_series === 'Deceased');

  return (
    <>
      <h1>Aotearoa COVID Tracker</h1>
      <div className={classNames(styles.app)}>
        <div className={classNames(styles.filters)}>
          <LocalizationProvider dateAdapter={AdapterDateFNS}>
            <Stack spacing={3}>
              <DesktopDatePicker
                label="Start date"
                inputFormat="MM/dd/yyyy"
                value={startDate}
                onChange={(d) => handleDateChange(d, 'start')}
                renderInput={(params) => <TextField {...params}/>} 
              />
              <DesktopDatePicker
                label="End date"
                inputFormat="MM/dd/yyyy"
                value={endDate}
                onChange={(d) => handleDateChange(d, 'end')}
                renderInput={(params) => <TextField {...params}/>} 
              />
              <div>Recovered: {(recovered.length > 0 && (recovered[recovered.length - 1].value - recovered[0].value)) || 0}</div>
              <div>Deceased: {(deceased.length > 0 && (deceased[deceased.length - 1].value - deceased[0].value)) || 0}</div>
            </Stack>
          </LocalizationProvider>
        </div>
        <SortableList graphsOrder={graphsOrder} graphsData={graphsData} onSortEnd={onSortEnd} />
      </div>
    </>
  );
}

export default App;
