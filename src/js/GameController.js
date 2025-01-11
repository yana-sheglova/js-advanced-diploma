import themes from "./themes";
import GamePlay from "./GamePlay";
import PositionedCharacter from "./PositionedCharacter";
import Bowman from "./characters/Bowman";
import Daemon from "./characters/Daemon";
import Magician from "./characters/Magician";
import Swordsman from "./characters/Swordsman";
import Undead from "./characters/Undead";
import Vampire from "./characters/Vampire";
import Team from "./Team";
import { generateTeam } from "./generators";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.boardSize = this.gamePlay.boardSize;
    this.positionedCharacters  = [];
    this.playerTypes = [Bowman, Swordsman, Magician];
    this.enemyTypes = [Vampire, Undead, Daemon];
    this.playerTeam = new Team();
    this.enemyTeam = new Team();
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);

    this.playerTeam = generateTeam(this.playerTypes, 4, 2); //ИСПРАВИТЬ
    this.enemyTeam = generateTeam(this.enemyTypes, 4, 2); //ИСПРАВИТЬ
    //console.log(this.playerTeam.characters);
    //console.log(this.enemyTeam.characters);

    const { playerPositions, enemyPositions } = this.getPositions();
    //console.log(playerPositions);
    //console.log(enemyPositions);

    this.charactersPositions(playerPositions, this.playerTeam);
    this.charactersPositions(enemyPositions, this.enemyTeam);

    this.gamePlay.redrawPositions(this.positionedCharacters);

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const character = this.positionedCharacters.find(item => item.position === index);

    if(character) {
      const info = this.infoFormat(character.character);
      this.gamePlay.showCellTooltip(info, index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }

  getPositions() {
    const playerPositions = [];
    const enemyPositions = [];

    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        const position = row * this.boardSize + col;

        if (col === 0 || col === 1) {
          playerPositions.push(position);
        }

        if (col === this.boardSize - 2 || col === this.boardSize - 1) {
          enemyPositions.push(position);
        }
      }
    }
    return {playerPositions, enemyPositions};
  }

  charactersPositions(positions, team) {
    team.characters.forEach((character) => {
      if(positions.length > 0) {
        let positionIndex = Math.floor(Math.random() * positions.length);
        let position = positions.splice(positionIndex, 1)[0];

        this.positionedCharacters.push(new PositionedCharacter(character, position));
      }
    });
  }

  infoFormat(character) {
    if(!character || typeof character !== 'object') {
      return 'Недопустимое значение';
    }
    return `\u{1F396} ${character.level} \u{2694} ${character.attack} \u{1F6E1} ${character.defence} \u{2764} ${character.health}`;
  }
}
