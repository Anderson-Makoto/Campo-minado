import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert} from 'react-native';
import params from './src/params';
import Field from './src/components/field';
import Flag from './src/components/flag';
import MineField from './src/components/mineField';
import {createMinedBoard, openField, hadExplosion, wonGame, showMines, cloneBoard, invertFlag, flagsUsed} from './src/components/functions';
import Header from './src/components/header';
import LevelSelection from './src/screen/levelSelection';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = this.createState()
  }

  minesAmount = () => {
    const cols = params.getColumnsAmount()
    const rows = params.getRowsAmount()
    return Math.ceil(cols * rows * params.difficultLevel)
  }

  createState = () => {
    const cols = params.getColumnsAmount()
    const rows = params.getRowsAmount()

    return {board: createMinedBoard(rows, cols, this.minesAmount()), won: false, lost: false, showLevelSelection: false}
  }

  onOpenField = (row, column) => {
    const board = cloneBoard(this.state.board)
    openField(board, row, column)
    const lost = hadExplosion(board)
    console.log(board[0].length + 'passou do hadexplosion')
    const won = wonGame(board)
    console.log(board[0].length + 'passou do wongame')


    if (lost) {
      showMines(board)
      Alert.alert('Você perdeu')
    }

    if (won) {
      Alert.alert('Você ganhou')
    }

    this.setState({board, lost, won})
  }

  onSelectField = (row, column) => {
    const board = cloneBoard(this.state.board)
    invertFlag(board, row, column)
    const won = wonGame(board)

    if (won) {
      Alert.alert('Você ganhou')
    }
    this.setState({board, won})
  }

  onLevelSelected = level => {
    params.difficultLevel = level
    this.setState(this.createState())
  }

  render(){
    return(
      <View style = {styles.container}>
        <LevelSelection isVisible = {this.state.showLevelSelection} onLevelSelected = {this.onLevelSelected} onCancel = {() => this.setState({showLevelSelection: false})} />
        <Header flagsLeft = {this.minesAmount() - flagsUsed(this.state.board) + 1} onNewGame = {() => this.setState(this.createState())} onFlagPress = {() => this.setState({showLevelSelection: true})}/>
        <View style = {styles.board}>
          <MineField board = {this.state.board} onOpenField = {this.onOpenField} onSelectField = {this.onSelectField}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  board: {
    alignItems: 'center',
    backgroundColor: '#aaa'
  }
})