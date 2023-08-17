import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto'
import axios from 'axios';
import { Container,Row,Col } from "react-bootstrap";

const SocailMedia = () => {
  const [facebookData, setFacebookData] = useState({});
  const [instagramData, setInstagramData] = useState({});
  const [otherData, setOtherData] = useState({});

  useEffect(() => {
    const fetchFacebookData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL+'/api/platformStats/facebook', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        setFacebookData(response.data);
      } catch (error) {
        console.error('Error fetching Facebook API data:', error);
      }
    };
    const fetchOtherData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL+'/api/platformStats/Other', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        setOtherData(response.data);
      } catch (error) {
        console.error('Error fetching Facebook API data:', error);
      }
    };

    const fetchInstagramData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL+'/api/platformStats/Instagram', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        setInstagramData(response.data);
      } catch (error) {
        console.error('Error fetching Instagram API data:', error);
      }
    };

    fetchFacebookData();
    fetchInstagramData();
    fetchOtherData()
  }, []);

  useEffect(() => {
    if (facebookData.TotalCount && facebookData.SaleCount) {
      const facebookTotalCountCtx = document.getElementById('facebookTotalCountChart').getContext('2d');
      const facebookSaleCountCtx = document.getElementById('facebookSaleCountChart').getContext('2d');

      const facebookTotalCountData = {
        labels: facebookData.TotalCount.xValues,
        data: facebookData.TotalCount.yValues,
        backgroundColor: facebookData.TotalCount.barColors,
      };
      const facebookSaleCountData = {
        labels: facebookData.SaleCount.xValues,
        data: facebookData.SaleCount.yValues,
        backgroundColor: facebookData.SaleCount.barColors,
      };

      new Chart(facebookTotalCountCtx, {
        type: 'pie',
        data: {
          labels: facebookTotalCountData.labels,
          datasets: [
            {
              data: facebookTotalCountData.data,
              backgroundColor: facebookTotalCountData.backgroundColor,
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

      new Chart(facebookSaleCountCtx, {
        type: 'pie',
        data: {
          labels: facebookSaleCountData.labels,
          datasets: [
            {
              data: facebookSaleCountData.data,
              backgroundColor: facebookSaleCountData.backgroundColor,
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
    }
  }, [facebookData]);

  useEffect(() => {
    if (instagramData.TotalCount && instagramData.SaleCount) {
      const instagramTotalCountCtx = document.getElementById('instagramTotalCountChart').getContext('2d');
      const instagramSaleCountCtx = document.getElementById('instagramSaleCountChart').getContext('2d');

      const instagramTotalCountData = {
        labels: instagramData.TotalCount.xValues,
        data: instagramData.TotalCount.yValues,
        backgroundColor: instagramData.TotalCount.barColors,
      };
      const instagramSaleCountData = {
        labels: instagramData.SaleCount.xValues,
        data: instagramData.SaleCount.yValues,
        backgroundColor: instagramData.SaleCount.barColors,
      };

      new Chart(instagramTotalCountCtx, {
        type: 'pie',
        data: {
          labels: instagramTotalCountData.labels,
          datasets: [
            {
              data: instagramTotalCountData.data,
              backgroundColor: instagramTotalCountData.backgroundColor,
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

      new Chart(instagramSaleCountCtx, {
        type: 'pie',
        data: {
          labels: instagramSaleCountData.labels,
          datasets: [
            {
              data: instagramSaleCountData.data,
              backgroundColor: instagramSaleCountData.backgroundColor,
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
    }
  }, [instagramData]);

  useEffect(() => {
    if (otherData.TotalCount && otherData.SaleCount) {
      const otherTotalCountCtx = document.getElementById('otherTotalCountChart').getContext('2d');
      const otherSaleCountCtx = document.getElementById('otherSaleCountChart').getContext('2d');

      const otherTotalCountData = {
        labels: otherData.TotalCount.xValues,
        data: otherData.TotalCount.yValues,
        backgroundColor: otherData.TotalCount.barColors,
      };
      const otherSaleCountData = {
        labels: otherData.SaleCount.xValues,
        data: otherData.SaleCount.yValues,
        backgroundColor: otherData.SaleCount.barColors,
      };

      new Chart(otherTotalCountCtx, {
        type: 'pie',
        data: {
          labels: otherTotalCountData.labels,
          datasets: [
            {
              data: otherTotalCountData.data,
              backgroundColor: otherTotalCountData.backgroundColor,
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

      new Chart(otherSaleCountCtx, {
        type: 'pie',
        data: {
          labels: otherSaleCountData.labels,
          datasets: [
            {
              data: otherSaleCountData.data,
              backgroundColor: otherSaleCountData.backgroundColor,
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
    }
  }, [otherData]);

  return (
    <Container className=" mt-4">

<Row className='  p-4   border rounded-2' style={{margin:"10px"}}>
<h4 className=' text-center fw-bold'> احصائيات حملات الفيس بوك</h4>

     <div className=" col-sm-12 col-md-6 col-lg-6">
     <div className='card' style={{margin:"10px",height:"350px"}}>
     <canvas  id="facebookTotalCountChart">
          
          </canvas>

</div>

      </div>
    
    
     


 <div className=" col-sm-12 col-md-6 col-lg-6">

 <div className='card' style={{margin:"10px",height:"350px"}}>
 <canvas id="facebookSaleCountChart"></canvas>


</div>

</div>

     
     </Row>
    

     <Row className='  p-4   border rounded-2' style={{margin:"10px"}}>
     <h4 className=' text-center fw-bold'> احصائيات حملات  الانستقرام</h4>

     <div className=" col-sm-12 col-md-6 col-lg-6">
     <div className='card' style={{margin:"10px",height:"350px"}}>
     <canvas  id="instagramTotalCountChart"></canvas>


</div>

      </div>
    
    
     


 <div className=" col-sm-12 col-md-6 col-lg-6">

 <div className='card' style={{margin:"10px",height:"350px"}}>
 <canvas id="instagramSaleCountChart"></canvas>


</div>

</div>

     
     </Row>
    
     <Row className='  p-4   border rounded-2' style={{margin:"10px"}}>
     <h4 className=' text-center fw-bold'> احصائيات حملات  منصات أخرى</h4>

     <div className=" col-sm-12 col-md-6 col-lg-6">
     <div className='card' style={{margin:"10px",height:"350px"}}>
     <canvas  id="otherTotalCountChart"></canvas>


</div>

      </div>
    
    
     


 <div className=" col-sm-12 col-md-6 col-lg-6">

 <div className='card' style={{margin:"10px",height:"350px"}}>
 <canvas id="otherSaleCountChart"></canvas>


</div>

</div>

     
     </Row>
    


     
    </Container>
      
  );
};

export default SocailMedia;
