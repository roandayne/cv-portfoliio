import { Route, Routes } from 'react-router-dom';
import Main from './containers/Main/Main';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
    </Routes>
  );
}

export default App;
