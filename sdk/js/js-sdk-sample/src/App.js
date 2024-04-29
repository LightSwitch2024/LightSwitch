import logo from "./logo.svg";
import "./App.css";
import LSClient from "lightswitch-js-sdk";
function App() {
  const b = new LSClient();
  b.init({
    sdkKey: "9b6f067feca74f4391b8f9c7b74b1260",
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
