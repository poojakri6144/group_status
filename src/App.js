import { Provider } from 'react-redux';
import StatusGroup from './components/StatusGroup';
import store from './redux/store';

function App() {
  return (
    <Provider store={store}>
    <div className="App">
      <StatusGroup />
    </div>

    </Provider>
  );
}

export default App;
