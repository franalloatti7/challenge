import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
const port = 3300;
const client = new ApolloClient({
  uri: `http://localhost:${port}`,
  request: (operation) => {
    const token = sessionStorage.getItem('token')
    operation.setContext({
      headers: {
        token: token ? token : ''
      }
    })
  }
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App/>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
