import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CampaignsNav = ({setCampaignId}) => {
  const [Campaigns, setCampaigns] = useState([]);
  const [activeNav, setActiveNav] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL+'/api/getCampains');
        const result = response.data;

        if (result.status === 'success') {
          setCampaigns(result.data);
          setActiveNav(result.data[0].id||null)
          setCampaignId(result.data[0].id||null)
        } else {
          console.error('Error:', result);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container className='mt-3'>
      <Nav className='me-5 d-xlg-flex flex justify-content-lg-around rounded-3' variant="pills" defaultActiveKey="/home">
        {Campaigns.map((nav, index) => (
          <Nav.Item key={index}>
            <Nav.Link 
              className={` me-2 mb-2 fw-bold shadow-lg rounded-4 ${activeNav === nav.id ? 'active text-light' : 'text-dark'}`}
              onClick={() => {
                setCampaignId(nav.id);
                setActiveNav(nav.id);
              }}
            >
              {nav.name}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </Container>
  );
};

export default CampaignsNav;
