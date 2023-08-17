import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import addform from '../image/addform.png'
import add from '../image/add (1).png'
import showform from '../image/show.png'
import dashboard from '../image/dashboard.png'
import bullhorn from '../image/bullhorn.png'
import rating from '../image/rating (2).png'

const AdminPanel = () => {
  const cardData = [
    {
      image: addform,
      title: 'انشاء استبيان'  ,
      subtitle: 'اضافة استبيان جديد',
      link:"/createform"
    },
    {
      image: showform,
      title: 'الاستبيانات',
      subtitle: "عرض الاستبيانات والتحكم بها",
      link:"/allforms"
    },
    {
      image: dashboard,
      title: 'لوحة الاداء',
      subtitle: 'عرض لوحة قياس الاداء',
      link:"/dashboard"
    },
    {
      image: add,
      title: 'الاقسام ',
      subtitle: 'التحكم في الاقسام ',
      link:"/section"
    },
    {
      image: rating,
      title: 'الزبائن ',
      subtitle: ' عرض الزبائن  ',
      link:"/custmors"
    },
    {
      image: bullhorn,
      title: 'الحملات ',
      subtitle: ' عرض الحملات  ',
      link:"/campains"
    },{
      image: bullhorn,
      title: 'الاسئلة ',
      subtitle: ' عرض الاسئلة  ',
      link:"/question"
    }
  ];
  return (

    <Container className='p-5 text-center'>
    
  
    <Row>

    {cardData.map((item, index) => (
        <Col  key={index} xs={12} md={4} >
          <div className="card text-white mb-3 shadow-lg" style={{ maxWidth: "30rem", minHeight: "250px" }}>
            <div className="card-header  fs-5 fw-bold bg-primary">{item.title}</div>
            <Link className="text-decoration-none" to={item.link}>
              <div  className="card-body bg-light text-dark bg-opacity-10">
                <h5 className="card-title fs-4">{item.subtitle}</h5>
                <img  className="p-5   " src={item.image} alt={item.title} />
              </div>
            </Link>
          </div>
        </Col>
      ))}
   
   
   
   
    </Row>
    </Container>
 
  );
};

export default AdminPanel;
