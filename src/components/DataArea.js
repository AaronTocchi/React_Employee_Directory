import React, { useState, useEffect} from "react";
import DataTable from "./DataTable";
import Nav from "./Nav";
import API from "../utils/API";
import "../styles/DataArea.css";

function DataArea() {
  
   const [userState, setUserState] = useState({
      users: [{}],
      order: "descend",
      filteredUsers: [{}],
      headings: [
        { name: "Image", width: "10%" },
        { name: "Name", width: "10%" },
        { name: "Phone", width: "20%" },
        { name: "Email", width: "20%" },
        { name: "DOB", width: "10%" }
      ],

      handleSort: heading => {

        if (userState.order === "descend") {
          setUserState({...userState,
            order: "ascend"
          })
        } else {
          setUserState({...userState,
            order: "descend"
          })
        }

        const compareFnc = (a, b) => {
          if (userState.order === "ascend") {
            // account for missing values
            if (a[heading] === undefined) {
              return 1;
            } else if (b[heading] === undefined) {
              return -1;
            }
            // numerically
            else if (heading === "name") {
              return a[heading].first.localeCompare(b[heading].first);
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
            } else {
              return b[heading] - a[heading];
            }
          }

        }
        const sortedUsers = userState.filteredUsers.sort(compareFnc);
        setUserState({ ...userState, filteredUsers: sortedUsers });
      },

      handleSearchChange: event => {
        console.log(event.target.value);
        const filter = event.target.value;
        const filteredList = userState.users.filter(item => {
          // merge data together, then see if user input is anywhere inside
          let values = Object.values(item)
            .join("")
            .toLowerCase();
          return values.indexOf(filter.toLowerCase()) !== -1;
        });
        setUserState({...userState, filteredUsers: filteredList });
      }
    });
  

 useEffect(() => {
    API.getUsers().then(results => {
      setUserState({...userState,
        users: results.data.results,
        filteredUsers: results.data.results
      });
    });
  },[]);

    return (
      <>
        <Nav handleSearchChange={userState.handleSearchChange} />
        <div className="data-area">
          <DataTable
            headings={userState.headings}
            users={userState.filteredUsers}
            handleSort={userState.handleSort}
          />
        </div>
      </>
    );
  
}
export default DataArea
