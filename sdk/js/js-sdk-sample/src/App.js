import logo from "./logo.svg";
import "./App.css";
import { React, useEffect, useState } from "react";
import { LSClient, LSUser } from "lightswitch-js-sdk";
function App() {
  const [myFlag, setMyFlag] = useState();
  const [myFlag2, setMyFlag2] = useState();
  const [myFlag3, setMyFlag3] = useState();
  useEffect(() => {
    const initializeLSClient = async () => {
      const lightswitch = new LSClient();
      const user = new LSUser("123", 1);
      lightswitch.init({
        sdkKey: "d8d2d76fc0514279b00c82bf9515f66d",
        onError: (err) => {
          console.log(err);
        },
        onFlagChanged: (flags) => {
          console.log(flags);
          setMyFlag(lightswitch.getFlag("test", user));
          setMyFlag2(lightswitch.getFlag("test2", user));
          setMyFlag3(lightswitch.getFlag("test3", user));
        },
      });
    };
    initializeLSClient();
  }, []);

  return (
    <div className="App">
      <div>myFlag1: {myFlag}</div>
      <div>myFlag2: {myFlag2}</div>
      <div>myFlag3: {myFlag3}</div>
    </div>
  );
}

export default App;
