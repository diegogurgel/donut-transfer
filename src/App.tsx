import DonutGraph from './components/donut-trasfer';
import { donutGraphData } from './data';

const colors = {
  STATUS1: '#8ECDDD', // Pending
  STATUS2: '#468B97', // Approved
  STATUS3: '#EF6262', // Canceled
  STATUS4: '#FFCC70', // Pending
  STATUS5: '#EF6262', // Rejected
}


function App() {
  return (
    <DonutGraph data={donutGraphData} options={{defaultNode: {donutColorMap: colors}}} />
  );
}

export default App;
