import React, { useState, useEffect } from "react";
import AqiTable from "./AqiTable/AqiTable";
import AqiGraph from "./AqiGraph/AqiGraph";
import useWebSocket from "react-use-websocket";
import "./AQI.scss";

const AQI = () => {
  const [city, setCity] = useState("");
  const [cityFlag, setCityFlag] = useState(true);
  const [initialCity, setinitialCity] = useState(true);

  const [aqiData, setAqiData] = useState(new Map([]));
  const { lastMessage } = useWebSocket("wss://city-ws.herokuapp.com");

  const updateArr = (response) => {
    let arr = response.map((item, idx) => {
      if (idx === 0 && cityFlag) {
        setCity(item.city);
        setCityFlag(false);
      }
      let oldArr = aqiData.get(item.city);

      return [
        item.city,
        {
          aqi: item.aqi,
          initialTime: oldArr ? oldArr.finalTime : new Date().getTime(),
          finalTime: new Date().getTime(),
        },
      ];
    });
    setAqiData((prev) => {
      return new Map([...prev, ...arr]);
    });
  };

  const aqiRowClickHandler = (cityName) => {
    setCity(cityName);
    setinitialCity(false);
  };

  useEffect(() => {
    if (lastMessage) {
      updateArr(JSON.parse(lastMessage.data));
    }
  }, [lastMessage]);

  return (
    <div className="aqi-main-container">
      <AqiTable aqiData={aqiData} aqiRowClickHandler={aqiRowClickHandler} />
      <AqiGraph aqiData={aqiData} city={city} initialCity={initialCity} />
    </div>
  );
};

export default AQI;
