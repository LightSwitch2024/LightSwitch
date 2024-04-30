import logo from "./logo.svg";
import "./App.css";
import { React, useEffect } from "react";
import { LSClient, LSUser } from "lightswitch-js-sdk";
function App() {
  useEffect(() => {
    const initializeLSClient = async () => {
      const b = new LSClient();
      try {
        await b.init({
          sdkKey: "f1a1cc4aa8dc42c1a6d15f2036d7f618",
          onError: (err) => {
            console.log(err);
          },
        });
        const user = new LSUser("123");
        const flag = b.getFlag("test", user);
        console.log("Flag:", flag); // 비동기 함수의 결과를 사용할 수 있음
      } catch (error) {
        console.error("Error:", error);
      }
    };

    initializeLSClient();
    console.log("qwer");
    console.log("qwer2");
  }, []);

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
