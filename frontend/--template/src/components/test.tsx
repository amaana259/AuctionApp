import React from "react";
import Navbar from "./Navbar";

const TestComponent: React.FC = () => {
  return (
    <div>
      <Navbar />
      <h1>testing navbar</h1>
    </div>
  );
};

export default TestComponent;           // this was a journey to discovering css clashes.