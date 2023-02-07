import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { render } from "react-dom";
import "./style.css";
import propTypes from "prop-types";

import styled from "styled-components";

import "react-tabs/style/react-tabs.css";

const Input = styled.input``;

function InputFunction({ value }) {
  return (
    <div>
      <Input />
    </div>
  );
}

interface MinhaFuncaoProps {
  name: string;
  children: React.ReactNode;
}

function MinhaFuncao({ name, children }: MinhaFuncaoProps) {
  return (
    <div>
      Name: {name}
      {children}
    </div>
  );
}

MinhaFuncao.defaultProps = {
  name: "meu Ovo"
};

InputFunction.defaultProps = {
  value: ""
};

InputFunction.propTypes = {
  value: propTypes.string
};

function App() {
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <div>
      <p>Start editing to see some magic happen :)</p>
      <Tabs defaultIndex={tabIndex}>
        <TabList>
          <Tab>Title 1</Tab>
          <Tab>Title 2</Tab>
        </TabList>

        <TabPanel>
          <h2>Any content 1</h2>
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>
        </TabPanel>
      </Tabs>
      <InputFunction />
      <MinhaFuncao name="Mozovo">
        <div>aaaa</div>
      </MinhaFuncao>
    </div>
  );
}

render(<App />, document.getElementById("root"));
