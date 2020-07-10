import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    FlatList,
    TouchableOpacity
} from 'react-native';
import {Header,Toast} from 'native-base'
class DetailScreen extends Component {
  state = {}
  render() {
      const details =this.props.navigation.getParam('item')
      console.log("details----------",JSON.stringify(details))
    return (
     <View>
         <View style={styles.header}>
             <Text style={styles.headerTitle}>Details</Text>
         </View>
     <Text style={styles.title}>{JSON.stringify(details)}</Text>
     </View>
    );
  }
}

export default DetailScreen;
const styles = StyleSheet.create({
     title: {
         margin:'5%',
        fontWeight: "bold",
        textAlign: "center"
    },
    header:{
        height:60,
        width:"100%",
        backgroundColor:"#3b3b87",
        alignItems:"center",
        justifyContent:"center"

    },
    headerTitle: {
      color:"#fff",
       fontWeight: "bold",
    
   },
   
})