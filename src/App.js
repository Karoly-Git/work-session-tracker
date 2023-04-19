import React, { useState, useEffect } from "react";
import Button from "./components/button";
import { dressingSchema as newDressingSession } from "./js/schemas";
import "./css/style.css";
import DressedInput from "./components/dressed_input";

export default function App() {

  const submitData = async (data) => {
    const myData = {
      name: 'Karoly',
      test: 'Data pass',
    };

    //console.log(myData);
    console.log(data);

    const result = await fetch('http://localhost:8000/send-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };

  const resetDatabase = async () => {
    const myData = [
      {
        "id": 1,
        "name": "Ivet Samsung",
        "pin": "iii",
        "status": "absence",
        "dressing": [],
        "cleaning": [],
        "otherTask": [],
        "absence": []
      },
      {
        "id": 2,
        "name": "Artur Siemens",
        "pin": "aaa",
        "status": "absence",
        "dressing": [],
        "cleaning": [],
        "otherTask": [],
        "absence": []
      },
      {
        "id": 3,
        "name": "Daniel Lenovo",
        "pin": "ddd",
        "status": "absence",
        "dressing": [],
        "cleaning": [],
        "otherTask": [],
        "absence": []
      },
      {
        "id": 4,
        "name": "Carl Fisher",
        "pin": "ccc",
        "status": "absence",
        "dressing": [],
        "cleaning": [],
        "otherTask": [],
        "absence": []
      }
    ];

    const result = await fetch('http://localhost:8000/send-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(myData),
    });
  };



  const [data, setData] = useState([]);
  const [currentName, setCurrentName] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [isPinMatches, setIsPinMatches] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [occ, setOCC] = useState(0);
  const [nip, setNip] = useState(0);
  const [mixedPaper, setMixedPaper] = useState(0);


  let servers = {
    localhost: "http://localhost:8000/work-session-tracker.json",
    heroku: "https://work-session-tracker.herokuapp.com/work-session-tracker.json"
  };

  let isServerLocal = false;

  let url = isServerLocal ? servers.localhost : servers.heroku;

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(result => {
        let sortedResult = result.sort((a, b) => {
          const nameA = a.name.toUpperCase(); // ignore upper and lowercase
          const nameB = b.name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });
        setData(sortedResult);
        setCurrentName(sortedResult[0].name);
        setCurrentStatus(sortedResult[0].status);
        //console.log({ currentName: sortedResult[0].name, currentStatus: sortedResult[0].status });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [servers.localhost]);

  function handleOptionChange(targetValue) {
    let statusFromDB = data.filter((item) => item.name === targetValue)[0].status;
    setCurrentStatus(statusFromDB);
    setCurrentName(targetValue);
    console.log({ currentName: targetValue, currentStatus: statusFromDB });
  };

  return (
    <div className="App">
      <div className="app">
        <h2
          onClick={() => {
            console.log(data);
          }}
        >
          DATA
        </h2>
        <h2
          onClick={() => {
            submitData(data);
          }}
        >
          SUBMIT
        </h2>

        <form >
          <select
            onChange={(e) => {
              handleOptionChange(e.target.value);
              setIsPinMatches(false);
              console.log({ isPinMatches: false })
              setInputValue("");
            }}
          >
            {data.map((element, index) => (
              <option key={index}>{element.name}</option>
            ))}
          </select>

          <input
            placeholder="PIN"
            onInput={(e) => {
              setInputValue(e.target.value);
              setCurrentPin(e.target.value);
              if (e.target.value.length >= 3) {
                let pinFromDB = data.filter((item) => item.name === currentName)[0].pin;
                if (e.target.value === pinFromDB) {
                  setIsPinMatches(true);
                  console.log('MATCHES');
                } else {
                  setIsPinMatches(false);
                  console.log('NO matches');
                }
              } else {
                setIsPinMatches(false);
                console.log('NO matches');
              }
            }}
            type="password"
            name=""
            pin=""
            maxLength="3"
            value={inputValue}
          />

          <DressedInput
            onChange={(e) => {
              setOCC(e.target.value);
            }}
            material="OCC:"
            status={currentStatus}
            value={occ}
          />
          <DressedInput
            onChange={(e) => {
              setNip(e.target.value);
            }}
            material="NiP:"
            status={currentStatus}
            value={nip}
          />
          <DressedInput
            onChange={(e) => {
              setMixedPaper(e.target.value);
            }}
            material="Mixed paper:"
            status={currentStatus}
            value={mixedPaper}
          />

          {currentStatus === "absence" && (
            <Button
              btnClass="start-btn"
              text="START"
              handleClick={() => {
                if (isPinMatches) {
                  data.filter(element => element.name === currentName)[0].status = 'dressing'; // DB changes!
                  let index = data.filter(element => element.name === currentName)[0].dressing.length;
                  data.filter(element => element.name === currentName)[0].dressing.push(JSON.parse(JSON.stringify(newDressingSession))); // DB changes!
                  data.filter(element => element.name === currentName)[0].dressing[index].id = index + 1; // DB changes!
                  data.filter(element => element.name === currentName)[0].dressing[index].start = new Date(); // DB changes!
                  setCurrentStatus('dressing');
                  setInputValue("");
                  setIsPinMatches(false);
                } else {
                  window.alert("Wrong PIN");
                }
              }}
            />
          )}

          {currentStatus === "dressing" && (
            <Button
              btnClass="stop-btn"
              text="STOP"
              handleClick={() => {
                if (isPinMatches) {
                  data.filter(element => element.name === currentName)[0].status = 'finished'; // DB changes!
                  let index = data.filter(element => element.name === currentName)[0].dressing.length;
                  data.filter(element => element.name === currentName)[0].dressing[index - 1].finish = new Date(); // DB changes!
                  setCurrentStatus('finished');
                  setInputValue("");
                  setIsPinMatches(false);
                } else {
                  window.alert("Wrong PIN");
                }
              }}
            />
          )}

          {currentStatus === "finished" && (
            <Button
              btnClass="save-btn"
              text="SAVE"
              handleClick={() => {
                if (isPinMatches) {
                  data.filter(element => element.name === currentName)[0].status = 'absence'; // DB changes!
                  let index = data.filter(element => element.name === currentName)[0].dressing.length;
                  data.filter(element => element.name === currentName)[0].dressing[index - 1].materials.occ = occ; // DB changes!
                  data.filter(element => element.name === currentName)[0].dressing[index - 1].materials.nip = nip; // DB changes!
                  data.filter(element => element.name === currentName)[0].dressing[index - 1].materials.mixedPaper = mixedPaper; // DB changes!
                  setCurrentStatus('absence');
                  setInputValue("");
                  setIsPinMatches(false);
                  setOCC("");
                  setNip("");
                  setMixedPaper("");
                } else {
                  window.alert("Wrong PIN");
                }
              }}
            />
          )}


          <h2 style={{ cursor: 'pointer' }}
            onClick={() => {
              resetDatabase();
            }}
          >
            RESET
          </h2>

        </form>
      </div>
    </div>
  );
}
