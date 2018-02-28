import React, { Component } from "react";
import {
  Container,
  Content,
  Text,
  Button,
  Icon,
  Form,
  Item,
  Label,
  Thumbnail,
  Input
} from "native-base";
import { TextInput, Dimensions } from "react-native";
import { View, Alert } from "react-native";
import { AsyncStorage } from "react-native";
const logo = require("./logo.png");
const deviceWidth = Dimensions.get("window").width;

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      usernameTextBox: "",
      passwordTextBox: "",
      used_id: "",
      city: "",
      gender: "",
      HASURA_AUTH_TOKEN: ""
    };
    this.handleSignupPressed = this.handleSignupPressed.bind(this);
  }

  componentDidMount = async () => {
    console.log("LoginScreen mounted");
    await AsyncStorage.getItem("HASURA_AUTH_TOKEN").then(value => {
      this.setState({ HASURA_AUTH_TOKEN: value });
      console.log(this.state.HASURA_AUTH_TOKEN);
    });
    if (this.state.HASURA_AUTH_TOKEN == null) {
      this.setState({ usernameTextBox: "" });
      this.setState({ passwordTextBox: "" });
    }
    if (this.state.HASURA_AUTH_TOKEN != null) {
      this.props.navigation.navigate("Tabs");
    }
  };

  handleLoginPressed = async () => {
    var url = "https://app.bleed71.hasura-app.io/APIEP_Login_Username";

    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    };

    var body = {
      provider: "username",
      data: {
        username: this.state.usernameTextBox,
        password: this.state.passwordTextBox
      }
    };

    requestOptions.body = JSON.stringify(body);
    console.log("Login response---------");
    fetch(url, requestOptions)
      .then(async response => {
        if (response.status === 200) {
          this.setState({ isLoggedIn: true });
          console.log("Login Response");
          console.log(response);
        } else {
          Alert.alert("Error", "Invalid Username / Password");
        }
        return response.json();
      })
      .then(async result => {
        console.log("Result:" + result);
        console.log("Auth token:" + result[0].auth_token);
        await AsyncStorage.setItem("HASURA_AUTH_TOKEN", result[0].auth_token);
        this.setState({ HASURA_AUTH_TOKEN: result[0].auth_token });

        console.log("Userid:" + result[0].hasura_id);
        await AsyncStorage.setItem(
          "user_id",
          JSON.stringify(result[0].hasura_id)
        );
        this.setState({ user_id: JSON.stringify(result.hasura_id) });

        console.log("Username:" + result[0].username);
        await AsyncStorage.setItem(
          "username",
          JSON.stringify(result[0].username)
        );
        
        this.setState({usernameTextBox:''});
        this.setState({passwordTextBox:''});
        
        this.props.navigation.navigate("Tabs");
        
        console.log("Gender:" + result[1].Gender);
        if (result[1].Gender != null) {
          await AsyncStorage.setItem("gender", result[1].Gender);
        }

        if (result[1].City != null) {
          await AsyncStorage.setItem("city", result[1].City);
        }

        console.log("fileid:" + result[1].fileid);
        if (result[1].fileid != null) {
          await AsyncStorage.setItem("fileid", result[1].fileid);
          console.log("fileid");
          await AsyncStorage.getItem("fileid").then(value => {
            console.log("      " + value);

            
          });
        }
        //  else{
        //      await AsyncStorage.setItem('fileid',JSON.stringify(result[1].fileid));
        // }
       
        
      })
      .catch(function(error) {
        console.log("Request Failed:" + error);
      });
  };

  handleSignupPressed = async () => {
    url = "https://app.bleed71.hasura-app.io/APIEP_Signup_Username";
    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    };

    var body = {
      provider: "username",
      data: {
        username: this.state.usernameTextBox,
        password: this.state.passwordTextBox
      }
    };

    requestOptions.body = JSON.stringify(body);
    console.log("Auth Response ---------------------");

    fetch(url, requestOptions)
      .then(async response => {
        if (response.status === 200) {
          this.setState({ isLoggedIn: true });
          console.log(response);
        } else {
          Alert.alert("Error", "Password too short / User already exists");
        }
        return response.json();
      })
      .then(async result => {
        console.log("Hello");
        console.log(result);
        console.log(result[0].auth_token);
        await AsyncStorage.setItem("HASURA_AUTH_TOKEN", result[0].auth_token);
        this.setState({ HASURA_AUTH_TOKEN: result[0].auth_token });
        console.log(JSON.stringify(result[0].hasura_id));
        await AsyncStorage.setItem(
          "user_id",
          JSON.stringify(result[0].hasura_id)
        );
        await AsyncStorage.setItem(
          "username",
          JSON.stringify(result[0].username)
        );
        this.setState({ user_id: result[0].hasura_id });
        this.setState({usernameTextBox:''});
        this.setState({passwordTextBox:''});
        this.props.navigation.navigate("Tabs");
      })

      .catch(function(error) {
        console.log("Request Failed:" + error);
      });
  };

  handleUsernameChange = usernameTextBox => {
    this.setState({
      ...this.state,
      usernameTextBox: usernameTextBox
    });
  };

  handlePasswordChange = passwordTextBox => {
    this.setState({
      ...this.state,
      passwordTextBox: passwordTextBox
    });
  };

  render() {
    return (
      <Container style={{ backgroundColor: "white", padding: 20 }}>
        <View style={{ marginTop: 30 }}>
          <View style={{ alignItems: "center" }}>
            <Thumbnail large source={logo} />
          </View>
          <Form>
            <Item>
              <Input
               placeholder="Username"
                value={this.state.usernameTextBox}
                onChangeText={this.handleUsernameChange}
              />
            </Item>
            <Item floatingLabel>
              <Input
              placeholder="Password"
                value={this.state.passwordTextBox}
                onChangeText={this.handlePasswordChange}
                secureTextEntry
              />
            </Item>
          </Form>
          <View style={{ alignItems: "center", marginLeft: deviceWidth / 5 }}>
            <View style={{ height: 10, marginTop: 50, alignItems: "center" }} />
            <Button
              rounded
              onPress={this.handleSignupPressed}
              style={{ backgroundColor: "#ff5f64", width: 200 }}
            >
              <Text style={{ marginLeft: deviceWidth / 7.5 }}> Sign Up </Text>
            </Button>
            <View style={{ height: 10, alignItems: "center", marginTop: 15 }} />
            <Button
              rounded
              title="Log in"
              onPress={this.handleLoginPressed}
              style={{ backgroundColor: "#ff5f64", width: 200 }}
            >
              <Text style={{ marginLeft: deviceWidth / 7 }}> Log In </Text>
            </Button>
          </View>
        </View>
      </Container>
    );
  }
}
