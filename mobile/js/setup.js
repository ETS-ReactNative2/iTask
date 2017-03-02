import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

import MobileApp from './MobileApp';


function setup(): React.Component {
  class Root extends React.Component {
    constructor() {
      super();
      this.state = {
        isLoading: true,
        store: configureStore(() => this.setState({isLoading: false})),
      };
    }
    render() {
      if (this.state.isLoading) {
        return null;
      }
      return (
        <Provider store={this.state.store}>
          <MobileApp />
        </Provider>
      );
    }
  }

  return Root;

}

module.exports = setup;