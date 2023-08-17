import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Select from 'react-select';

function JsonComponent({ data ,setFilteredMobiles}) {
  const [selectedData, setSelectedData] = useState([]);
  const [visibility, setVisibility] = useState(
    data.reduce((acc, curr) => {
      acc[curr.labelName] = false;
      return acc;
    }, {})
  );

  const isMobileDevice = useMediaQuery({
    query: '(max-device-width: 480px)',
  });

  const handleChange = (label, selectedValues) => {
    let tempData = [...selectedData];
    let labelObject = tempData.find((item) => item.labelName === label);
    if (labelObject) {
      labelObject.data = selectedValues.map((item) => item.value);
    } else {
      tempData.push({
        labelName: label,
        data: selectedValues.map((item) => item.value),
      });
    }
    setSelectedData(tempData);
  };

  useEffect(()=>{

    handleSubmit()
  },[selectedData])
  const handleSubmit = () => {
    const visibleData = selectedData.filter((item) => visibility[item.labelName]);

    fetch(process.env.REACT_APP_API_URL+'/api/getFilteredMobiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
      body: JSON.stringify(visibleData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setFilteredMobiles(data)
    })
      .catch((error) => console.error('Error:', error));
  };
  const handleVisibility = (label) => {
    setVisibility({ ...visibility, [label]: !visibility[label] });
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobileDevice ? 'repeat(1, 1fr)' : 'repeat(3, 1fr)',
    gridGap: '1em',
  };

  const cardStyle = {
    padding: '20px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    backgroundColor: '#fff',
  };

  return (
    <div>
        <h2>فلترة حسب</h2>
      <div className="d-flex flex-wrap justify-content-center mb-4">
        {data.map((label) => (
          <button 
            className={`btn m-2 ${visibility[label.labelName] ? 'btn-primary' : 'btn-outline-primary'}`} 
            onClick={() => handleVisibility(label.labelName)}
          >
        {label.labelName}
          </button>
        ))}
      </div>
      <div style={gridStyle}>
        {data.map((label) =>
          visibility[label.labelName] ? (
            <div style={cardStyle} key={label.labelName}>
              <h2>{label.labelName}</h2>
              <Select
                options={[{ value: 'select-all', label: 'Select All' }].concat(
                  label.data.map((value, index) => ({
                    value,
                    label: value === null ? `Unnamed Option ${index + 1}` : value.toString(),
                }))
                )}
                isMulti
                onChange={(selectedValues) => {
                  const isSelectAllSelected = selectedValues.some(
                    (selected) => selected.value === 'select-all'
                  );
                  if (isSelectAllSelected) {
                    handleChange(
                      label.labelName,
                      label.data.map((value, index) => ({
                        value,
                        label: value === null ? `Unnamed Option ${index + 1}` : value.toString(),
                    }))
                    );
                  } else {
                    handleChange(label.labelName, selectedValues);
                  }
                }}
              />
            </div>
          ) : null
        )}
      </div>

    </div>
  );
}

export default JsonComponent;
