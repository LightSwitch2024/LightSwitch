import './App.css';

import Router from '@routes/index';
import { BrowserRouter } from 'react-router-dom';

// tab에서 router쓰기 위한 코드
function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
