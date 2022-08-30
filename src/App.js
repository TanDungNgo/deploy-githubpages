import "./App.css";
import React, { useEffect, useState } from "react";
import ChartLine from "./components/ChartLine";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { FaMap, FaChartLine } from "react-icons/fa";
function App() {
  const [listCity, setListCity] = useState([]);
  const [totalPopulation, setTotalPopulation] = useState([]);
  const [youngPopulation, setYoungPopulation] = useState([]);
  const [workingAgePopulation, setWorkingAgePopulation] = useState([]);
  const [geriatricPopulation, setGeriatricPopulation] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("https://opendata.resas-portal.go.jp/api/v1/prefectures/", {
        headers: {
          "X-API-KEY": "GxXCPOL6IjOmtigjIlKPlu7aqGEtSm34Xzbnwb7D",
        },
      })
      .then((res) => {
        setListCity(res.data.result);
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    axios
      .get(
        "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=1",
        {
          headers: {
            "X-API-KEY": "GxXCPOL6IjOmtigjIlKPlu7aqGEtSm34Xzbnwb7D",
          },
        }
      )
      .then((res) => {
        setTotalPopulation(res.data.result.data[0].data);
        setYoungPopulation(res.data.result.data[1].data);
        setWorkingAgePopulation(res.data.result.data[2].data);
        setGeriatricPopulation(res.data.result.data[3].data);
        const temp = [];
        for (let i = 0; i < res.data.result.data[0].data.length; i++) {
          temp.push({
            year: res.data.result.data[0].data[i].year,
            young: res.data.result.data[1].data[i].rate,
            workingAge: res.data.result.data[2].data[i].rate,
            geriatric: res.data.result.data[3].data[i].rate,
          });
        }
        setData(temp);
      })
      .catch(() => {});
  }, []);

  const renderCity = () => {
    return listCity.map((item) => {
      return (
        <option key={item.prefCode} id={item.prefCode} value={item.prefName}>
          {item.prefName}
        </option>
      );
    });
  };

  const handleChange = (e) => {
    const selectedIndex = e.target.options.selectedIndex;
    const id = e.target.options[selectedIndex].getAttribute("id");
    axios
      .get(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${id}`,
        {
          headers: {
            "X-API-KEY": "GxXCPOL6IjOmtigjIlKPlu7aqGEtSm34Xzbnwb7D",
          },
        }
      )
      .then((res) => {
        setTotalPopulation(res.data.result.data[0].data);
        setYoungPopulation(res.data.result.data[1].data);
        setWorkingAgePopulation(res.data.result.data[2].data);
        setGeriatricPopulation(res.data.result.data[3].data);
        const temp = [];
        for (let i = 0; i < res.data.result.data[0].data.length; i++) {
          temp.push({
            year: res.data.result.data[0].data[i].year,
            young: res.data.result.data[1].data[i].rate,
            workingAge: res.data.result.data[2].data[i].rate,
            geriatric: res.data.result.data[3].data[i].rate,
          });
        }
        setData(temp);
      })
      .catch(() => {});
  };
  return (
    <div className="App">
      <div className="wrapper">
        <div className="header">
          <h2>
            <FaChartLine className="icon" />
            このグラフは、日本の行政単位（地区）ごとの人口の変化を示しています
          </h2>
        </div>
        <div className="container">
          <div className="sidebar">
            <div className="box">
              <h4>
                <FaMap className="icon" />
                日本の行政単位
              </h4>
              <div>
                <select className="custom-select" onChange={handleChange}>
                  {renderCity()}
                </select>
              </div>
            </div>
          </div>
          <div className="content">
            <ChartLine header="総人口" data={totalPopulation} />
            <div className="card">
              <h4>率人口</h4>
              <ResponsiveContainer width="100%" aspect={3}>
                <AreaChart
                  width={500}
                  height={400}
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="young"
                    stackId="1"
                    stroke="#ff7300"
                    fill="#ff7300"
                  />
                  <Area
                    type="monotone"
                    dataKey="workingAge"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                  />
                  <Area
                    type="monotone"
                    dataKey="geriatric"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <ChartLine
              header="年少人口"
              data={youngPopulation}
              stroke="#ff7300"
            />
            <ChartLine
              header="生産年齢人口"
              data={workingAgePopulation}
              stroke="#82ca9d"
            />
            <ChartLine
              header="老年人口"
              data={geriatricPopulation}
              stroke="#8884d8"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
