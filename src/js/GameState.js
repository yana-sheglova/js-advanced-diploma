export default class GameState {
  constructor() {
    this.isPlayerTurn = true;
  }
  static from(object) {
    // TODO: create object
    const state = new GameState();
    state.isPlayerTurn = object.isPlayerTurn;
    return state;
  }
}
