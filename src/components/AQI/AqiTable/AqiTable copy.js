import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "./AqiTable.scss";

const AqiTable = (callBackHandler) => {
  const [aqiData, setAqiData] = useState(new Map([]));
  const { lastMessage } = useWebSocket("wss://city-ws.herokuapp.com");
//   const list  = [];
  const getModifiedTime = (date_future, date_now) => {
    // get total seconds between the times
    var delta = Math.abs(date_future - date_now) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = delta % 60; // in theory the modulus is not required
    console.log(seconds, minutes);
    if (seconds < 60) {
      return "A few seconds ago";
    } else if (minutes < 60) {
      return minutes + " ago";
    } else {
      return "";
    }
  };

  const updateArrOld = (response) => {
    if (aqiData.length > 0) {
      console.log(aqiData, "aqiData");
      let arr =
        aqiData &&
        aqiData.map((item, idx) => {
          for (let i = 0; i < response.length; i++) {
            if (item.city === response[i].city) {
              item.aqi = response[i].aqi;
              item.modified = getModifiedTime(
                new Date().getTime(),
                item.timestamp
              );
            }
          }
          return item;
        });

      setAqiData(arr);
      callBackHandler.handler(arr);

    } else {
      let arr = response.map((item) => {
        item["modified"] = "just updated";
        item["timestamp"] = new Date().getTime();
        return item;
      });

      callBackHandler.handler(arr);
      setAqiData(arr);
     
    }
  };

  const updateArr = (response) => {
    //   console.log(aqiData.size)
    response.map((item) => {
        setAqiData(prev => new Map([...prev,[item.city, item.aqi]]));
    }); 
    
    // console.log(' aqiDataMap ', aqiData);
  };



  const renderAqiTable = () =>{
      const list  = [];
        // console.log(aqiData, 'inside render')
      if(aqiData.size > 0){
        for(var item of aqiData){
            //   console.log('item ', item);
            let aqi = Math.ceil(item[1]);
            list.push(<tr className={`${
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
              }`}> <td>{item[0]}</td> <td>{item[1].toFixed(2)}</td></tr>);   
          }
      }

      callBackHandler.handler(aqiData)  ;

      return list;
  }

  useEffect(() => {
    if (lastMessage) {
        // console.log(lastMessage, 'lasttmmsg')
        updateArr(JSON.parse(lastMessage.data));
    }
  }, [lastMessage]);

  return (
    <div className="aqi-table">
      <table>
        <tr>
          <th>City</th>
          <th>AQI</th>
          <th>Last Modified</th>
        </tr>
              
            
        {renderAqiTable()}
        {/* {aqiData &&
          aqiData.map((item, idx) => {
            let aqi = Math.ceil(item.aqi);
            return (
              <tr
                key={idx}
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
              >
                <td>{item.city}</td>
                <td>{item.aqi.toFixed(2)}</td>
                <td>{item.modified}</td>
              </tr>
            );
          })} */}
      </table>
      <div></div>
    </div>
  );
};

export default AqiTable;
