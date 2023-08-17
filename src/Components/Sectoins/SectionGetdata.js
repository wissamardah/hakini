import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import back from "../../image/back.png";
import { Button, Container, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import toastr from "toastr";

import AddQ_A from "./AddSection";
import AddWhatSay from "./AddWhatsay";
import Addblog from "./Addblog";
import Addteam from "./ِAddteam";

import AddGalleryba from "./Addgallery";
import AddLatest from "./Addlatestbusiness";
import AddService from "./Addservice";

const SectionGetData = () => {
  const { sectionId } = useParams();

  const [data, setData] = useState(null);
  const [showFullText, setShowFullText] = useState([]);
  const [showForm, setshowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState([]);

  const [uploadedImages, setUploadedImages] = useState({});
  const handleShowForm = () => {
    setshowForm(!showForm);
  };

  useEffect(() => {
    setshowForm(false);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL+`/api/getSectionData?sectionId=${sectionId}`
        );
        const result = response.data;

        if (result.status === "success") {
          setData(result.data);
        } else {
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [sectionId]);
  

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(editedData)
    const token = sessionStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
   try {
    const response = await axios.post(
      process.env.REACT_APP_API_URL+"/api/editSection",
      {
        id: editedData.id,
        sectionId: editedData.sectionId,
        data: {
          Description: editedData.data.Description,
          image1: uploadedImages.image1 || editedData.data.image1,
          image2: uploadedImages.image2 || editedData.data.image2,
          image3: uploadedImages.image3 || editedData.data.image3
        }
      },
      { headers }
    );

    setEditedData({});
    setUploadedImages({});
    setEditMode(false);
  } catch (error) {
  }
}
const handleSubmitsectionHome = async (e) => {
  e.preventDefault();
  console.log(editedData)
  const token = sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
 try {
  const response = await axios.post(
    process.env.REACT_APP_API_URL+"/api/editSection",
    {
      id: editedData.id,
      sectionId: editedData.sectionId,
      data: editedData.data/*{
        Description: editedData.data.Description,
        image1: uploadedImages.image1 || editedData.data.image1,
        image2: uploadedImages.image2 || editedData.data.image2,
        image3: uploadedImages.image3 || editedData.data.image3
      }*/
    },
    { headers }
  );

  setEditedData({});
  setUploadedImages({});
  setEditMode(false);
} catch (error) {
}
};
const handleImageUpload = async (file, key) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      process.env.REACT_APP_API_URL+"/api/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    // Store the uploaded image URL in the state
    setUploadedImages((prevImages) => ({
      ...prevImages,
      [key]: response.data.url
    }));
  } catch (error) {
    // Handle errors here, e.g., show an error message
    console.error(error);
  }
};
  
  const handleEditClick = (item) => {
    setEditedData({
      id: 1,
      sectionId: 1,
      data: {
        text: item.data.text,
        n1: item.data.n1,
        n2: item.data.n2,
        n3: item.data.n3,
      },
    });

    setEditMode(true);
  };
  const handleEditClick2 = (item) => {
    setEditedData({
      id: 16,
      sectionId: 4,
      data: {
        Description: item.data.Description,
        image1: item.data.image1,
        image2: item.data.image2,
        image3: item.data.image3,
      },
    });

    setEditMode(true);
  };

  const handleDelete = async (dataId) => {
    const confirmed = window.confirm("هل انت متاكد من حذف العنصر");

    if (confirmed) {
      try {
        // ... your existing code for deleting the item ...

        const response = await axios.post(
          process.env.REACT_APP_API_URL+`/api/deleteSectionData`,
          {
            sectionId: sectionId,
            dataId: dataId,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        const result = response.data;

        if (result.status === "success") {
          toastr.success("تم حذف العنصر");

          const updatedData = data.filter((item) => item.id !== dataId);
          setData(updatedData);
        } else {
          console.error("Error:", result);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  function isURL(str) {
    try {
      var url = new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  }

  const toggleText = (index) => {
    const updatedShowFullText = [...showFullText];
    updatedShowFullText[index] = !updatedShowFullText[index];
    setShowFullText(updatedShowFullText);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  let tableContent;
  if (sectionId === "10") {
    tableContent = (
      <div>
        <div className=" p-4">
          <button
            className=" btn btn-outline-secondary shadow-lg border border-secondary border-3 rounded-3 w-25 mb-3 "
            onClick={handleShowForm}
          >
            اضافة
          </button>
          <div>{showForm && <AddWhatSay setshowForm={setshowForm} />}</div>
        </div>
        <table className="table    table-hover table-border  text-center">
          <thead className=" border-0 text-center rounded-3">
            <tr className=" border-0  table-dark fa-border     text-light">
              <th>الاسم</th>
              <th>الصورة</th>
              <th>ماذا قال</th>
              <th> </th>
            </tr>
          </thead>
          <tbody className=" align-middle table-light table-bordered table ">
            {data?.map((item, index) => (
              <tr className=" " key={index}>
                <td>{item.data.Name}</td>
                <td>
                  <img width="60px" height="60px" src={item.data.image} />
                </td>
                <td className=" ">{item.data.msg}</td>
                <td className=" align-middle">
                  <div className=" d-flex ">
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ color: "#885bf1", cursor: "pointer" }}
                      onClick={() => handleDelete(item.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else if (sectionId === "11") {
    tableContent = (
      <div>
        <div className=" p-4">
          <button
            className=" btn btn-outline-secondary shadow-lg border border-secondary border-3 rounded-3 w-25 mb-3 "
            onClick={handleShowForm}
          >
            اضافة
          </button>
          <div>{showForm && <AddQ_A setshowForm={setshowForm} />}</div>
        </div>
        <table className="table    table-hover table-border  text-center">
          <thead className="border-0 text-center rounded-3">
            <tr className="border-0  table-dark fa-border     text-light">
              <th>السؤال</th>
              <th>الاجابة</th>
              <th> حذف </th>
            </tr>
          </thead>
          <tbody className=" align-middle table-light table-bordered table">
            {data?.map((item, index) => (
              <tr key={item.id}>
                <td>{item.data.question}</td>
                <td>{item.data.answer}</td>
                <td className=" align-middle">
                  <FontAwesomeIcon
                    onClick={() => handleDelete(item.id)}
                    className="btn  btn-lg"
                    icon={faTrash}
                    style={{ color: "#885bf1" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else if (sectionId === "9") {
    tableContent = (
      <div>
        <div className=" p-4">
          <button
            className=" btn btn-outline-secondary shadow-lg border border-secondary border-3 rounded-3 w-25 mb-3 "
            onClick={handleShowForm}
          >
            اضافة
          </button>
          {showForm ? <Addblog setshowForm={setshowForm} /> : null}
        </div>
        <table className="  table    table-hover table-border  text-center">
          <thead className="border-0 text-center rounded-3">
            <tr className="border-0  table-dark fa-border     text-light">
              <th>العنوان</th>
              <th>الصورة</th>
              <th>الوصف</th>
              <th>التفاصيل</th>
              <th> حذف</th>
            </tr>
          </thead>
          <tbody className=" align-middle table-light  ">
            {data?.map((item, index) => (
              <tr key={index}>
                <td>{item.data.title}</td>
                <td>
                  <a target="_blank" href={item.data.image}>
                    <img width="120px" height="80px" src={item.data.image} />
                  </a>
                </td>

                <td>
                  {item.data && item.data.desc ? (
                    showFullText[index] ? (
                      <>
                        {item.data.desc}
                        <Button
                          className="btn-sm me-3 p-1 mt-2"
                          onClick={() => toggleText(index)}
                        >
                          اقل
                        </Button>
                      </>
                    ) : (
                      <>
                        {truncateText(item.data.desc, 100)}
                        {item.data.desc.length > 100 ? (
                          <Button
                            className="btn-sm me-3 p-1 mt-2"
                            onClick={() => toggleText(index)}
                          >
                            المزيد
                          </Button>
                        ) : null}
                      </>
                    )
                  ) : null}
                </td>

                <td>
                  {item.data && item.data.longDescription ? (
                    showFullText[index] ? (
                      <>
                        {item.data.longDescription}
                        <Button
                          className=" btn-sm me-3 p-1 mt-2"
                          onClick={() => toggleText(index)}
                        >
                          Show Less
                        </Button>
                      </>
                    ) : (
                      <>
                        {truncateText(item.data.longDescription, 100)}
                        {item.data.longDescription.length > 100 ? (
                          <Button
                            className=" btn-sm me-3 p-1 mt-2"
                            onClick={() => toggleText(index)}
                          >
                            المزيد
                          </Button>
                        ) : null}
                      </>
                    )
                  ) : null}
                </td>

                <td>
                  <FontAwesomeIcon
                    className=" align-middle"
                    icon={faTrash}
                    style={{ color: "#885bf1", cursor: "pointer" }}
                    onClick={() => handleDelete(item.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else if (sectionId === "5") {
    tableContent = (
      <div>
        <div className=" p-4">
          <button
            className=" btn btn-outline-secondary shadow-lg border border-secondary border-3 rounded-3 w-25 mb-3 "
            onClick={handleShowForm}
          >
            اضافة
          </button>
          {showForm ? <AddService setshowForm={setshowForm} /> : null}
        </div>
        <table className="table    table-hover table-border  text-center">
          <thead className="shadow-lg text-center rounded-3">
            <tr className="border-0  table-dark fa-border     text-light">
              <th>العنوان</th>
              <th>الصورة</th>
              <th>الوصف</th>
              <th> حذف</th>
            </tr>
          </thead>
          <tbody className="  align-middle table-light table">
            {data?.map((item, index) => (
              <tr className="" key={index}>
                <td>{item.data.header}</td>
                <td>
                  <a target="_blank" href={item.data.image}>
                    <img width="60px" height="50px" src={item.data.image} />
                  </a>
                </td>

                <td>
                  {item.data && item.data.body ? (
                    showFullText[index] ? (
                      <>
                        {item.data.body}
                        <Button
                          className="btn-sm me-3 p-1 mt-2"
                          onClick={() => toggleText(index)}
                        >
                          اقل
                        </Button>
                      </>
                    ) : (
                      <>
                        {truncateText(item.data.body, 100)}
                        {item.data.body.length > 100 ? (
                          <Button
                            className="btn-sm me-3 p-1 mt-2"
                            onClick={() => toggleText(index)}
                          >
                            المزيد
                          </Button>
                        ) : null}
                      </>
                    )
                  ) : null}
                </td>

                <td className=" align-middle">
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ color: "#885bf1", cursor: "pointer" }}
                    onClick={() => handleDelete(item.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else if (sectionId === "6") {
    tableContent = (
      <div className="w-100">
        <div className=" p-4">
          <button
            className=" btn btn-outline-secondary shadow-lg border border-secondary border-3 rounded-3 w-25 mb-3 "
            onClick={handleShowForm}
          >
            اضافة
          </button>
          {showForm ? <AddLatest setshowForm={setshowForm} /> : null}
        </div>
        <table className="table    table-hover table-border  text-center">
          <thead className="border-0  table-dark fa-border     text-light">
            <tr className="bg-primary bg-opacity-75 text-light">
              <th>الصورة</th>
              <th>المدينة</th>
              <th>اسم العمل</th>
              <th> حذف</th>
            </tr>
          </thead>
          <tbody className=" align-middle">
            {data?.map((item, index) => (
              <tr className="" key={index}>
                <td>
                  <a target="_blank" href={item.data.image}>
                    <img width="120px" height="80px" src={item.data.image} />
                  </a>
                </td>
                <td>{item.data.CityName}</td>
                <td>{item.data.Work}</td>

                <td className=" align-middle">
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ color: "#885bf1", cursor: "pointer" }}
                    onClick={() => handleDelete(item.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else if (sectionId === "7") {
    tableContent = (
      <div className="w-100 ">
        <div className=" p-4">
          <button
            className=" btn btn-outline-secondary shadow-lg border border-secondary border-3 rounded-3 w-25 mb-3 "
            onClick={handleShowForm}
          >
            اضافة
          </button>
          {showForm ? <AddGalleryba setshowForm={setshowForm} /> : null}
        </div>
        <table className="table    table-hover table-border  text-center">
          <thead className="border-0  table-dark fa-border     text-light">
            <tr className="bg-primary bg-opacity-75 text-light">
              <th>الصورة</th>
              <th> حذف</th>
            </tr>
          </thead>
          <tbody className=" align-middle">
            {data?.map((item, index) =>
              Object.keys(item.data).map((key) => {
                if (key.includes("image")) {
                  return (
                    <tr className="" key={`${index}-${key}`}>
                      <td>
                        <a target="_blank" href={item.data[key]}>
                          <img
                            width="180px"
                            height="140px"
                            src={item.data[key]}
                          />
                        </a>
                      </td>
                      <td className=" align-middle">
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ color: "#885bf1" }}
                          onClick={() => handleDelete(item.id)}
                        />
                      </td>
                    </tr>
                  );
                }
                return null;
              })
            )}
          </tbody>
        </table>
      </div>
    );
  } else if (sectionId === "8") {
    tableContent = (
      <div className="w-100">
        <div className=" p-4">
          <button
            className=" btn btn-outline-secondary shadow-lg border border-secondary border-3 rounded-3 w-25 mb-3 "
            onClick={handleShowForm}
          >
            اضافة
          </button>
          {showForm ? <Addteam setshowForm={setshowForm} /> : null}
        </div>
        <table className=" table w-100   table-hover table-border  text-center">
          <thead className="border-0 text-center rounded-3">
            <tr className="border-0  table-dark fa-border     text-light">
              <th>الاسم</th>
              <th>الصورة</th>
              <th> الوظيفة</th>
              <th> حذف</th>
            </tr>
          </thead>
          <tbody className=" align-middle text-center">
            {data?.map((item, index) => (
              <tr key={index} className=" text-center">
                <td>{item.data.Name}</td>
                <td>
                  <a target="_blank" href={item.data.image}>
                    <img width="80px" height="60px" src={item.data.image} />
                  </a>
                </td>
                <td className="text-end">{item.data.job}</td>
                <td className=" align-middle">
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ color: "#885bf1", cursor: "pointer" }}
                    onClick={() => handleDelete(item.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else if (sectionId === "1") {
    tableContent = (
      <div>
        {editMode ? (
          <Form onSubmit={handleSubmitsectionHome}>
            <Form.Group className="mb-3">
              <Form.Label>النص</Form.Label>
              <Form.Control
                type="text"
                value={editedData.data.text || ""}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    data: { ...editedData.data, text: e.target.value },
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>n1</Form.Label>
              <Form.Control
                type="number"
                value={editedData.data.n1 || ""}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    data: { ...editedData.data, n1: parseInt(e.target.value) },
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>n2</Form.Label>
              <Form.Control
                type="number"
                value={editedData.data.n2 || ""}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    data: { ...editedData.data, n2: parseInt(e.target.value) },
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>n3</Form.Label>
              <Form.Control
                type="number"
                value={editedData.data.n3 || ""}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    data: { ...editedData.data, n3: parseInt(e.target.value) },
                  })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        ) : (
          <table className="table    table-hover table-border  text-center">
            <thead className=" border-0 text-center rounded-3">
              <tr className=" border-0  table-dark fa-border     text-light">
                <th>النص</th>
                <th>n1</th>
                <th> n2</th>
                <th>n3</th>
                <th> </th>
              </tr>
            </thead>
            <tbody className=" align-middle table-light table-bordered table ">
              {data?.map((item, index) => (
                <tr className=" " key={index}>
                  <td className="text-">{item.data.text}</td>
                  <td>{item.data.n1}</td>
                  <td className=" ">{item.data.n2}</td>
                  <td>{item.data.n3}</td>
                  <td className=" align-middle">
                    <div className=" d-flex ">
                      <Link className="" to={item.data.id}>
                        <FontAwesomeIcon
                          className=" "
                          icon={faPen}
                          style={{ color: "#885bf1" }}
                          onClick={() => handleEditClick(item)}
                        />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  } else if (sectionId === "4") {
    tableContent = (
      <div className="w-100">
        {editMode ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>الوصف</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editedData.data.Description || ""}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    data: { ...editedData.data, Description: e.target.value },
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>الصورة 1</Form.Label>
              <Form.Control
                type="file"
          onChange={(e) => handleImageUpload(e.target.files[0], "image1")}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>الصورة 2</Form.Label>
              <Form.Control
                type="file"
          onChange={(e) => handleImageUpload(e.target.files[0], "image2")}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>الصورة 3</Form.Label>
              <Form.Control
               type="file"
          onChange={(e) => handleImageUpload(e.target.files[0], "image3")}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              حفظ
            </Button>
          </Form>
        ) : (
          <table className="table table-hover table-border text-center">
            <thead className="border-0 table-dark fa-border text-light">
              <tr className="bg-primary bg-opacity-75 text-light">
                <th>الوصف</th>
                <th>الصورة</th>

                <th></th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {data?.map((item, index) =>
                Object.keys(item.data).map((key) => {
                  console.log(key)
                  if (key.includes("image")) {
                    return (
                      <tr className="" key={`${index}-${key}`}>
                        <td>
                          {item.data && item.data.Description ? (
                            showFullText[index] ? (
                              <>
                                {item.data.Description}
                                <Button
                                  className="btn-sm me-3 p-1 mt-2"
                                  onClick={() => toggleText(index)}
                                >
                                  اقل
                                </Button>
                              </>
                            ) : (
                              <>
                                {truncateText(item.data.Description, 20)}
                                {item.data.Description.length > 100 ? (
                                  <Button
                                    className="btn-sm me-3 p-1 mt-2"
                                    onClick={() => toggleText(index)}
                                  >
                                    المزيد
                                  </Button>
                                ) : null}
                              </>
                            )
                          ) : null}
                        </td>
                        <td>
                          <a target="_blank" href={item.data[key]}>
                            <img
                              width="180px"
                              height="140px"
                              src={item.data[key]}
                              alt={`Image ${index + 1}`}
                            />
                          </a>
                        </td>
                        <td className="align-middle">
                          <div className="d-flex">
                            <FontAwesomeIcon
                              className=""
                              icon={faPen}
                              style={{ color: "#885bf1" }}
                              onClick={() => handleEditClick2(item)}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                  return null;
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    );
  }
  return (
    <Container className="mt-4   mb-5">
      <div
        style={{ minHeight: "370px" }}
        className="  justify-content-center align-items-center"
      >
        {tableContent}
      </div>
    </Container>
  );
};

export default SectionGetData;
