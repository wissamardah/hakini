import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { Container, Row, Col } from "react-bootstrap";
import CampaignsNav from './campaignsNav';

const CampignChart = () => {
  const [campaignId, setCampaignId] = useState(null);
  const [campaignData, setCampaignData] = useState({});
  const [totalCountChart, setTotalCountChart] = useState(null);
  const [saleCountChart, setSaleCountChart] = useState(null);

  useEffect(() => {
    const fetchCampaignData = async (id) => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL+'/api/campaignStats/'+id, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        setCampaignData(response.data);
      } catch (error) {
        console.error('Error fetching Campaign API data:', error);
      }
    };
    fetchCampaignData(campaignId);
  }, [campaignId]);

  useEffect(() => {
    if (totalCountChart) {
      totalCountChart.destroy();
    }
    if (saleCountChart) {
      saleCountChart.destroy();
    }

    if (campaignData.TotalCount && campaignData.SaleCount) {
      const campaignTotalCountCtx = document.getElementById('campaignTotalCountChart').getContext('2d');
      const campaignSaleCountCtx = document.getElementById('campaignSaleCountChart').getContext('2d');

      const campaignTotalCountData = {
        labels: campaignData.TotalCount.xValues,
        data: campaignData.TotalCount.yValues,
        backgroundColor: campaignData.TotalCount.barColors,
      };
      const campaignSaleCountData = {
        labels: campaignData.SaleCount.xValues,
        data: campaignData.SaleCount.yValues,
        backgroundColor: campaignData.SaleCount.barColors,
      };

      const newTotalCountChart = new Chart(campaignTotalCountCtx, {
        type: 'pie',
        data: {
          labels: campaignTotalCountData.labels,
          datasets: [
            {
              data: campaignTotalCountData.data,
              backgroundColor: campaignTotalCountData.backgroundColor,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels:{
                font: {
                  size: 14,
                  family:"Cairo"
                }
              },
            },
            title: {
              display: true,
              text: 'عدد الزبائن المحتملين',
              font: {
                size: 20,
                family:"Cairo"
              },
            },
            tooltip: {
              titleFont: {
                size: 16,
                family:"Cairo"
              },
              bodyFont: {
                size: 14,
                family:"Cairo"
              },
              footerFont: {
                size: 14,
                family:"Cairo"
              }
            }
          },
        },
      });
      setTotalCountChart(newTotalCountChart);

      const newSaleCountChart = new Chart(campaignSaleCountCtx, {
        type: 'pie',
        data: {
          labels: campaignSaleCountData.labels,
          datasets: [
            {
              data: campaignSaleCountData.data,
              backgroundColor: campaignSaleCountData.backgroundColor,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels:{
                font: {
                  size: 14,
                  family:"Cairo"
                }
              },
            },
            title: {
              display: true,
              text: 'عدد الزبائن الفعليين',
              font: {
                size: 20,
                family:"Cairo"
              },
            },
            tooltip: {
              titleFont: {
                size: 16,
                family:"Cairo"
              },
              bodyFont: {
                size: 14,
                family:"Cairo"
              },
              footerFont: {
                size: 14,
                family:"Cairo"
              }
            }
          },
        },
      });
      setSaleCountChart(newSaleCountChart);
    }
  }, [campaignData]);

  return (
    <Container className=" mt-4">

      <Row className='  p-4   border rounded-2' style={{margin:"10px"}}>

        <h4 className=' text-center fw-bold'> احصائيات حملة  </h4>
        <CampaignsNav setCampaignId={setCampaignId}/>

        <div className=" col-sm-12 col-md-6 col-lg-6">
          <div className='card' style={{margin:"10px",height:"350px"}}>
            <canvas id="campaignTotalCountChart"></canvas>
          </div>
        </div>

        <div className=" col-sm-12 col-md-6 col-lg-6">
          <div className='card' style={{margin:"10px",height:"350px"}}>
            <canvas id="campaignSaleCountChart"></canvas>
          </div>
        </div>
      </Row>
    </Container>
  );
};

export default CampignChart;
