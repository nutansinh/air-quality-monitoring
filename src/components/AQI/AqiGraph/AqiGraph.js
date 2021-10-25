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

  const updateDataset = () => {
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

    let dummyData = {
      labels: [],
      label: "",
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1,
    };
    if (Object.keys(cityData).length) {
      dummyData.label = cityData[city].name;
      dummyData.labels = cityData[city].ts;
      dummyData.data = cityData[city].aqi;
      dummyData.backgroundColor = cityData[city].bgColor;
    }

    let arr = [];
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
          backgroundColor: dummyData.backgroundColor,
          label: dummyData.label,
          data: dummyData.data,
          borderColor: [],
          borderWidth: 1,
        },
      ];
    }

    setData((prev) => ({
      ...prev,
      labels: dummyData.labels,
      datasets: arr,
    }));
  };

  useEffect(() => {
    updateDataset();
  }, [aqiData]);

  useEffect(() => {
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
    updateDataset();
  }, [city]);

  return (
    <div className="aqi-graph">
      <Line data={data} options={options} />
    </div>
  );
};

export default AqiGraph;
