import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    FlatList,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { storyListApi } from './api'
import {Container, Header, Left, Body, Right, Title,Toast} from 'native-base'
class HomeScreen extends Component {
    state = {
        search:null,
        gettingStories: false,
        storyData: null,
        hasMore: false,
        gettingMore: false
    }
    storyDataHolder=[]
    componentDidMount() {
        this.getStories()
    }
    setRequestTimer = () => {
        this.requestTimer = setInterval(() => {
            // console.log('timer----------',)
            this.handleLoadMore()
        }, 10000)
    }

    showToast = (text) => {
        Toast.show({
            text,
            duration: 3000
        })
    }
    getStories = () => {
        this.setState({ gettingStories: true })
        let page = 1
        storyListApi(page)
            .then((response) => {
                console.log("GET STORY RESPONSE", page)
                if (response && response.data) {
                    this.setState({
                        storyData: response.data,
                        gettingStories: false,
                        hasMore: page < response.data.nbPages ? true : false
                    })
                    this.storyDataHolder=response.data.hits
                    this.setRequestTimer()
                } else {
                    this.setState({ gettingStories: false })
                    this.showToast('Oops! something went wrong.')
                }
            })
            .catch(error => {
                this.setState({ gettingStories: false })
                this.showToast(error.message);
            })
    }

    handleLoadMore = () => {
        const { storyData, gettingMore } = this.state
        if (storyData && storyData.page + 1 <= storyData.nbPages && gettingMore === false) {
            this.setState({
                gettingMore: true
            }, () => {
                let page = storyData.page + 1
                storyListApi(page).then(response => {
                    console.log('LOAD MORE RESPONSE', page)
                    if (response && response.data) {
                        this.setState((prevState) => {
                            const newList = [...prevState.storyData.hits, ...response.data.hits]
                            this.storyDataHolder=newList
                            return {
                                storyData: {
                                    ...response.data,
                                    hits:newList
                                },
                                
                                hasMore: page < response.data.nbPages ? true : false,
                                gettingMore: false
                            }
                           
                        }, () => {
                            //logic to clear interval after total page are fetched
                            if (this.state.hasMore === false) {
                                clearInterval(this.requestTimer)
                            }
                        })
                    } else {
                        this.setState({ gettingMore: false })
                        this.showToast('Oops! something went wrong.')
                    }
                })
                    .catch(error => {
                        this.setState({ gettingMore: false })
                        this.showToast(error.message)
                    })
            })
        }
    }

    navigateToDetail = (item) => () => {
        this.props.navigation.navigate("Detail", { item })
    }
    renderCustomItem = ({ item, index }) => {
        return (
            <View>
                <TouchableOpacity onPress={this.navigateToDetail(item)}
                    style={styles.listView}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text>{item.author}</Text>
                    <Text> URL :    {item.url}</Text>
                    <Text> Created At :  {item.created_at}</Text>


                </TouchableOpacity>
                <View style={styles.line}></View>
            </View>
        )
    }
    
    searchFilterFunction = (text) => {
       
        this.setState({
          search: text,
        },()=>{ //passing the inserted text in textinput
         console.log("story holder----------",this.storyDataHolder)

            const newData = this.storyDataHolder.filter((item) => {
              //applying filter for the inserted text in search bar
             // console.log("item----------",item)

              const urlData = item.url? item.url.toUpperCase():'' 
              const authorData =  item.author?item.author.toUpperCase() :''
              const titleData =item.title?  item.title.toUpperCase() :''
              const textData = text.toUpperCase();
              return urlData.indexOf(textData) > -1 || authorData.indexOf(textData) > -1 || titleData.indexOf(textData) > -1;

           });
           console.log("newData----------",newData)
            this.setState(prevState => ({
                ...prevState,
                storyData: {
                    ...prevState.storyData,
                    hits: newData
                }
            }))


        });
     
      }

    keyExtractor = (item, index) => item.created_at;

    render() {
        const { storyData, gettingStories, gettingMore,search } = this.state
        return (
            <View style={{ flex: 1, width: '100%' }}>
                
                <Header>
          <Left/>
          <Body>
            <Title>Home</Title>
          </Body>
          <Right />
        </Header>
                {storyData === null || gettingStories ? <Text style={styles.loadingText}>Loading ......</Text> :
                    <View style={{flex:1}}>
                        <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#000"
              value={search}
              onChangeText={this.searchFilterFunction}
            />
                          <FlatList
                        data={storyData.hits}
                        renderItem={this.renderCustomItem}
                        keyExtractor={this.keyExtractor}
                        onEndReachedThreshold={1}
                        onEndReached={this.handleLoadMore}
                    />
                        {gettingMore && <Text style={styles.MoreloadingText}>Getting More data ......</Text>}
                        </View>
                }

            </View>
        );
    }
}

export default HomeScreen;
const styles = StyleSheet.create({
    line: {
        height: 1,
        backgroundColor: "#000",

        width: '100%'
    },
    title: {
        fontWeight: "bold",
        textAlign: "left"
    },
    loadingText: {
        textAlign: "center",
        marginTop: '40%'
    },
    MoreloadingText:{
        textAlign: "center",
        margin: '10%'
    },
    listView: {
        justifyContent: 'center', alignItems: 'center',
        padding: '5%'
    },
    searchInput: {
        width: '90%',
        height: 40,
        fontSize: 15,
        borderWidth:1,
        borderColor:"blue",
        margin:'5%',
        borderRadius:5
      },
})




