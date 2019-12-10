import React from "react";

const EmployeeContext = React.createContext({
	employees: [{}],
  	filteredEmployees: [{}],
  	order: '',
  	headings: [{}],
  	handleSort: () => undefined,
  	handleSearchChange: () => undefined
})

export default EmployeeContext;