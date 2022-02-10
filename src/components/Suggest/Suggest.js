import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SuggestUserFollow from "./SuggestUserFollow";
import SuggestGroup from "./SuggestGroup/SuggestGroup";

const Suggest = ({type}) => {
  if(type=='user')
  return (
    <SuggestUserFollow/>
  )
  if(type=='group')
  return (
    <SuggestGroup/>
  )
  return null
}

export default Suggest

const styles = StyleSheet.create({
  container:{
    marginTop: 10,
    paddingHorizontal: 20,
  }
})