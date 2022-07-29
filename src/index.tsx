import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Entry from './system/content/entry/entry';

const REACT_APP_AUTH0_DOMAIN = 'dev-a0p0m4lr.us.auth0.com';
const REACT_APP_AUTH0_CLIENT_ID = 'XElkFQA31rV3eKP9agaPhA4sFPdtf47N';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Auth0Provider
    domain={REACT_APP_AUTH0_DOMAIN}
    clientId={REACT_APP_AUTH0_CLIENT_ID}
    redirectUri={window.location.origin}
  >
    <React.StrictMode>
      <Entry />
    </React.StrictMode>
  </Auth0Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
