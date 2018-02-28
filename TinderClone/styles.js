const React = require("react-native");
const { StyleSheet, Platform, Dimensions } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
export default {
    view:{
        alignItems:'center',
        justifyContent:'center',
        marginTop:6*deviceWidth/5,
        marginLeft:deviceWidth/5
      }
};