import React, { Component } from "react";
import {
  BackAndroid,
  Drawer,
  StatusBar,
  Platform,
  View,
  Left,
  Right,
  Text
} from "react-native";
import { variables, Icon, Button, Header, Item, Input } from "native-base";
import Tabs from "./Tabs";
import LoginPage from "./LoginPage";
import { StackNavigator } from "react-navigation";
import ProfileScreen from "./ProfileScreen";
import MultiPic from "./MultiPic";
import SwipeCardImages from "./SwipeCardImages";
const StackNav = StackNavigator(
  {
    LoginPage: { screen: LoginPage },
    Tabs: { screen: Tabs },
    ProfileScreen: { screen: ProfileScreen },
    MultiPic: { screen: MultiPic },
    SwipeCardImages: { screen: SwipeCardImages }
  },
  {
    headerMode: "none"
  }
);

export default StackNav;
