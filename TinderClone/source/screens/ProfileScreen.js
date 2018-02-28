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
  Dimensions
} from "react-native";
import EIcon from "react-native-vector-icons/Entypo";
import ImagePicker from "react-native-image-picker";

const deviceWidth = Dimensions.get("window").width;

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ImageSource: null,
      city: "",
      gender: "",
      HASURA_AUTH_TOKEN: "",
      user_id: "",
      username: "",
      isLoggedIn: true,
      fileid: ""
    };
    this.addUserData = this.addUserData.bind(this);
  }

  componentDidMount = async () => {
    console.log("Profilescreen mounted");
    await AsyncStorage.getItem("HASURA_AUTH_TOKEN").then(value => {
      this.setState({ HASURA_AUTH_TOKEN: value });
      console.log("hasura auth id " + this.state.HASURA_AUTH_TOKEN);
    });
    await AsyncStorage.getItem("username").then(value => {
      this.setState({ username: JSON.parse(value) });
    });
    await AsyncStorage.getItem("city").then(value => {
      this.setState({ city: value });
    });
    await AsyncStorage.getItem("gender").then(value => {
      this.setState({ gender: value });
    });
    await AsyncStorage.getItem("fileid").then(value => {
      this.setState({ fileid: value });
      console.log(this.state.fileid);
    });
    if (this.state.fileid !== null) {
      let source = {
        uri:
          "https://filestore.bleed71.hasura-app.io/v1/file/" + this.state.fileid
      };
      this.setState({ ImageSource: source });
    }
  };

  addUserData = async () => {
    await AsyncStorage.getItem("HASURA_AUTH_TOKEN").then(value => {
      this.setState({ HASURA_AUTH_TOKEN: value });
      console.log(this.state.HASURA_AUTH_TOKEN);
    });
    await AsyncStorage.getItem("user_id").then(value => {
      this.setState({ user_id: value });
    });
    await AsyncStorage.setItem("city", this.state.city);
    console.log(this.state.city);
    await AsyncStorage.setItem("gender", this.state.gender);
    console.log(this.state.gender);
    //await AsyncStorage.setItem("fileid", this.state.fileid);
    console.log(this.state.gender);
    console.log(this.state.user_id);
    console.log(this.state.username);

    var url = "https://data.bleed71.hasura-app.io/v1/query";

    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.HASURA_AUTH_TOKEN
      }
    };
    console.log("after requestoptions");
    var body = {
      type: "update",
      args: {
        table: "User",
        where: {
          User_id: {
            $eq: this.state.user_id
          }
        },
        $set: {
          City: this.state.city,
          Gender: this.state.gender
        }
      }
    };

    requestOptions.body = JSON.stringify(body);

    fetch(url, requestOptions)
      .then(async response => {
        console.log(response);
        return response.json();
      })
      .then(async result => {
        console.log("Login Result");
        console.log(result);
      })
      .catch(function(error) {
        console.log("Request Failed:" + error);
      });
  };

  handleLogout = async () => {
    console.log("in login");
    await AsyncStorage.getItem("HASURA_AUTH_TOKEN").then(value => {
      this.setState({ HASURA_AUTH_TOKEN: value });
      console.log(this.state.HASURA_AUTH_TOKEN);
    });

    var url = "https://app.bleed71.hasura-app.io/APIEP_Logout";
    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    };
    var body = {
      auth_key: this.state.HASURA_AUTH_TOKEN
    };
    requestOptions.body = JSON.stringify(body);

    fetch(url, requestOptions)
      .then(function(response) {
        return response.json();
      })
      .then(function(result) {
        console.log(result);
      })
      .catch(function(error) {
        console.log("Request Failed locally  6" + error);
      });

    AsyncStorage.removeItem("city", err => console.log("Removed city", err));
    AsyncStorage.removeItem("gender", err =>
      console.log("Removed gender", err)
    );
    AsyncStorage.removeItem("HASURA_AUTH_TOKEN", err =>
      console.log("Removed hasura auth id", err)
    );
    AsyncStorage.removeItem("user_id", err =>
      console.log("Removed user_id", err)
    );
    AsyncStorage.removeItem("username", err =>
      console.log("Removed username", err)
    );
    AsyncStorage.removeItem("fileid", err =>
      console.log("Removed fileid", err)
    );
    this.props.navigation.goBack(null);
  };

  handleCityChange = async city => {
    this.setState({
      ...this.state,
      city: city
    });
  };

  handleGenderChange = gender => {
    this.setState({
      ...this.state,
      gender: gender
    });
  };

  selectPhotoTapped() {
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
        console.log(this.state.HASURA_AUTH_TOKEN);
        console.log("befor pp request");
        var url = "https://app.bleed71.hasura-app.io/APIEP_PP";
        var auth_token = this.state.HASURA_AUTH_TOKEN;
        const data = new FormData();
        data.append("user_auth_token", auth_token);
        data.append("photo", {
          uri: source.uri,
          type: "image/jpeg",
          name: "testPhotoName"
        });
        fetch(url, {
          method: "post",
          body: data
        })
          .then(res => {
            this.setState({ fileid: JSON.parse(res._bodyInit).file_id });
            console.log("fileid:" + this.state.fileid);
            AsyncStorage.setItem("fileid", this.state.fileid);
          })
          .catch(function(error) {
            console.log("Request Failed :" + error);
            return error;
          });
        this.setState({
          ImageSource: source
        });
      }
    });
  }
  render() {
    return (
      <Container>
        <Content>
          <View style={{ margin: 20 }}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                <View style={styles.ImageContainer}>
                  {this.state.ImageSource === null ? (
                    <EIcon
                      style={{ fontSize: 45, color: "white" }}
                      name="user"
                    />
                  ) : (
                    <Image
                      style={styles.ImageContainer}
                      source={this.state.ImageSource}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 15
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 25 }}>
                {this.state.username}
              </Text>
            </View>

            <View
              style={{
                marginBottom: 20,
                backgroundColor: "white",
                padding: 10
              }}
            >
              <Text
                style={[
                  styles.heading,
                  { color: "#ff5f64", marginBottom: 10, paddingLeft: 15 }
                ]}
              >
                Discovery Settings
              </Text>
              <TextInput
              autoCapitalize="words"
                underlineColorAndroid="transparent"
                placeholder="Enter City"
                placeholderTextColor="gray"
                style={styles.textInput}
                value={this.state.city}
                onChangeText={this.handleCityChange}
              />
              <TextInput
                autoCapitalize="words"
                underlineColorAndroid="transparent"
                placeholder="Enter Gender"
                placeholderTextColor="gray"
                style={styles.textInput}
                value={this.state.gender}
                onChangeText={this.handleGenderChange}
                
              />
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 15,
                  position: "relative"
                }}
              >
                <Button
                  rounded
                  style={{ backgroundColor: "#ff5f64", height: 40 }}
                  onPress={this.addUserData}
                >
                  <Text> Set Details </Text>
                </Button>
              </View>
            </View>
            <View
              style={{
                marginBottom: 15,
                backgroundColor: "white",
                padding: 25
              }}
            >
              <Button
                block
                style={styles.button}
                onPress={() => this.props.navigation.navigate("MultiPic")}
              >
                <Text style={{ color: "#ff5f64" }}> Upload Pictures </Text>
              </Button>
              <Text />
              <Text />
              <Text />
              <Button block style={styles.button} onPress={this.handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
              </Button>
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
    borderRadius: 180,
    width: 75,
    height: 75,
    borderColor: "gainsboro",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gainsboro",
    overflow: "hidden"
  }
});
