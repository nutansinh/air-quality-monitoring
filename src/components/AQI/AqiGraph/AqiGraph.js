import React, { useEffect, useState } from "react";
import "./AqiGraph.scss";
import { Line } from "react-chartjs-2";

const AqiGraph = ({ aqiData, city, initialCity }) => {
  const [cityData, setCityData] = useState({});
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  const options = {
    scales: {
      y: {
        beginZero: true,
      },
    },
  };

  const checkAqiColor = (aqi) => {
    aqi = Math.ceil(aqi);

    if (aqi <= 50) return "green";
    else if (aqi > 50 && aqi <= 100) return "lightgreen";
    else if (aqi >= 101 && aqi <= 200) return "yellow";
    else if (aqi >= 201 && aqi <= 300) return "orange";
    else if (aqi >= 301 && aqi <= 400) return "red";
    else if (aqi >= 401 && aqi <= 500) return "darkred";
    else return "rgba(255, 255, 255, 1)";
  };

  const resetGraphData = () => {
    setData({
      labels: [],
      datasets: [
        {
          label: "",
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
        },
      ],
    });
  };

  const FlushData = () => {
    setCityData((prev) => {
      for (let i in prev) {
        prev[i].ts.length = 0;
        prev[i].aqi.length = 0;
        prev[i].bgColor.length = 0;
      }
      return prev;
    });
  };

  const updateDataset = () => {
    let tempData = {
      labels: [],
      label: "",
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1,
    };
    for (let mapItem of aqiData) {
      let aqiObj = {
        aqi: Math.ceil(mapItem[1].aqi),
        ts: new Date().toLocaleString(),
      };

      if (cityData[mapItem[0]]) {
        setCityData((prev) => ({
          ...prev,
          [mapItem[0]]: {
            name: mapItem[0],
            ts: [...prev[mapItem[0]].ts, aqiObj.ts],
            aqi: [...prev[mapItem[0]].aqi, aqiObj.aqi],
            bgColor: [...prev[mapItem[0]].bgColor, checkAqiColor(aqiObj.aqi)],
          },
        }));
      } else {
        setCityData((prev) => ({
          ...prev,
          [mapItem[0]]: {
            name: mapItem[0],
            ts: [aqiObj.ts],
            aqi: [aqiObj.aqi],
            bgColor: [checkAqiColor(aqiObj.aqi)],
          },
        }));
      }
    }

    if (Object.keys(cityData).length) {
      tempData.label = cityData[city].name;
      tempData.labels = cityData[city].ts;
      tempData.data = cityData[city].aqi;
      tempData.backgroundColor = cityData[city].bgColor;
    }

    let arr = [];
    // condition for showing AQI graph inidividually/comparison
    if (initialCity) {
      for (let item in cityData) {
        arr.push({
          backgroundColor: cityData[item].bgColor,
          label: item,
          data: cityData[item].aqi,
          borderColor: [],
          borderWidth: 1,
        });
      }
    } else {
      arr = [
        {
          backgroundColor: tempData.backgroundColor,
          label: tempData.label,
          data: tempData.data,
          borderColor: [],
          borderWidth: 1,
        },
      ];
    }

    setData((prev) => ({
      ...prev,
      labels: tempData.labels,
      datasets: arr,
    }));
  };

  useEffect(() => {
    updateDataset();
  }, [aqiData]);

  useEffect(() => {
    resetGraphData();
    updateDataset();
  }, [city]);

  useEffect(() => {
    // flushing stale data after every 10 minutes
    const interval = setInterval(() => {
      FlushData();
    }, 600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="aqi-graph">
      <Line data={data} options={options} />
    </div>
  );
};

export default AqiGraph;
