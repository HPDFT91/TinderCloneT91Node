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
} from "react-native";
import EIcon from "react-native-vector-icons/Entypo";
import ImagePicker from "react-native-image-picker";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default class MultiPic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ImageSource1: null,
      ImageSource2: null,
      ImageSource3: null,
      HASURA_AUTH_ID: "",
      HASURA_AUTH_TOKEN: "",
      user_id: "",
      fileid: "",
      userImage1: "",
      userImage2: "",
      userImage3: ""
    };
  }

  componentDidMount = async () => {
    await AsyncStorage.getItem("HASURA_AUTH_TOKEN").then(value => {
      this.setState({ HASURA_AUTH_TOKEN: value });
    });
    await AsyncStorage.getItem("user_id").then(value => {
      this.setState({ user_id: JSON.parse(value) });
    });
    var auth_token = this.state.HASURA_AUTH_TOKEN;
    var url = "https://app.bleed71.hasura-app.io/APIEP_GetPictures";
    fetch(url + "/" + this.state.user_id + "/" + this.state.HASURA_AUTH_TOKEN)
      .then(async response => {
        return response.json();
      })
      .then(async result => {
        console.log(result);
        if (result[0].userImage1 != null) {
          let source = {
            uri:
              "https://filestore.bleed71.hasura-app.io/v1/file/" +
              result[0].userImage1
          };
          this.setState({ ImageSource1: source });
        }
        if (result[0].userImage2 != null) {
          let source = {
            uri:
              "https://filestore.bleed71.hasura-app.io/v1/file/" +
              result[0].userImage2
          };
          this.setState({ ImageSource2: source });
        }
        if (result[0].userImage3 != null) {
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
  selectPhotoTapped1() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };
        var url = "https://app.bleed71.hasura-app.io/APIEP_UserImage1";
        var auth_token = this.state.HASURA_AUTH_TOKEN;
        const data = new FormData();
        data.append("user_auth_token", auth_token); // add auth token
        data.append("photo", {
          uri: source.uri,
          type: "image/jpeg", // or photo.type
          name: "testPhotoName"
        });
        fetch(url, {
          method: "post",
          body: data
        })
          .then(res => {
            console.log(res);
          })
          .catch(function(error) {
            console.log("Request Failed :" + error);
            return error;
          });

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          ImageSource1: source
        });
      }
    });
  }
  selectPhotoTapped2() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };
        var url = "https://app.bleed71.hasura-app.io/APIEP_UserImage2";
        var auth_token = this.state.HASURA_AUTH_TOKEN;
        const data = new FormData();
        data.append("user_auth_token", auth_token); // add auth token
        data.append("photo", {
          uri: source.uri,
          type: "image/jpeg", // or photo.type
          name: "testPhotoName2"
        });
        fetch(url, {
          method: "post",
          body: data
        })
          .then(res => {
            console.log(res);
          })
          .catch(function(error) {
            console.log("Request Failed :" + error);
            return error;
          });

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          ImageSource2: source
        });
      }
    });
  }
  selectPhotoTapped3() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };
        var url = "https://app.bleed71.hasura-app.io/APIEP_UserImage3";
        var auth_token = this.state.HASURA_AUTH_TOKEN;
        const data = new FormData();
        data.append("user_auth_token", auth_token); // add auth token
        data.append("photo", {
          uri: source.uri,
          type: "image/jpeg", // or photo.type
          name: "testPhotoName3"
        });
        fetch(url, {
          method: "post",
          body: data
        })
          .then(res => {
            console.log(res);
          })
          .catch(function(error) {
            console.log("Request Failed :" + error);
            return error;
          });
        this.setState({
          ImageSource3: source
        });
      }
    });
  }
  render() {
    console.log("MultiProfile render");
    return (
      <Container>
        <Header style={{backgroundColor:'white'}}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack(null)}>
              <Icon name='arrow-back' style={{color:'#ff5f64'}}/>
            </Button>
          </Left>
          <Body>
            <Text style={{fontWeight:'bold'}}>Your Pictures</Text>
          </Body>
          <Right/>
        </Header>
        <Content>
          
          <View style={{ marginTop: 5 }}>
            <View>
              <Card style={{ flex: 0 }}>
                <CardItem>
                  <Body>
                    <TouchableOpacity
                      onPress={this.selectPhotoTapped1.bind(this)}
                    >
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
                    </TouchableOpacity>
                  </Body>
                </CardItem>
              </Card>
            </View>
          </View>
          <View >
            <View>
              <Card style={{ flex: 0 }}>
                <CardItem>
                  <Body>
                    <TouchableOpacity
                      onPress={this.selectPhotoTapped2.bind(this)}
                    >
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
                    </TouchableOpacity>
                  </Body>
                </CardItem>
              </Card>
            </View>
          </View>
          <View >
            <View>
              <Card style={{ flex: 0 }}>
                <CardItem>
                  <Body>
                    <TouchableOpacity
                      onPress={this.selectPhotoTapped3.bind(this)}
                    >
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
                    </TouchableOpacity>
                  </Body>
                </CardItem>
              </Card>
            </View>
          </View>
        </Content>
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
    width: deviceWidth-40,
    height: deviceHeight/2,
    borderColor: "gainsboro",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gainsboro"
  }
});
