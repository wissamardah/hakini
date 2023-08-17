import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'

const NavBar = () => {
  return (
    <Navbar className='' expand="lg" bg=' #126ac9e6'  variant="dark"  >
        <Container className=''>
        
          <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className=" "  navbarScroll>
            <Nav.Link className='  text-light' href="/createform">انشاء استبيان</Nav.Link>
            <Nav.Link className=' text-light' href="/allforms"> الاستبيانات</Nav.Link>
            <Nav.Link  className=' text-light' href="/section"> الاقسام</Nav.Link>
            <Nav.Link  className=' text-light' href="/dashboard">لوحة  الاداء</Nav.Link>
            <Nav.Link  className=' text-light' href="/custmors">الزبائن</Nav.Link>
            <Nav.Link  className=' text-light' href="/campains">الحملات  </Nav.Link>
            <Nav.Link  className=' text-light' href="/question">الاسئلة  </Nav.Link>


          </Nav>
          </Navbar.Collapse>
          <Navbar.Brand  className=' fs-4  text-uppercase font-monospace fw-bold ' href="/admin-panel">Binary</Navbar.Brand>
        </Container>
      </Navbar>
  )
}

export default NavBar
