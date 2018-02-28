import React, { Component } from "react";
import { AsyncStorage, RefreshControl, Image, Dimensions } from "react-native";
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Text,
  Body,
  Left,
  Right,
  Thumbnail,
  View
} from "native-base";

const deviceWidth = Dimensions.get("window").width;
export default class MtachesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      user_id: "",
      HASURA_AUTH_TOKEN: "",
      city: "",
      gender: "",
      currentUser: "",
      refreshing: false,
      prevItem: "",
      undon: 0
    };
    this.fetchMatches.bind(this);
  }

  componentDidMount = async () => {
    console.log("SwipeScreen mounted!!");
    this.fetchMatches();
  };

  fetchMatches = async () => {
    console.log("in fetchMatches");
    console.log("Matches:" + this.state.matches.length);

    await AsyncStorage.getItem("HASURA_AUTH_TOKEN").then(value => {
      this.setState({ HASURA_AUTH_TOKEN: value });
      console.log("mathses:   " + this.state.HASURA_AUTH_TOKEN);
    });
    await AsyncStorage.getItem("user_id").then(value => {
      this.setState({ user_id: value });
      console.log("matches:    " + this.state.user_id);
      console.log(this.state.matches.length);
    });

    var url = "https://app.bleed71.hasura-app.io/APIEP_MatchList";

    fetch(url + "/" + this.state.user_id + "/" + this.state.HASURA_AUTH_TOKEN)
      .then(async response => {
        return response.json();
      })
      .then(async result => {
        console.log("MatchScreen response");

        console.log(result);
        this.setState({ matches: result });
        console.log(this.state.matches);
      })
      .catch(function(error) {
        console.log("Request Failed:" + error);
      });
  };

  render() {
    if (this.state.matches.length > 0) {
      return (
        <Container style={{ backgroundColor: "white", paddingTop: 10 }}>
          <Content
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.fetchMatches}
                tintColor="#ff5f64"
                colors={["#ff5f64"]}
              />
            }
          >
            <View style={{ padding: 15 }}>
              <Text style={{ color: "#ff5f64" }}>MATCHES</Text>
            </View>
            <List
              dataArray={this.state.matches}
              renderRow={item => (
                <ListItem avatar style={{paddingBottom:10}} >
                  <Left>
                    <Thumbnail
                      source={{
                        uri:
                          "https://filestore.bleed71.hasura-app.io/v1/file/" +
                          item.fileid
                      }}
                    />
                  </Left>
                  <Body >
                    <Text style={{paddingBottom:7}} >{item.name}</Text>
                  </Body>
                </ListItem>
              )}
            />
          </Content>
        </Container>
      );
    } else {
      return (
        <Content
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.fetchMatches}
              tintColor="#ff5f64"
              colors={["#ff5f64"]}
            />
          }
          style={{ backgroundColor: "white" }}
        >
          <View
            style={{
              marginTop: 20,
              alignItems: "center",
              paddingTop: deviceWidth / 2
            }}
          >
            <Text
              style={{
                textAlign: "center",
                justifyContent: "center",
                flex: 10,
                color: "#ff5f64",
                fontSize: 30,
                paddingTop: 20,
                paddingBottom: 10
              }}
            >
              Get Swiping
            </Text>
            <Text
              style={{
                textAlign: "center",
                justifyContent: "center",
                flex: 10,
                color: "lightgrey",
                fontSize: 20,
                padding: 25,
                paddingTop: 10
              }}
            >
              When you match with other users they'll appear here. Pull downwards to refresh.
            </Text>
          </View>
        </Content>
      );
    }
  }
}
