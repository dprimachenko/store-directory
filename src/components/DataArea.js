import React, { useEffect, useState } from "react";
import DataTable from "./DataTable";
import Nav from "./Nav";
import API from "../utils/API";
import "../styles/DataArea.css";
import EmployeeContext from "../utils/employeeContext.js";

export default function DataArea() {

  const [employeeState, setUsers] = useState({
    employees: [{}],
    filteredEmployees: [{}]
  });

  const [order, setOrder] = useState("descend");

  const [headings, setHeadings] = useState([
    { name: "Image", width: "10%" },
    { name: "Name", width: "10%" },
    { name: "Phone", width: "20%" },
    { name: "Email", width: "20%" },
    { name: "DOB", width: "10%" }
  ]);

  useEffect(() => {
    API.getUsers().then(res => {
      setUsers({
        employees: res.data.results,
        filteredEmployees: res.data.results
      });
    });
  }, []);

  function handleSort(heading) {

    if (order === "descend") {
      setOrder("ascend");
    } 
    else 
      setOrder("descend");

    function compareFnc(a,b) {
      if (order === "ascend") {
        // account for missing values
        if (a[heading] === undefined) {
          return 1;
        } else if (b[heading] === undefined) {
          return -1;
        }
        // numerically
        else if (heading === "name") {
          return a[heading].first.localeCompare(b[heading].first);
        } else if (heading === "email") {
          return a[heading].localeCompare(b[heading]);
        } else if (heading === "dob") {
          let DOB_a = new Date(a[heading].date);
          let DOB_b = new Date(b[heading].date);
          return DOB_a > DOB_b ? -1 : 1;
        } else {
          return a[heading] - b[heading];
        }
      } else {
        // account for missing values
        if (a[heading] === undefined) {
          return 1;
        } else if (b[heading] === undefined) {
          return -1;
        }
        // numerically
        else if (heading === "name") {
          return b[heading].first.localeCompare(a[heading].first);
        } else if (heading === "email") {
          return a[heading].localeCompare(b[heading]);
        } else if (heading === "dob") {
          let DOB_a = new Date(a[heading].date);
          let DOB_b = new Date(b[heading].date);
          return DOB_a > DOB_b ? -1 : 1;
        } else {
          return b[heading] - a[heading];
        }
      }
    }
    const sortedUsers = employeeState.filteredEmployees.sort(compareFnc);
    setUsers({ ...employeeState, filteredEmployees: sortedUsers });
  }

  function handleSearchChange(event) {
    console.log(event.target.value);
    const filter = event.target.value;
    const filteredList = employeeState.employees.filter(item => {
      // merge data together, then see if user input is anywhere inside
      let values = Object.values(item)
        .join("")
        .toLowerCase();
      return values.indexOf(filter.toLowerCase()) !== -1;
    });
    setUsers({ ...employeeState, filteredEmployees: filteredList });
  }

  return (
    <>
      <EmployeeContext.Provider value={{ headings, employeeState, order, handleSort, handleSearchChange }}>
        <Nav />
        <div className="data-area">
          <DataTable />
        </div>
      </EmployeeContext.Provider>
    </>
  );
}
