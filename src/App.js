import { useState } from "react";
import "./App.css";
import AddressAutoComplete from "./Components/AddressAutoComplete/AddressAutoComplete";

function App() {
  // const [address, setAddress] = useState("");
  // const isObject =
  //   Object.keys(address)?.length > 0 && typeof address !== "string"
  //     ? true
  //     : false;
  // const styles = {
  //   padding: "20px 20px",
  //   border: "2px solid",
  //   display: "inline-block",
  //   margin: "10px 5px",
  // };
  return (
    <div className="App" style={{ marginTop: "50px" }}>
      <AddressAutoComplete
        google_api_key={""}
        // passEmpty Array if don't want to filter any country
        allowedCountries={[]}
        seperatedAddress={true}
        label={"Location"}
        onChange={(val) => {
          console.log(val, "response");
          // else setAddress(val);
        }}
      />
      {/* {address && (
        <div>
          <div style={styles}>
            Complete Address:{"  "}
            {isObject ? address?.address : address}
          </div>
          <div style={styles}>
            PostalCode:{"  "}
            {isObject ? address?.postalCode : "-"}
          </div>
          <div style={styles}>
            City:{"  "}
            {isObject ? address?.city : "-"}
          </div>
          <div style={styles}>
            State:{"  "}
            {isObject ? address?.state : "-"}
          </div>
          <div style={styles}>
            Country:{"  "}
            {isObject ? address?.country : "-"}
          </div>
        </div>
      )} */}
    </div>
  );
}

export default App;
