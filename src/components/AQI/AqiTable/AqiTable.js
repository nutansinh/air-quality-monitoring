import React from "react";
import "./AqiTable.scss";

const AqiTable = ({ aqiData, aqiRowClickHandler }) => {
  const getModifiedTime = (newDate, prevDate) => {
    if (!newDate && !prevDate) {
      return "";
    }
    var delta = Math.floor((newDate - prevDate) / 1000);
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    var seconds = delta % 60;

    if (seconds === 0) {
        let time = new Date(prevDate).toLocaleTimeString().replace(/:\d+ /, ' '); 
      return time;
    } else if (seconds < 60) {
      return "A few seconds ago";
    } else if (minutes >= 60) {
      return minutes + " ago";
    } else {
      return "";
    }
  };

  const renderAqiTable = () => {
    const list = [];

    if (aqiData.size > 0) {
      aqiData.forEach((value, key) => {
        let aqi = Math.ceil(value.aqi);
        list.push(
          <tr
            key={key}
            className={`${
              aqi <= 50
                ? "good"
                : aqi >= 51 && aqi <= 100
                ? "satis"
                : aqi >= 101 && aqi <= 200
                ? "mod"
                : aqi >= 201 && aqi <= 300
                ? "poor"
                : aqi >= 301 && aqi <= 400
                ? "vpoor"
                : aqi >= 401 && aqi <= 500
                ? "severe"
                : ""
            }`}
            onClick={() => aqiRowClickHandler(key)}
          >
            <td>{key}</td>
            <td>{value.aqi.toFixed(2)}</td>
            <td>{getModifiedTime(value.finalTime, value.initialTime)}</td>
          </tr>
        );
      });
    }

    return list;
  };

  return (
    <div className="aqi-table">
      <table>
        <tr>
          <th>City</th>
          <th>AQI</th>
          <th>Last Modified</th>
        </tr>

        {renderAqiTable(aqiData)}
      </table>
      <div></div>
    </div>
  );
};

export default AqiTable;
