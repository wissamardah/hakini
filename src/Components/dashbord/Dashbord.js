import React from "react";
import Campains from "../Campains/CampainData";
import { Link } from "react-router-dom";
import social from "../../image/social-media.png";
import StateChart from "./State";
import SocailMedia from "./SocailMedia";
import CampignChart from "./campaigns";
import {Row,Container} from 'react-bootstrap'
const Dashbord = () => {
  return (
    <Container>
    <Row>
    <StateChart />
      <SocailMedia />
      <CampignChart />
    </Row>
      
    </Container>
  );
};

export default Dashbord;
