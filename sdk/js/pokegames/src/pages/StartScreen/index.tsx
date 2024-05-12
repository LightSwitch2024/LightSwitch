import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Text, Button } from "../../components";
import { LSClient, LSServerError, LSUser } from "lightswitch-js-sdk";
import * as T from "./index.style";

const StartScreen: React.FC = () => {
  const navigate = useNavigate();
  const lightswitch = LSClient.getInstance();

  const [flag, setFlag] = useState<boolean | null>(null);

  useEffect(() => {
    const user = new LSUser("123", {
      name: "박현우",
      tel: "010-1234-1235",
    });
    console.log("qweqweqwewqewqe");
    lightswitch
      .init({
        sdkKey: "32a832f30e1a4130af7e4a068ea103a1",
        onFlagChanged: () => {},
        endpoint: "https://lightswitch.kr",
        // onError: () => {},
      })
      .then(() => {
        setFlag(lightswitch.getBooleanFlag("qwer", user, false));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <T.Container>
      <T.Centering>
        {flag == false || flag == null ? (
          <Text as="h1" variant="outlined" size="xl">
            POKEGAMES
          </Text>
        ) : (
          flag == true && (
            <Text as="h1" variant="outlined" size="xl">
              POKEGAMESSSSSSSSSSSSSSSSSSSS!!!!
            </Text>
          )
        )}
        <Button onClick={() => navigate("/pokemons")} variant="light">
          Press Start
        </Button>
        <Text variant="outlined" size="base">
          Source API{" "}
          <T.A href="https://pokeapi.co" target="_blank">
            here
          </T.A>
        </Text>
      </T.Centering>
      <div
        style={{
          position: "absolute",
          bottom: 18,
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}>
        <Text variant="outlined">&copy;{new Date().getFullYear()} radespratama</Text>
        <Text variant="outlined">
          | Want to contribute?{" "}
          <T.A href="https://github.com/radespratama/pokegames" target="_blank">
            GitHub
          </T.A>
        </Text>
      </div>
    </T.Container>
  );
};

export default StartScreen;
