import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SectionNav = () => {
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

  return (
    <Container className='mt-3  '>
    <Nav className='me-5    d-xlg-flex   flex   justify-content-lg-around  rounded-3  ' variant="pills" defaultActiveKey="/home">
      {Sections.map((nav, index) => (
        <Nav.Item key={index}>
          <Nav.Link className='text-dark me-2  mb-2 fw-bold shadow-lg   rounded-4   '  as={Link} eventKey={index}  to={`/sectiondata/${nav.id}`}  >{nav.name}</Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
    </Container>
  );
};

export default SectionNav;
