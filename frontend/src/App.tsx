import './App.css';

import Router from '@routes/index';
import { BrowserRouter } from 'react-router-dom';

// function App() {
//   return <Router />;
// }

// tab에서 router쓰기 위한 코드
const App = () => (
  <BrowserRouter>
    <Router />
  </BrowserRouter>
);

export default App;
