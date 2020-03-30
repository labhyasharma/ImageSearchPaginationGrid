/**
 * ImageSearchComponent for seaching Image
 * and displaying it in grid format.
 *
 * @author Labhya Sharma
 */

import React from 'react';
import {
  SafeAreaView,
  TextInput,
  View,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import IMAGE_DATA from '../utils/ImageUtils';
import color from '../utils/ColorUtils';
import AppConstants from '../utils/AppConstants';
import AppService from '../NetworkService/AppService';
import RNPickerSelect from 'react-native-picker-select';

const DEMO_OPTIONS_1 = ['Grid 2','Grid 3','Grid 4'];


export default class ImageSearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchVal: '',
      imageList: [],
      showLoader: false,
      intialGridValue: 'Grid 2',
      page: 1,
      searchTextValue: '',
    };
  }

  async componentDidMount() {
    await this.setState({page: 1})
    this.searchImage('',true);
    this.onChangeTextDelayed = this.debounce(this.onChangeText, 1000);
  }

  /**
   * Fuction to handle the debounce so that
   * Api hits after few seconds.
   *
   * @argument func func
   * @argument wait wait
   * @argument immediate immediate
   */

  debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  onChangeText = searchText => {
    this.searchImage(searchText,true);
    this.setState({
      searchVal: searchText,
    });
  };

  /**
   * Fuction to hit api after text change
   *
   */
  searchImage = async (searchText, newSearch) => {
    await this.setState({showLoader: true});
    await this.setState({searchTextValue: searchText })

    console.log('PAGE::: '+ this.state.page)
    AppService.searchImage(searchText,this.state.page)
      .then(response => {
        if (newSearch) {
          this.setState({
            imageList: response.data.hits,
            showLoader: false,
          });
        } else {
          this.setState({
            imageList: [...this.state.imageList, ...response.data.hits],
            showLoader: false,
          });
        }
      })
      .catch(error => {
        console.log('error message', error);
      });
  };

  handleLoadMore = () => {
    this.setState({
      page: this.state.page + 1
    }, () => {
      this.searchImage(this.state.searchTextValue,false);
    });
  };

  render() {
    const loader = (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" color={color.white} />
      </View>
    );

    return (
      <SafeAreaView>
        <View style={{flexDirection: 'column', height: '100%'}}>
          <View style={styles.topContainerSearch}>
            <View style={styles.inputContainer}>
              <Image style={{marginStart: 16}} source={IMAGE_DATA.searchIcon} />

              <TextInput
                style={[styles.inputs]}
                underlineColorAndroid="transparent"
                placeholder={AppConstants.commonConstants.search}
                onChangeText={this.onChangeTextDelayed}
              />
            </View>
          </View>

          <View style={{marginStart:16, marginTop:8}}>
          <RNPickerSelect
                value={this.state.intialGridValue}
                onValueChange={(childText) => {
                  console.log(childText)
                  this.setState({ intialGridValue: childText })
                }
                }
                items={[
                  { label: 'Grid 2', value: 'Grid 2' },
                  { label: 'Grid 3', value: 'Grid 3' },
                  { label: 'Grid 4', value: 'Grid 4' },
              ]}
              />
          </View>
          

          <FlatList
            style={styles.listContainer}
            extraData={this.state}
            data={this.state.imageList}
            renderItem={({item, index}) => {
              return (
                <View
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    flex: 1,
                    height: 100,
                    marginTop: 16,
                    marginStart: 16,
                    marginEnd: 16,
                  }}>
                  <Image
                    source={{uri: item.previewURL}}
                    style={styles.imageStyle}
                  />
                </View>
              );
            }}
            numColumns={this.state.intialGridValue === 'Grid 2' ? 2 : this.state.intialGridValue === 'Grid 3' ? 3 : 4}
            keyExtractor={item => {
              return item.id;
            }}
            key={this.state.intialGridValue}
            onEndReached={this.handleLoadMore}
            onEndThreshold={0}
          />
        </View>

        {this.state.showLoader ? loader : null}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  inputs: {
    height: 40,
    marginLeft: 8,
    borderBottomColor: color.white,
    flex: 1,
    color: color.textColor,
    fontSize: 14,
  },
  topContainerSearch: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: color.screenBackground,
    alignItems: 'center',
  },
  inputContainer: {
    borderBottomColor: color.grey,
    backgroundColor: color.searchBackColor,
    borderRadius: 10,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
    marginLeft: 16,
  },
  listContainer: {
    marginTop: 16,
    paddingTop: 8,
    flexGrow: 1,
  },
  imageStyle: {
    flex: 1,
  },
  loaderStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
