import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  AsyncStorage,
  RefreshControl,
  TouchableOpacity
} from "react-native";
import {
  Container,
  Header,
  Title,
  Button,
  IconNB,
  DeckSwiper,
  Card,
  CardItem,
  Icon,
  Thumbnail,
  Text,
  Left,
  Right,
  Content,
  View,
  Body,
  List
} from "native-base";
import EIcon from "react-native-vector-icons/Entypo";
import FAIcon from "react-native-vector-icons/FontAwesome";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
class SwipeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      user_id: "",
      HASURA_AUTH_ID: "",
      city: "",
      gender: "",
      currentUser: "",
      refreshing: false,
      prevItem: "",
      undon: 0,
      fileid: null
    };
    this.fetchInfo.bind(this);
    this.onLike.bind(this);
    this.onButtonLike.bind(this);
    this.onDislike.bind(this);
    this.displayCards.bind(this);
    this._onRefresh.bind(this);
    this.goToUser.bind(this);
  }

  componentDidMount = async () => {
    this.fetchInfo();
  };

  onLike = async item => {
    console.log(item.User_id);
    console.log(this.state.HASURA_AUTH_ID);
    var auth_token = this.state.HASURA_AUTH_ID;
    console.log(auth_token);
    fetch(
      "https://app.bleed71.hasura-app.io/APIEP_Likes/" +
        item.User_id +
        "/" +
        this.state.user_id +
        "/" +
        auth_token
    )
      .then(async response => {
        return response.json();
      })
      .then(async result => {
        console.log(result);
        console.log(result.affected_rows);
        if (result.affected_rows == 1) Alert.alert("Its a Match!");
      })
      .catch(function(error) {
        console.log("Request Failed:" + error);
      });
  };

  onButtonLike = () => {
    this.onLike(this._deckSwiper._root.state.selectedItem);
    this._deckSwiper._root.swipeRight();
  };

  onButtonDislike = () => {
    this.onDisike(this._deckSwiper._root.state.selectedItem);
    this._deckSwiper._root.swipeLeft();
  };

  onDislike = item => {
    console.log("Dislike");
  };

  goToUser = async item => {
    var current = this._deckSwiper._root.state.selectedItem.User_id;
    var name = this._deckSwiper._root.state.selectedItem.User_name;
    await AsyncStorage.setItem("DisplayedUserId", JSON.stringify(current));
    await AsyncStorage.setItem("DisplayedUsername", name);
    this.props.navigation.navigate("SwipeCardImages");
  };

  displayCards = item => {
    var userid = item.User_id;
    return (
      <Card style={{ elevation: 3 }}>
        <TouchableOpacity onPress={this.goToUser}>
          <CardItem cardBody>
            <Image
              style={{ height: 300, flex: 1 }}
              source={{
                uri:
                  "https://filestore.bleed71.hasura-app.io/v1/file/" +
                  item.fileid
              }}
            />
          </CardItem>
          <CardItem>
            <IconNB name={"ios-heart"} style={{ color: "#ED4A6A" }} />
            <Text>{item.User_name}</Text>
          </CardItem>
        </TouchableOpacity>
      </Card>
    );
  };

  fetchInfo = async () => {
    console.log("Cards:" + this.state.cards.length);

    await AsyncStorage.getItem("HASURA_AUTH_TOKEN").then(value => {
      this.setState({ HASURA_AUTH_ID: value });
      console.log("hasura auth token:" + this.state.HASURA_AUTH_ID);
    });
    await AsyncStorage.getItem("user_id").then(value => {
      this.setState({ user_id: value });
      console.log("user id:" + this.state.user_id);
    });
    await AsyncStorage.getItem("city").then(value => {
      this.setState({ city: value });
      console.log("city:" + this.state.city);
    });
    await AsyncStorage.getItem("gender").then(value => {
      this.setState({ gender: value });
      console.log("gender:" + this.state.gender);
    });
    await AsyncStorage.getItem("fileid").then(value => {
      this.setState({ fileid: value });
      console.log("fileid:" + this.state.fileid);
    });
    var url = "https://app.bleed71.hasura-app.io/APIEP_UserDetailsforSwipe";
    fetch(
      url +
        "/" +
        this.state.user_id +
        "/" +
        this.state.gender +
        "/" +
        this.state.city +
        "/" +
        this.state.HASURA_AUTH_ID
    )
      .then(async response => {
        return response.json();
      })
      .then(async result => {
        console.log(JSON.stringify(result));
        this.setState({ cards: result });
        console.log("Cards:" + this.state.cards);
      })
      .catch(function(error) {
        console.log("Request Failed:" + error);
      });
  };

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    this.fetchInfo;
    this.setState({ refreshing: false });
  };

  render() {
    if (this.state.gender && this.state.city && this.state.fileid != null) {
      if (this.state.cards.length > 0) {
        return (
          <Container>
            <Content
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.fetchInfo}
                  tintColor="#ff5f64"
                  colors={["#ff5f64"]}
                />
              }
            >
              <View style={{ padding: 20, paddingTop: 50, paddingBottom: -10 }}>
                <DeckSwiper
                  ref={mr => (this._deckSwiper = mr)}
                  dataSource={this.state.cards}
                  looping={false}
                  renderEmpty={() => (
                    <View
                      style={{
                        marginTop: deviceWidth / 2,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          justifyContent: "center",
                          flex: 10,
                          color: "#ff5f64",
                          fontSize: 25,
                          padding: 35
                        }}
                      >
                        That's all for now.
                      </Text>
                    </View>
                  )}
                  onSwipeRight={this.onLike}
                  onSwipeLeft={this.onDislike}
                  renderItem={this.displayCards}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  bottom: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 30,
                  marginTop: 370
                }}
              >
                <Button
                  rounded
                  style={[styles.button, { height: 60, width: 60 }]}
                  onPress={() => this._deckSwiper._root.swipeLeft()}
                >
                  <EIcon style={{ fontSize: 40, color: "red" }} name="cross" />
                </Button>

                <Button
                  style={[styles.button, { height: 60, width: 60 }]}
                  onPress={this.onButtonLike}
                >
                  <Icon
                    name="heart"
                    style={{ color: "rgb(69,169,76)", fontSize: 30 }}
                  />
                </Button>
              </View>
            </Content>
          </Container>
        );
      } else {
        return (
          <Content
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.fetchInfo}
                tintColor="#ff5f64"
                colors={["#ff5f64"]}
              />
            }
            style={{ backgroundColor: "white" }}
          >
            <View
              style={{
                marginTop: deviceWidth / 2,
                backgroundColor: "white",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  flex: 10,
                  color: "#ff5f64",
                  fontSize: 25,
                  padding: 35
                }}
              >
                Nothing to show. Yet.
              </Text>
            </View>
          </Content>
        );
      }
    } else {
      return (
        <Content
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.fetchInfo}
              tintColor="#ff5f64"
              colors={["#ff5f64"]}
            />
          }
        >
          <View
            style={{
              backgroundColor: "#ff5f64",
              padding: 30,
              alignItems: "center"
            }}
          >
            <Text
              style={{
                textAlign: "center",
                justifyContent: "center",
                flex: 10,
                color: "white",
                fontSize: 25,
                padding: 35
              }}
            >
              Hey there! Add your gender, city and profile picture, and pull to
              refresh!
            </Text>
            <Button
              rounded
              style={{
                alignSelf: "center",
                backgroundColor: "white",
                marginBottom: 35
              }}
              onPress={() => this.props.navigation.navigate("ProfileScreen")}
            >
              <Text style={{ color: "#ff5f64" }}>Click Here</Text>
            </Button>
          </View>
        </Content>
      );
    }
  }
}

export default SwipeScreen;

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    width: 50,
    height: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    margin: 35
  },
  textOnImg: {
    position: "absolute",
    bottom: 30,
    marginLeft: 15,
    color: "white",
    fontSize: 25
  }
});
