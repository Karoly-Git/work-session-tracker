import React, { useState, useEffect } from "react";
import axios from 'axios';
import DressedInput from "./components/dressed_input";
import Button from "./components/button";
import { data } from "./js/data";
import { dressingSchema as dressingSession } from './js/schemas';
import "./css/style.css";

export default function App() {

  useEffect(() => {
    /*const fetchData = async () => {
      const result = await fetch('http://localhost:8000/work-session-tracker');
      const resultInJason = result.json();
      console.log(resultInJason);
      setData(resultInJason);
    };
    fetchData();*/

    fetch('http://localhost:8000/work-session-tracker')
      .then(res => res.json())
      .then(result => {
        console.log(result);
      })
    //.then(result => setData([...result]))
  }, []);

  const submitData = async () => {
    const myData = {
      name: 'Karoly',
      test: 'Data pass',
    };

    console.log(myData);

    const result = await fetch('http://localhost:8000/mydata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(myData),
    });

    /*try {
      await axios.post('http://localhost:8000/mydata', {
        name: 'Karoly',
        test: 'Data pass',
      })
    }
    catch (err) {
      console.log(err);
    }*/
  };


  data.sort((a, b) => {
    const nameA = a.workerName.toUpperCase(); // ignore upper and lowercase
    const nameB = b.workerName.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  });

  const [sessionId, setSessionId] = useState(1);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionFinishTime, setSessionFinishTime] = useState(null);


  const [dressedOcc, setDressedOcc] = useState(null);
  const [dressedNip, setDressedNip] = useState(null);
  const [dressedMixedPaper, setDressedMixedPaper] = useState(null);

  const [currentName, setCurrentName] = useState(null);
  const [status, setStatus] = useState(null);
  const [givenPin, setGivenPin] = useState(null);

  const updateStatus = (newStatus) => {
    setStatus(newStatus);
  };

  const handleChange = (worker) => {
    let status = data.filter((item) => item.workerName === worker)[0].status;
    setStatus(status);
    setCurrentName(worker);
    console.log(worker, status);
  };

  const isMatching = () => {
    let pin = data.filter((item) => item.workerName === currentName)[0].pin;
    return givenPin === pin;
  };

  const updateSatus = (newStatus) => {
    if (isMatching()) {
      updateStatus(newStatus);
      data.filter(
        (item) => item.workerName === currentName
      )[0].status = newStatus;
    } else {
      window.alert("Wrong PIN");
    }
  };

  const pushNewSession = () => {
    let dressing = data.filter((item) => item.workerName === currentName)[0]
      .dressing;

    dressing.push(dressingSession);
    dressing[dressing.length - 1].start = new Date().toLocaleTimeString(
      "en-GB",
      { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }
    );

    if (dressing.length === 1) {
      dressing[dressing.length - 1].id = 1;
    } else {
      dressing[dressing.length - 1].id = dressing.length;
    }

    console.log(
      data.filter((item) => item.workerName === currentName)[0].dressing
    );
  };

  const updateStartTime = () => {
    let dressing = data.filter((item) => item.workerName === currentName)[0]
      .dressing;
    setSessionStartTime(new Date().toLocaleTimeString(
      "en-GB",
      {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    ));
    //dressing[dressing.length - 1].start = sessionStartTime;
  };
  const updateFinishingTime = () => {
    let dressing = data.filter((item) => item.workerName === currentName)[0]
      .dressing;
    setSessionFinishTime(new Date().toLocaleTimeString(
      "en-GB",
      {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    ));
    dressing[dressing.length - 1].finish = sessionFinishTime;
  };

  const resetDressedBales = () => {
    setDressedOcc(0);
    setDressedNip(0);
    setDressedMixedPaper(0);
  };

  const saveDressedBales = () => {
    let materials = data.filter((item) => item.workerName === currentName)[0]
      .dressing;

    materials[materials.length - 1].materials.occ = dressedOcc;
    materials[materials.length - 1].materials.nip = dressedNip;
    materials[materials.length - 1].materials.mixedPaper = dressedMixedPaper;
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
            submitData();
          }}
        >
          SUBMIT
        </h2>

        <form action="">
          <select
            onChange={(e) => {
              handleChange(e.target.value);
            }}
          >
            {data.map((item, index) => (
              <option key={item.workerName + index}>{item.workerName}</option>
            ))}
          </select>
          <h4 className="status">{status}</h4>

          <input
            placeholder="PIN"
            onInput={(e) => {
              setGivenPin(e.target.value);
              console.log(e.target.value);
            }}
            type="password"
            name=""
            pin=""
            maxLength="3"
          />

          <DressedInput
            updateDressed={(e) => {
              setDressedOcc(e.target.value);
              console.log("OCC", e.target.value);
            }}
            material="OCC:"
            status={status}
          />
          <DressedInput
            updateDressed={(e) => {
              setDressedNip(e.target.value);
              console.log("NiP", e.target.value);
            }}
            material="NiP:"
            status={status}
          />
          <DressedInput
            updateDressed={(e) => {
              setDressedMixedPaper(e.target.value);
              console.log("Mixed Paper", e.target.value);
            }}
            material="Mixed pap:"
            status={status}
          />

          {status === "absence" && (
            <Button
              btnClass="start-btn"
              text="START"
              handleClick={() => {
                if (isMatching()) {
                  updateSatus("dressing");
                  updateStartTime();
                  pushNewSession();
                } else {
                  window.alert("Wrong PIN");
                }
              }}
            />
          )}

          {status === "dressing" && (
            <Button
              btnClass="stop-btn"
              text="STOP"
              handleClick={() => {
                updateSatus("finished");
                updateFinishingTime();
                console.log("STOP clicked");
              }}
            />
          )}

          {status === "finished" && (
            <Button
              btnClass="save-btn"
              text="SAVE"
              handleClick={() => {
                updateSatus("absence");
                saveDressedBales();
                console.log("SAVED");
              }}
            />
          )}
        </form>
      </div>
    </div>
  );
}
