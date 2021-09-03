import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  Dimensions
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import firebase from 'firebase';
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { Switch } from "react-native";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
     isenabled: false,
     light_theme: true,
     profileimage:'',
     name:''
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchtheme()
  }
  fetchtheme=()=>{
    let theme;
  firebase
  .database().ref("/users/"+firebase.auth().currentUser.uid).on("value",function(snapshot){
    theme = snapshot.val().current_theme;
  })
  this.setState({
    light_theme: theme === "light"?true:false
  })
  }
  toggleSwitch (){
    const previous_state = this.state.isenabled,
    const theme = !this.state.isenabled? "dark": "light";
    var updates = {};
    updates["users/"+firebase.auth().currentUser.uid+"/current_theme"]= theme;
    firebase.database().ref().update(updates);
    this.setState({isenabled:!previous_state,light_theme:previous_state})
  }
  async fetchUser(){
    let theme , name , Image;
    await firebase.database().ref("/users/"+firebase.auth().currentUser.uid).on("value",function(snapshot){
      theme = snapshot.val().current_theme;
      name = `${snapshot.val().first_name} ${snapshot.val().last_name}`;
      image = snapshot.val().profile_picture;
     })
     this.setState({
       light_theme:theme === "light"?true:false,
       isenabled:theme === "light"?true:false,
       name:name,
       profileimage:image
     })

  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
    return (
      <View style={this.state.light_theme?styles.containerLight:styles.container}>
      <SafeAreaView style={styles.droidSafeArea} />
      <View style={styles.appTitle}>
        <View style={styles.appIcon}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.iconImage}
          ></Image>
        </View>
        <View style={styles.appTitleTextContainer}>
          <Text style={this.state.light_theme?styles.appTitleTextLight:styles.appTitleText}>Storytelling App</Text>

        </View>
        <View style = {styles.screenContainer}>
        <View style = {styles.profileImageContainer}>
      <Image style = {styles.profileImage} source = {{uri:this.state.profileimage}}></Image>
      <Text style = {this.state.light_theme?styles.nameTextLight:styles.nameText}>{this.state.name}</Text>
      </View>
      <View style = {styles.themeContainer}>
      <Text style = {this.state.light_theme?styles.themeTextLight:styles.themeText}> dark theme</Text>
      <Switch
      style = {{transform:[{scaleX:1.3},{scaleY:1.3}]}}
      trackColor = {{false:'#767577',true: 'white'}}
      thumbColor = {this.state.isenabled?"#ee8249":"#f4f3f4"}
      ios_backgroundColor = '#3e3e3e'
      onValueChange = {()=>this.toggleSwitch()}
      value = {this.state.isenabled}
      
      ></Switch>
        </View>

        </View>
      </View>
      <View style={{ flex: 0.08 }} />
    </View>
    );
  }
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row"
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  screenContainer: {
    flex: 0.85
  },
  profileImageContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  profileImage: {
    width: RFValue(140),
    height: RFValue(140),
    borderRadius: RFValue(70)
  },
  nameText: {
    color: "white",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans",
    marginTop: RFValue(10)
  },
  nameTextLight: {
    color: "black",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans",
    marginTop: RFValue(10)
  },
  themeTextLight: {
    color: "black",
    fontSize: RFValue(30),
    fontFamily: "Bubblegum-Sans",
    marginRight: RFValue(15)
  },
  themeContainer: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: RFValue(20)
  },
  themeText: {
    color: "white",
    fontSize: RFValue(30),
    fontFamily: "Bubblegum-Sans",
    marginRight: RFValue(15)
  },

  containerLight: {
    flex: 1,
    backgroundColor: "#eaeaea"
  },
  appTitleTextLight: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
});
