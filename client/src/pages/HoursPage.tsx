import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import 'react-circular-progressbar/dist/styles.css';
import { HourReduction } from '../components/hours/HourReduction';
import { HoursSummary } from '../components/hours/HourSummary';
import { TransferHours } from '../components/hours/HourTransfer';
import { useUserContext } from '../libs/contextLib';
import '../styles/CustomTabs.css';

export const HomePage = () => {
  // @ts-ignore
  const { user } = useUserContext();

  // Signed in
  return (
    <div style={{ padding: '5%', textAlign: 'center' }}>
      <h2>My Hours</h2>
      <br />
      <br />
      <Tabs defaultActiveKey="first">
        <Tab eventKey="first" title="Summary">
          <HoursSummary user={user} />
        </Tab>
        <Tab eventKey="second" title="Hour Reduction">
          <HourReduction />
        </Tab>
        <Tab eventKey="third" title="Transfer Hours">
          <TransferHours user={user} />
        </Tab>
      </Tabs>
    </div>
  );
};
