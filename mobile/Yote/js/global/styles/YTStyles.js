import React, { PropTypes } from 'react';

import {
  Dimensions
  , Platform
  , StyleSheet
} from 'react-native'; 

// colors
import YTColors from '../../global/styles/YTColors';

const { height, width } = Dimensions.get('window');

const FONT = Platform.OS === 'android' ? 'sans-serif-condensed' : 'AvenirNextCondensed-DemiBold';

const YTStyles = StyleSheet.flatten({
  cell: {
    padding: 5
  }
  , container: {
      backgroundColor: '#fff'
      , flex: 1
  }
  , h: {
      color: YTColors.darkText
      , fontSize: 30
      , fontWeight: '600'
      , fontFamily: FONT
    }
  , h2: {
      color: YTColors.darkText
      , fontSize: 25
      , fontWeight: '600'
      , fontFamily: FONT
  }
  , h3: {
      color: YTColors.darkText
      , fontSize: 20
      , fontWeight: '600'
      , fontFamily: FONT
  }
  , icon: {
      height: 20
      , width: 20
  }
  , input: {
      minHeight: 40
      , fontSize: 15
      , padding: 4
      , flex: 1
      , backgroundColor: '#fff'
    }
  , separator: {
      borderTopWidth: 1
      , borderColor: YTColors.listSeparator
  }
  , shadow: {
      shadowColor: '#000000'
      , shadowOffset: { width: 0, height: 0 }
      , shadowOpacity: 0.2
      , shadowRadius: 4
  }
  , subHeader: {
      color: YTColors.lightText
      , fontSize: 18
      , fontWeight: '600'
      , padding: 5
    }
  , text: {
      color: YTColors.lightText
      , fontSize: 18
      , fontWeight: 'normal'
      , fontFamily: FONT
    }
  , userImg: {
      borderRadius: 50 * .5
      , width: 50
      , height: 50
      , justifyContent: 'center'
  }
})

export default YTStyles; 