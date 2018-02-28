import React, { Component } from "react";
import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Body,
  View,
  Right,
  Left,
  Header,
  Title,
  Button,
  Icon
} from "native-base";
import Animated from "react-native";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { StackNavigator, TabNavigator } from "react-navigation";
import SwipeScreen from "./SwipeScreen";
import MatchesScreen from "./MatchesScreen";
import ProfileScreen from "./ProfileScreen";

const Tabs = TabNavigator(
  {
    ProfileScreen: {
      screen: ProfileScreen,
      navigationOptions: {
        title: "ProfileScreen",
        tabBarIcon: ({ tintColor }) => (
          <FAIcon
            name="user-circle"
            style={{ color: tintColor, fontSize: 20 }}
          />
        )
      }
    },
    SwipeScreen: {
      screen: SwipeScreen,
      navigationOptions: {
        title: "SwipeScreen",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="flame" style={{ color: tintColor, fontSize: 30 }} />
        )
      }
    },
    MatchesScreen: {
      screen: MatchesScreen,
      navigationOptions: ({ navigation }) => ({
        title: "MatchesScreen",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="ios-chatbubbles"
            style={{ color: tintColor, fontSize: 20 }}
          />
        )
      })
    }
  },
  {
    tabBarPosition: "top",
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      indicatorStyle: {
        borderBottomColor: "white",
        borderBottomWidth: 2
      },
      activeTintColor: "#ff5f64",
      inactiveTintColor: "grey",
      style: {
        backgroundColor: "white"
      }
    }
  }
);

export default Tabs;
