import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";

const StateChart = () => {
  const [apiData, setApiData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL+"/api/stats",
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        setApiData(response.data);
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (Object.keys(apiData).length > 0) {
      {
        const chartCtx = document.getElementById("ctc").getContext("2d");

        const datasets = [
          {
            label: "الزبائن المحتملين للحملة",
            data: apiData.campaignsTotalCount,
            backgroundColor: "rgb(255, 99, 132,0.5)",
            borderWidth: 2,
            borderColor: "rgb(255, 99, 132)",
            borderRadius: Number.MAX_VALUE,
          },
        ];

        const config = {
          type: "bar",

          data: {
            datasets: datasets,
          },
          options: {
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
              x: {
                ticks: {
                  font: {
                    family: "Cairo",
                  },
                },
              },
            },
            plugins: {
              legend: {
                position: "top",
                labels: {
                  font: {
                    size: 14,
                    family: "Cairo",
                  },
                },
              },
              title: {
                display: true,
                text: "الزبائن المحتملين حسب الحملات",
                font: {
                  size: 20,
                  family: "Cairo",
                },
              },
              tooltip: {
                titleFont: {
                  size: 16,
                  family: "Cairo",
                },
                bodyFont: {
                  size: 14,
                  family: "Cairo",
                },
                footerFont: {
                  size: 14,
                  family: "Cairo",
                },
              },
            },
          },
        };

        const c1 = new Chart(chartCtx, config);
      }

      {
        const chartCtx = document.getElementById("csc").getContext("2d");

        const datasets = [
          {
            label: "الزبائن الفعليين للحملة",
            data: apiData.campaignsSaleCount,
            backgroundColor: "rgb(54, 162, 235,0.5)",
            borderWidth: 2,
            borderColor: "rgb(54, 162, 235)",
            borderRadius: Number.MAX_VALUE,
          },
        ];

        const config = {
          type: "bar",
          data: {
            datasets: datasets,
          },
          options: {
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
              x: {
                ticks: {
                  font: {
                    family: "Cairo",
                  },
                },
              },
            },
            plugins: {
              legend: {
                position: "top",
                labels: {
                  font: {
                    size: 14,
                    family: "Cairo",
                  },
                },
              },
              title: {
                display: true,
                text: "الزبائن الفعليين حسب الحملات",
                font: {
                  size: 20,
                  family: "Cairo",
                },
              },
              tooltip: {
                titleFont: {
                  size: 16,
                  family: "Cairo",
                },
                bodyFont: {
                  size: 14,
                  family: "Cairo",
                },
                footerFont: {
                  size: 14,
                  family: "Cairo",
                },
              },
            },
          },
        };

        new Chart(chartCtx, config);
      }
      {
        const chartCtx = document.getElementById("ptc").getContext("2d");

        const datasets = [
          {
            label: "الزبائن المحتملين للمنصة",
            data: apiData.platformsTotalCount,
            backgroundColor: "rgb(75, 192, 192,0.5)",
            borderWidth: 2,
            borderColor: "rgb(75, 192, 192)",
            borderRadius: 50,
          },
        ];

        const config = {
          type: "bar",
          data: {
            datasets: datasets,
          },
          options: {
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
              x: {
                ticks: {
                  font: {
                    family: "Cairo",
                  },
                },
              },
            },
            plugins: {
              legend: {
                position: "top",
                labels: {
                  font: {
                    size: 14,
                    family: "Cairo",
                  },
                },
              },
              title: {
                display: true,
                text: "الزبائن المحتملين حسب المنصات",
                font: {
                  size: 20,
                  family: "Cairo",
                },
              },
              tooltip: {
                titleFont: {
                  size: 16,
                  family: "Cairo",
                },
                bodyFont: {
                  size: 14,
                  family: "Cairo",
                },
                footerFont: {
                  size: 14,
                  family: "Cairo",
                },
              },
            },
          },
        };

        new Chart(chartCtx, config);
      }
      {
        const chartCtx = document.getElementById("psc").getContext("2d");

        const datasets = [
          {
            label: "الزبائن الفعليين للمنصة",
            data: apiData.platformsSaleCount,
            backgroundColor: "rgb(153, 102, 255,0.5)",
            borderWidth: 2,
            borderColor: "rgb(153, 102, 255)",
            borderRadius: 50,
          },
        ];

        const config = {
          type: "bar",
          data: {
            datasets: datasets,
          },
          options: {
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
              x: {
                ticks: {
                  font: {
                    family: "Cairo",
                  },
                },
              },
            },
            plugins: {
              legend: {
                position: "top",
                labels: {
                  font: {
                    size: 14,
                    family: "Cairo",
                  },
                },
              },
              title: {
                display: true,
                text: "الزبائن الفعليين حسب المنصات",
                font: {
                  size: 20,
                  family: "Cairo",
                },
              },
              tooltip: {
                titleFont: {
                  size: 16,
                  family: "Cairo",
                },
                bodyFont: {
                  size: 14,
                  family: "Cairo",
                },
                footerFont: {
                  size: 14,
                  family: "Cairo",
                },
              },
            },
          },
        };

        new Chart(chartCtx, config);
      }
      {
        const chartCtx = document.getElementById("questions").getContext("2d");

        const datasets = [
          {
            label: "عدد الاجابات على الاسئلة",
            data: apiData.questions,
            backgroundColor: "rgb(255, 159, 64,0.5)",
            borderWidth: 2,
            borderColor: "rgb(255, 159, 64)",
            borderRadius: Number.MAX_VALUE,
          },
        ];

        const config = {
          type: "bar",
          data: {
            datasets: datasets,
          },
          options: {
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
              x: {
                ticks: {
                  font: {
                    family: "Cairo",
                  },
                },
              },
            },
            plugins: {
              legend: {
                position: "top",
                labels: {
                  font: {
                    size: 14,
                    family: "Cairo",
                  },
                },
              },
              title: {
                display: true,
                text: "عدد الاجابات على الاسئلة",
                font: {
                  size: 20,
                  family: "Cairo",
                },
              },
              tooltip: {
                titleFont: {
                  size: 16,
                  family: "Cairo",
                },
                bodyFont: {
                  size: 14,
                  family: "Cairo",
                },
                footerFont: {
                  size: 14,
                  family: "Cairo",
                },
              },
            },
          },
        };

        new Chart(chartCtx, config);
      }
    }
  }, [apiData]);

  return (
    <div className="mb-5">
      <Row className="  p-4   border rounded-2" style={{ margin: "10px" }}>
        <h4 className=" text-center fw-bold"> احصائيات الحملات</h4>

        <div className=" col-sm-12 col-md-6 col-lg-6">
          <div className="card" style={{ margin: "10px", height: "350px" }}>
            <canvas id="ctc"></canvas>
          </div>
        </div>

        <div className=" col-sm-12 col-md-6 col-lg-6">
          <div className="card" style={{ margin: "10px", height: "350px" }}>
            <canvas id="csc"></canvas>
          </div>
        </div>
      </Row>
      <Row className="  p-4   border rounded-2" style={{ margin: "10px" }}>
        <h4 className=" text-center fw-bold"> احصائيات المنصات</h4>

        <div className=" col-sm-12 col-md-6 col-lg-6">
          <div className="card" style={{ margin: "10px", height: "350px" }}>
            <canvas id="ptc"></canvas>
          </div>
        </div>

        <div className=" col-sm-12 col-md-6 col-lg-6">
          <div className="card" style={{ margin: "10px", height: "350px" }}>
            <canvas id="psc"></canvas>
          </div>
        </div>
      </Row>
      <Row className="  p-4   border rounded-2" style={{ margin: "10px" }}>
        <h4 className=" text-center fw-bold"> احصائيات الاسئلة</h4>

        <div className=" col-sm-12 col-md-12 col-lg-12">
          <div className="card" style={{ margin: "10px", height: "350px" }}>
            <canvas id="questions"></canvas>
          </div>
        </div>
      </Row>
    </div>
  );
};

export default StateChart;
