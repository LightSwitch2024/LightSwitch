import logo from "./logo.svg";
import "./App.css";
import { React, useEffect, useState } from "react";
import { LSClient, LSUser } from "lightswitch-js-sdk";

function App() {
  const [jsTestFlag, setJsTestFlag] = useState(100);
  useEffect(() => {
    const initializeLSClient = () => {
      const lightswitch = LSClient.getInstance();
      const user = new LSUser("123", {
        name: "박현우",
        tel: "010-1234-1235",
      });

      lightswitch
        .init({
          sdkKey: "6e60b0602ae54faa8912cd8245acae7a",
          onError: (err) => {
            console.log(err);
          },
          onFlagChanged: () => {},
        })
        .then(() => {
          setJsTestFlag(lightswitch.getIntegerFlag("JS-Test", user));
        });
    };
    initializeLSClient();
  }, []);

  return (
    <div className="App">
      {jsTestFlag == 100 ? (
        <p>A 기능을 표시합니다.</p>
      ) : (
        <p>B 기능을 표시합니다.</p>
      )}
    </div>
  );
}

export default App;
