import logo from "./logo.svg";
import "./App.css";
import LSClient from "lightswitch-js-sdk";
function App() {
  const b = new LSClient();
  b.init({
    sdkKey: "0801d3c5e29b4fc3bbfe9023716891b8",
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
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
