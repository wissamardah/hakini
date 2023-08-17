import React from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();

  return (
    <Container className='   border mt-4  rounded-3   fw-bold   ' >

   
    <Breadcrumb className='p-1  align-middle mt-2' >
      
      <Breadcrumb.Item  linkAs={Link} linkProps={{ to: '/admin-panel' }}>
       لوحة التحكم  /  &nbsp;
      </Breadcrumb.Item>
      {location.pathname === '/allforms' && (
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/allforms' }}>
         الاستبيانات 
        </Breadcrumb.Item>
      )}
      {location.pathname.startsWith('/form/') && (
        <>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/allforms' }}>
           الاستبيانات

          </Breadcrumb.Item>
          <Breadcrumb.Item active>معلومات الاستبيان</Breadcrumb.Item>
        </>
      )}
      {location.pathname === '/createform' && (
        <>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/allforms' }}>
          الاستبيانات

          </Breadcrumb.Item>
          <Breadcrumb.Item  active linkProps={{ to: '/createform' }}>
           انشاء استبيان
          </Breadcrumb.Item>
        </>
      )}
      {location.pathname === '/section' && (
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/section' }}>
         الاقسام
        </Breadcrumb.Item>
      )}
      {location.pathname.startsWith('/sectiondata/') && (
        <>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/section' }}>
          الاقسام
          </Breadcrumb.Item>
          <Breadcrumb.Item active>الاضافة و الحذف</Breadcrumb.Item>
        </>
      )}
      {location.pathname.startsWith('/question') && (
        <>
         
          <Breadcrumb.Item active>الاسئلة</Breadcrumb.Item>
        </>
      )}
      {location.pathname.startsWith('/custmors') && (
        <>
         
          <Breadcrumb.Item active>الزبائن</Breadcrumb.Item>
        </>
      )}
      {location.pathname.startsWith('/campains') && (
        <>
         
          <Breadcrumb.Item active>الحملات</Breadcrumb.Item>
        </>
      )}
      {location.pathname.startsWith('/dashboard') && (
        <>
         
          <Breadcrumb.Item active>للوحة قياس الاداء</Breadcrumb.Item>
        </>
      )}
      {location.pathname.startsWith('/scheduledmessages') && (
        <>
         
          <Breadcrumb.Item active>الرسائل المجدولة  </Breadcrumb.Item>
        </>
      )}
      {location.pathname.startsWith('/filterQ') && (
        <>
         
          <Breadcrumb.Item active>ارسال رسالة   </Breadcrumb.Item>
        </>
      )}
      {location.pathname.startsWith('/ResQuestion') && (
        <>
         
          <Breadcrumb.Item active>اجابات الاسئلة    </Breadcrumb.Item>
        </>
      )}
    </Breadcrumb>
   
   
    </Container>
  );
};

export default Breadcrumbs;
