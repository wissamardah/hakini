import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import question from '../../image/question-mark.png'
import speaking from '../../image/speaking.png'
import blog from '../../image/blog.png'
import partners from '../../image/partners.png'
import pie from '../../image/pie-chart.png'
import picture from '../../image/picture.png'
import about from '../../image/about.png'
import service from '../../image/customer-service.png'
import homepage from '../../image/homepage.png'
import SectionNav from '../../Utilities/SectionNav';


const SectionHome = () => {
  const [Sections, setSections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL+'/api/nav');
        const result = response.data;

        if (result.status === 'success') {
          setSections(result.data);
        } else {
          console.error('Error:', result);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const icons = [question,speaking,blog,partners,picture,pie,service,about,homepage

  ];

  return (
    <Container className=" text-center">
    {/* <SectionNav setSectionid={setSectionid}/> */}
      <Row className='mt-5'>
        {Sections.map((section, index) => (
          <Col key={index} xs={12} md={6} lg='4'>
            <div className="card text-white mb-3 shadow-lg" style={{ maxWidth: '30rem', minHeight: '250px' }}>
              <div className="card-header fs-5 fw-bold bg-primary">{section.name}</div>
              <Link className="text-decoration-none"  to={`/sectiondata/${section.id}`}>
                <div className="card-body bg-light text-dark bg-opacity-10">
                  <h5 className="card-title fs-4">{section.name}</h5>
                  <div>
                    <img src={icons[index]}  />
                  </div>
                </div>
              </Link>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SectionHome;
