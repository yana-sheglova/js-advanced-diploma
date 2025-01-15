import themes from "./themes";
import GamePlay from "./GamePlay";
import GameState from "./GameState";
import PositionedCharacter from "./PositionedCharacter";
import Bowman from "./characters/Bowman";
import Daemon from "./characters/Daemon";
import Magician from "./characters/Magician";
import Swordsman from "./characters/Swordsman";
import Undead from "./characters/Undead";
import Vampire from "./characters/Vampire";
import Team from "./Team";
import { generateTeam } from "./generators";
import cursors from "./cursors";

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
    this.gameState = new GameState();
    this.currentChar = null;
    this.themes = Object.keys(themes);
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(this.themes[this.gameState.level - 1]);

    this.playerTeam = generateTeam(this.playerTypes, this.gameState.level, 2); 
    this.enemyTeam = generateTeam(this.enemyTypes, this.gameState.level, 2); 
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

    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
  }

  onCellClick(index) {
    // TODO: react to click
    const selectedChar = this.getCharacter(index);

    if (selectedChar) {
      const isPlayerCharacter = this.isPlayerCharacter(index);  // true, если кликнули на персонажа игрока

      if (isPlayerCharacter) { 
        this.deselectAllCells();
        this.gamePlay.selectCell(index);
        this.currentChar = selectedChar;
        this.gameState.selected = index;
      } else if (this.currentChar && this.canAttack(index)) {  //если текущ персонаж может атаковат по ячейке с индексом
        this.deselectAllCells();
        this.attack(index);
        this.currentChar = null;
        this.enemyTurn();
      } else {
        GamePlay.showError('Выберите своего персонажа');
      }
    } else if (this.currentChar && this.canMove(index)) {  //если текущ перс может перемещаться на ячейку с индексом
      this.deselectAllCells();
      this.currentChar.position = index;
      this.gamePlay.redrawPositions(this.positionedCharacters);
      this.currentChar = null;
      this.gameState.isPlayerTurn = false;
      this.enemyTurn();
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const selectedChar = this.getCharacter(index);

    if(selectedChar) {
      this.gamePlay.setCursor(cursors.pointer);

      const info = this.infoFormat(selectedChar.character);
      this.gamePlay.showCellTooltip(info, index);
    }

    if (this.currentChar) {
      if (!selectedChar && this.canMove(index)) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      } else if (selectedChar && !this.isPlayerCharacter(index)) {
        if (this.canAttack(index)) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.cells.forEach((el) => {
      el.classList.remove('selected-green');
    });
    this.gamePlay.cells.forEach((el) => {
      el.classList.remove('selected-red');
    });
    this.gamePlay.setCursor(cursors.auto);
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

  deselectAllCells() {
    this.positionedCharacters.forEach((elem) => {
      this.gamePlay.deselectCell(elem.position);
    });
    this.gamePlay.cells.forEach((elem) => {
      elem.classList.remove('selected-green', 'selected-red');
    });
  }

  calcRange(index, characterRange) {
    const availableRange = [];
    const boardSize = this.boardSize;
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;

    for (let i = 1; i <= characterRange; i++) {
      if (row + i < boardSize) { //вниз
        availableRange.push(index + boardSize * i);
      }
      if (row - i >= 0) {  //вверх
        availableRange.push(index - boardSize * i);
      }

      if (col - i >= 0) { //влево
        availableRange.push(index - i);
      }
      if (col + i < boardSize) {  //вправо
        availableRange.push(index + i);
      }

      if (row + i < boardSize && col - i >= 0) {  //вниз-влево
        availableRange.push(index + (boardSize * i - i));
      }
      if (row + i < boardSize && col + i < boardSize) {  //вниз-вправо
        availableRange.push(index + (boardSize * i + i));
      }

      if (row - i >= 0 && col - i >= 0) {  //вверх-влево
        availableRange.push(index - (boardSize * i + i));
      }
      if (row - i >= 0 && col + i < boardSize) {  //вверх-вправо
        availableRange.push(index - (boardSize * i - i));
      }
    };
    return availableRange;
  }

  canMove(index) {
    if(this.currentChar) {
      const movements = this.currentChar.character.movement;
      const rangeArr = this.calcRange(this.currentChar.position, movements);
      return rangeArr.includes(index);
    }
    return false;
  }

  canAttack(index) {
    if(this.currentChar) {
      const attack = this.currentChar.character.attackRange;
      const attackArr = this.calcRange(this.currentChar.position, attack);
      return attackArr.includes(index);
    }
    return false;
  }

  getCharacter(index) {
    return this.positionedCharacters.find(
      item => item.position === index
    );
  }

  isPlayerCharacter(index) {
    const itemCharacter = this.getCharacter(index);
    if (itemCharacter) {
      return this.playerTypes.some(
        elem => itemCharacter.character instanceof elem
      );
    }
    return false;
  }

  async attack(index) {
    if (this.currentChar) {
      const attacker = this.currentChar.character;
      const target = this.getCharacter(index).character;
      const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);

      await this.gamePlay.showDamage(index, damage);
      target.health -= damage;

      if (target.health <= 0) {
        this.positionedCharacters.splice(
          this.positionedCharacters.indexOf(this.getCharacter(index)),
          1
        );
        this.enemyTeam.removeCharacters(target);
      }
      
      if (this.enemyTeam.characters.size === 0) {
        if (this.gameState.level === 4) {
          this.gameOver();
          GamePlay.showMessage(`Вы победили! Количество очков: ${this.gameState.score}`);
        } else {
          this.getResult();
          this.getLevelUp();
        }
      }

      this.gamePlay.redrawPositions(this.positionedCharacters);
      this.gamePlay.isPlayerTurn = false;
      await this.enemyTurn();
    }
  }

  async enemyTurn() {
    if (this.gameState.isPlayerTurn) return;

    const targets = this.positionedCharacters.filter(char => 
      this.isPlayerCharacter(char.position) && char.character.health > 0
    );  //доступные цели

    if (targets.length === 0) return;

    const attacker = this.enemyTeam.characters[0]; //для атаки берем 1го из команды врага

    // Находим самого слабого персонажа игрока
    const target = targets.reduce((weakest, char) => {
      return (weakest.character.health < char.character.health) ? weakest : char;
    });
    const targetIndex = target.position;

    if (this.canAttack(targetIndex)) {
      const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
      await this.gamePlay.showDamage(targetIndex, damage);
      target.character.health -= damage;

      if (target.character.health <= 0) {
        this.positionedCharacters.splice(
          this.positionedCharacters.indexOf(this.getCharacter(targetIndex)),
          1
        );
        this.playerTeam.removeCharacters(target);
      }

      if (this.playerTeam.characters.size === 0) {
        this.gameOver();
        GamePlay.showMessage('Вы проиграли');
      }

      this.gamePlay.redrawPositions(this.positionedCharacters);
    } else {
      const availableMoves = this.calcRange(attacker.position, attacker.movement);

      if (availableMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const newPosition = availableMoves[randomIndex];
        attacker.position = newPosition;

        this.gamePlay.redrawPositions(this.positionedCharacters);
      }
    }

    this.gamePlay.isPlayerTurn = true;
    this.getResult();
  }

  nextLevel() {
    for (const character of this.playerTeam.characters) {
      character.levelUp();
    }
  }

  onNewGameClick() {
    this.gameState.isGameOver = false;
    this.gameState.level = 1;
    this.gameState.score = 0;
    this.gamePlay.drawUi(this.themes[this.gameState.level - 1]);
    const { playerPositions, enemyPositions } = this.getPositions();
    this.playerTeam = generateTeam(this.playerTypes, this.gameState.level, 2); 
    this.enemyTeam = generateTeam(this.enemyTypes, this.gameState.level, 2);
    this.positionedCharacters = [];
    this.charactersPositions(playerPositions, this.playerTeam);
    this.charactersPositions(enemyPositions, this.enemyTeam);
    this.gamePlay.redrawPositions(this.positionedCharacters);
  }

  onSaveGameClick() {
    this.gameState.allPositions = this.positionedCharacters.map(
      (positionedChar) => ({
        character: {
          type: positionedChar.character.constructor.name.toLowerCase(),
          level: positionedChar.character.level,
          health: positionedChar.character.health,
        },
        position: positionedChar.position,
      })
    );
    this.stateService.save(GameState.from(this.gameState));
    GamePlay.showMessage('Игра сохранена');
  }

  onLoadGameClick() {}

  gameOver() {
    this.gameState.isGameOver = true;
    this.gamePlay.setCursor(cursors.auto);
  }

  getScore() {
    this.gameState.score += this.playerTeam
      .toArray()
      .reduce((a, b) => a + b.health, 0);
  }

  getResult() {}

  getLevelUp() {}
}
