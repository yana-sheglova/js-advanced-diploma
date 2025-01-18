export default class GameState {
  constructor() {
    this.isPlayerTurn = true;
    this.isGameOver = false;
    this.level = 1;
    this.selected = null;
    this.score = 0;
    this.selectedCharacter = [];
    this.allPositions = [];
    this.statistics = [];
  }

  static from(object) {
    // TODO: create object
    if (typeof object === 'object') return object;
    return null;
  }
}
