import React, { Component } from "react";
import { Container } from "native-base";
import { Platform, StyleSheet, Text, View } from "react-native";

import LoginPage from "./source/screens/LoginPage";
import StackNav from "./source/screens/StackNav";

export default class App extends Component {
  render() {
    return (
      <Container>
        <StackNav />
      </Container>
    );
  }
}
