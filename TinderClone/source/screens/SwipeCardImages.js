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
  Icon,
  Switch,
  Radio
} from "native-base";
import {
  Animated,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Linking,
  AsyncStorage,
  Image,
  Dimensions,
  Thumbnail
} from "react-native";
import EIcon from "react-native-vector-icons/Entypo";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default class SwipeCardImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ImageSource1: null,
      ImageSource2: null,
      ImageSource3: null,
      HASURA_AUTH_TOKEN: "",
      user_id: "",
      username: "",
      fileid: ""
    };
  }

  componentDidMount = async () => {
    console.log("SwipeCard imgs mounted");
    await AsyncStorage.getItem("HASURA_AUTH_TOKEN").then(value => {
      this.setState({ HASURA_AUTH_TOKEN: value });
    });
    await AsyncStorage.getItem("DisplayedUserId").then(value => {
      this.setState({ user_id: JSON.parse(value) });
    });
    await AsyncStorage.getItem("DisplayedUsername").then(value => {
      this.setState({ username: value });
    });
    var auth_token = this.state.HASURA_AUTH_TOKEN;
    var url = "https://app.bleed71.hasura-app.io/APIEP_GetPictures";
    fetch(url + "/" + this.state.user_id + "/" + this.state.HASURA_AUTH_TOKEN)
      .then(async response => {
        return response.json();
      })
      .then(async result => {
        if (result[0].userImage1 !== null) {
          let source = {
            uri:
              "https://filestore.bleed71.hasura-app.io/v1/file/" +
              result[0].userImage1
          };
          this.setState({ ImageSource1: source });
        }
        if (result[0].userImage2 !== null) {
          let source = {
            uri:
              "https://filestore.bleed71.hasura-app.io/v1/file/" +
              result[0].userImage2
          };
          this.setState({ ImageSource2: source });
        }
        if (result[0].userImage3 !== null) {
          let source = {
            uri:
              "https://filestore.bleed71.hasura-app.io/v1/file/" +
              result[0].userImage3
          };
          this.setState({ ImageSource3: source });
        }
      })
      .catch(function(error) {
        console.log("Request Failed:" + error);
      });
  };

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "white" }}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.goBack(null)}
            >
              <Icon name="arrow-back" style={{ color: "#ff5f64" }} />
            </Button>
          </Left>
          <Body>
            <Text style={{ fontWeight: "bold" }}>
              {this.state.username}'s Pictures
            </Text>
          </Body>
          <Right />
        </Header>
        {this.state.ImageSource1 === null &&
        this.state.ImageSource2 === null &&
        this.state.ImageSource3 == null ? (
          <Content style={{ backgroundColor: "white" }}>
            <View>
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
                  Nothing to show.
                </Text>
              </View>
            </View>
          </Content>
        ) : (
          <Content>
            {this.state.ImageSource1 !== null ? (
              <View>
                <View>
                  <Card style={{ flex: 0 }}>
                    <CardItem>
                      <Body>
                        <View style={styles.ImageContainer}>
                          {this.state.ImageSource1 === null ? (
                            <EIcon
                              style={{
                                fontSize: 45,
                                color: "white"
                              }}
                              name="user"
                            />
                          ) : (
                            <Image
                              style={styles.ImageContainer}
                              source={this.state.ImageSource1}
                            />
                          )}
                        </View>
                      </Body>
                    </CardItem>
                  </Card>
                </View>
              </View>
            ) : null}
            {this.state.ImageSource2 !== null ? (
              <View>
                <View>
                  <Card style={{ flex: 0 }}>
                    <CardItem>
                      <Body>
                        <View style={styles.ImageContainer}>
                          {this.state.ImageSource2 === null ? (
                            <EIcon
                              style={{
                                fontSize: 45,
                                color: "white"
                              }}
                              name="user"
                            />
                          ) : (
                            <Image
                              style={styles.ImageContainer}
                              source={this.state.ImageSource2}
                            />
                          )}
                        </View>
                      </Body>
                    </CardItem>
                  </Card>
                </View>
              </View>
            ) : null}
            {this.state.ImageSource3 !== null ? (
              <View>
                <View>
                  <Card style={{ flex: 0 }}>
                    <CardItem>
                      <Body>
                        <View style={styles.ImageContainer}>
                          {this.state.ImageSource3 === null ? (
                            <EIcon
                              style={{
                                fontSize: 45,
                                color: "white"
                              }}
                              name="user"
                            />
                          ) : (
                            <Image
                              style={styles.ImageContainer}
                              source={this.state.ImageSource3}
                            />
                          )}
                        </View>
                      </Body>
                    </CardItem>
                  </Card>
                </View>
              </View>
            ) : null}
          </Content>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  buttonText: {
    color: "black",
    textAlign: "center"
  },
  textInput: {
    height: 50,
    borderColor: "lightgray",
    backgroundColor: "white",
    paddingLeft: 15
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8E1"
  },

  ImageContainer: {
    width: deviceWidth - 40,
    height: deviceHeight / 2,
    borderColor: "gainsboro",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gainsboro"
  }
});
