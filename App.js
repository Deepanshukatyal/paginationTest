import React, { Component } from 'react';
import AppContainer from './app/navigation';
import { Root } from "native-base";
class App extends Component {
  state = {}
  render() {
    return (
      <Root>
        <AppContainer />
      </Root>
    );
  }
}

export default App;