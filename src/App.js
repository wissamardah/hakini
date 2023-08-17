import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "toastr/build/toastr.min.css";
import * as React from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./Auth/LoginPage";
import AdminPanel from "./Components/AdminPanel";
import NavBar from "./Utilities/NavBar";
import DisplayAllForms from "./Components/Forms/DisplayAllForms";
import ShowForm from "./Components/Forms/ShowForm";
import CreateForm from "./Components/Forms/CreateForm";
import SectionHome from "./Components/Sectoins/SectionHome";
import SectionGetData from "./Components/Sectoins/SectionGetdata";
import SectionNav from "./Utilities/SectionNav";
import Breadcrumbs from "./Utilities/Breadcrumbs ";
import CustomerData from "./Components/Customers/CustomerData";
import Campains from "./Components/Campains/CampainData";
import Dashbord from "./Components/dashbord/Dashbord";
import SocailMedia from "./Components/dashbord/SocailMedia";
import Form from "./form";
import QuestionData from "./Components/question/QuestionData";
import SendQuestion from "./Components/question/SendQuestion";
import { Container } from "react-bootstrap";
import ChatComponent from './ChatComponent';
import ResQuestion from "./Components/question/ResQuestion";
import Scheduledmessages from "./Components/question/Scheduledmessages";

function App() {
  const location = useLocation();
  return (
    <div className="App">
      {location.pathname !== "/" && location.pathname !== "/form" && location.pathname !== "/whatsapp" && <NavBar />}
      {location.pathname !== "/" && location.pathname !== "/form" && location.pathname !== "/whatsapp" && (
        <Breadcrumbs />
      )}

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/allforms" element={<DisplayAllForms />} />
        <Route path="/form/:id" element={<ShowForm />} />
        <Route path="/createform" element={<CreateForm />} />
        <Route path="/custmors" element={<CustomerData />} />
        <Route path="/campains" element={<Campains />} />
        <Route path="/dashboard" element={<Dashbord />} />
        <Route path="/socail" element={<SocailMedia />} />
        <Route path="/form" element={<Form />} />
        <Route path="/question" element={<QuestionData />} />
        <Route path="/filterQ" element={<SendQuestion />} />
        <Route path='/whatsapp' element={<ChatComponent />}/>
        <Route path="/ResQuestion/:id" element={<ResQuestion />}/>
        <Route path="/scheduledmessages" element={<Scheduledmessages/>}/>
        <Route
          path="/section"
          element={
            <>
              <SectionNav />
              <SectionHome />
            </>
          }
        />
        <Route
          path="/sectiondata/:sectionId"
          element={
            <>
              <SectionNav />
              <div className="mb-5"></div>
              <SectionGetData />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
