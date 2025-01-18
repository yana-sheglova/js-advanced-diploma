import themes from './themes';
import GamePlay from './GamePlay';
import GameState from './GameState';
import PositionedCharacter from './PositionedCharacter';
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import Team from './Team';
import { generateTeam } from './generators';
import cursors from './cursors';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.boardSize = this.gamePlay.boardSize;
    this.positionedCharacters = [];
    this.playerTypes = [Bowman, Swordsman, Magician];
    this.enemyTypes = [Vampire, Undead, Daemon];
    this.playerTeam = new Team();
    this.enemyTeam = new Team();
    this.gameState = new GameState();
    this.currentChar = null;
    this.currentLevel = this.gameState.level;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService

    this.gamePlay.drawUi(this.getThemeByLevel(this.currentLevel));

    this.playerTeam = generateTeam(
      this.playerTypes,
      this.gameState.level,
      this.gameState.level + 1,
    );
    this.enemyTeam = generateTeam(
      this.enemyTypes,
      this.gameState.level,
      this.gameState.level + 1,
    );
    // console.log(this.playerTeam.characters);
    // console.log(this.enemyTeam.characters);

    const { playerPositions, enemyPositions } = this.getPositions();
    // console.log(playerPositions);
    // console.log(enemyPositions);

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

  // eslint-disable-next-line class-methods-use-this
  getThemeByLevel(level) {
    switch (level) {
      case 1:
        return themes.prairie;
      case 2:
        return themes.desert;
      case 3:
        return themes.arctic;
      case 4:
        return themes.mountain;
      default:
        return themes.prairie;
    }
  }

  onCellClick(index) {
    // TODO: react to click
    if (this.gameState.isGameOver) return;

    const selectedChar = this.getCharacter(index);

    if (selectedChar) {
      if (this.isPlayerCharacter(index)) {
        this.deselectAllCells();
        this.gamePlay.selectCell(index);
        this.currentChar = selectedChar;
        this.gameState.selected = index;
      } else if (this.currentChar && this.canAttack(index)) {
        // если текущ персонаж может атаковат по ячейке с индексом
        this.deselectAllCells();
        this.attack(index);
        this.currentChar = null;
        this.enemyTurn();
      } else {
        GamePlay.showError('Выберите своего персонажа');
      }
    } else if (this.currentChar && this.canMove(index)) {
      // если текущ перс может перемещаться на ячейку с индексом
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
    if (this.gameState.isGameOver) return;

    const selectedChar = this.getCharacter(index);

    if (selectedChar) {
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
      } else if (!this.isPlayerCharacter(index)) {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.gameState.isGameOver) return;

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
    return { playerPositions, enemyPositions };
  }

  charactersPositions(positions, team) {
    team.characters.forEach((character) => {
      if (positions.length > 0) {
        const positionIndex = Math.floor(Math.random() * positions.length);
        const position = positions.splice(positionIndex, 1)[0];

        this.positionedCharacters.push(new PositionedCharacter(character, position));
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  infoFormat(character) {
    if (!character || typeof character !== 'object') {
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
    // characterRange=character.movement / characterRange=character.attackRange
    const availableRange = [];
    const { boardSize } = this;
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;

    for (let i = 1; i <= characterRange; i++) {
      if (row + i < boardSize) { // вниз
        availableRange.push(index + boardSize * i);
      }
      if (row - i >= 0) { // вверх
        availableRange.push(index - boardSize * i);
      }

      if (col - i >= 0) { // влево
        availableRange.push(index - i);
      }
      if (col + i < boardSize) { // вправо
        availableRange.push(index + i);
      }

      if (row + i < boardSize && col - i >= 0) { // вниз-влево
        availableRange.push(index + (boardSize * i - i));
      }
      if (row + i < boardSize && col + i < boardSize) { // вниз-вправо
        availableRange.push(index + (boardSize * i + i));
      }

      if (row - i >= 0 && col - i >= 0) { // вверх-влево
        availableRange.push(index - (boardSize * i + i));
      }
      if (row - i >= 0 && col + i < boardSize) { // вверх-вправо
        availableRange.push(index - (boardSize * i - i));
      }
    }
    return availableRange;
  }

  canMove(index) {
    if (this.currentChar) {
      const movements = this.currentChar.character.movement;
      const rangeArr = this.calcRange(this.currentChar.position, movements);
      return rangeArr.includes(index);
    }
    return false;
  }

  canAttack(index) {
    if (this.currentChar) {
      const attack = this.currentChar.character.attackRange;
      const attackArr = this.calcRange(this.currentChar.position, attack);
      return attackArr.includes(index);
    }
    return false;
  }

  getCharacter(index) {
    return this.positionedCharacters.find(
      (item) => item.position === index,
    );
  }

  isPlayerCharacter(index) {
    if (this.getCharacter(index)) {
      const char = this.getCharacter(index).character;
      return this.playerTypes.some((elem) => char instanceof elem);
    }
    return false;
  }

  async attack(index) {
    console.log('Атака персонажа на ячейку:', index);

    if (this.gameState.isPlayerTurn) {
      const attacker = this.currentChar.character;
      const target = this.getCharacter(index).character;
      const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);

      if (!target) {
        console.error('Целевой персонаж не найден');
        return;
      }

      console.log('Атакующий персонаж:', attacker);

      await this.gamePlay.showDamage(index, damage);
      target.health -= damage;

      if (target.health <= 0) {
        this.positionedCharacters.splice(
          this.positionedCharacters.indexOf(this.getCharacter(index)),
          1,
        );
        this.enemyTeam.removeCharacters(target);
      }

      this.getResult();

      this.gamePlay.redrawPositions(this.positionedCharacters);
      this.gamePlay.isPlayerTurn = false;
      this.enemyTurn();
    }
  }

  async enemyTurn() {
    if (this.gameState.isPlayerTurn) return;

    const playerTeam = this.positionedCharacters.filter((elem) => this.playerTypes.some((type) => elem.character instanceof type));
    const enemyTeam = this.positionedCharacters.filter((elem) => this.enemyTypes.some((type) => elem.character instanceof type));

    if (playerTeam.length === 0 || enemyTeam.length === 0) return;

    let attacker = null;
    let target = null;

    enemyTeam.forEach((enemy) => {
      const rangeAttack = this.calcRange(enemy.position, enemy.character.attackRange);
      playerTeam.forEach((player) => {
        if (rangeAttack.includes(player.position)) {
          attacker = enemy;
          target = player;
        }
      });
    });

    if (target) {
      const damage = Math.max(attacker.character.attack - target.character.defence, attacker.character.attack * 0.1);

      await this.gamePlay.showDamage(target.position, damage);
      target.character.health -= damage;

      if (target.character.health <= 0) {
        this.positionedCharacters.splice(
          this.positionedCharacters.indexOf(target.position),
          1,
        );
        this.playerTeam.removeCharacters(target.character);
      }

      this.gamePlay.redrawPositions(this.positionedCharacters);
      this.gameState.isPlayerTurn = true;
      this.getResult();
    } else {
      attacker = enemyTeam[Math.floor(Math.random() * enemyTeam.length)];
      const attackerRenge = this.calcRange(attacker.position, attacker.character.movement);
      attackerRenge.forEach((elem) => {
        this.positionedCharacters.forEach((e) => {
          if (elem === e.position) {
            attackerRenge.splice(attackerRenge.indexOf(e.position), 1);
          }
        });
      });
      const attackerPosition = attackerRenge[Math.floor(Math.random() * attackerRenge.length)];
      attacker.position = attackerPosition;

      this.gamePlay.redrawPositions(this.positionedCharacters);
      this.gameState.isPlayerTurn = true;
    }
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
    this.gamePlay.drawUi(this.getThemeByLevel(this.currentLevel));

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
      }),
    );
    this.stateService.save(GameState.from(this.gameState));
    GamePlay.showMessage('Игра сохранена');
  }

  onLoadGameClick() {
    const load = this.stateService.load();
    if (!load) {
      GamePlay.showError('Ошибка загрузки');
      return;
    }

    this.gameState.isPlayerTurn = load.isPlayerTurn;
    this.gameState.level = load.level;
    this.gameState.score = load.score;
    this.gameState.statistics = load.statistics;
    this.gameState.selected = load.selected;

    this.playerTeam = new Team();
    this.enemyTeam = new Team();

    this.positionedCharacters = [];

    load.allPositions.forEach((element) => {
      let char;
      switch (element.character.type) {
        case 'bowman':
          char = new Bowman(element.character.level);
          break;
        case 'daemon':
          char = new Daemon(element.character.level);
          break;
        case 'magician':
          char = new Magician(element.character.level);
          break;
        case 'swordsman':
          char = new Swordsman(element.character.level);
          break;
        case 'undead':
          char = new Undead(element.character.level);
          break;
        case 'vampire':
          char = new Vampire(element.character.level);
          break;
        default:
          console.warn('Неизвестный тип персонажа');
          return;
      }

      char.health = element.character.health;

      const positionedChar = new PositionedCharacter(char, element.position);
      this.positionedCharacters.push(positionedChar);

      if (this.playerTypes.some((type) => char instanceof type)) {
        this.playerTeam.addAllCharacters([char]);
      } else if (this.enemyTypes.some((type) => char instanceof type)) {
        this.enemyTeam.addAllCharacters([char]);
      }
    });
    GamePlay.showMessage('Игра загружена');
    this.gamePlay.drawUi(this.getThemeByLevel(this.currentLevel));
    this.gamePlay.redrawPositions(this.positionedCharacters);
  }

  gameOver() {
    this.gameState.isGameOver = true;
    this.gamePlay.setCursor(cursors.auto);
  }

  getScore() {
    this.gameState.score += this.playerTeam
      .getCharacters()
      .reduce((a, b) => a + b.health, 0);
  }

  getResult() {
    // Проигрыш, если команда игрока пуста
    if (this.playerTeam.characters.length === 0) {
      this.gameState.statistics.push(this.gameState.score);
      this.gameOver();
      GamePlay.showMessage(`Вы проиграли! Количество очков: ${this.gameState.score}.`);
      return;
    }

    // Победа, если уровень 4 и команда врага пуста
    if (this.enemyTeam.characters.length === 0 && this.gameState.level === 4) {
      this.getScore();
      this.gameOver();
      this.gameState.statistics.push(this.gameState.score);
      GamePlay.showMessage(`Вы победили! Количество очков: ${this.gameState.score}`);
      return;
    }

    // Переход на след. уровень, если команда врага пуста
    if (this.enemyTeam.characters.length === 0 && this.gameState.level <= 3) {
      this.gameState.isPlayerTurn = true;
      this.getScore();
      GamePlay.showMessage('Переход на следующий уровень');
      this.gameState.level += 1;
      this.nextLevel();
      this.getLevelUp();
    }
  }

  getLevelUp() {
    this.positionedCharacters = [];

    this.gamePlay.drawUi(this.getThemeByLevel(this.currentLevel));

    this.enemyTeam = generateTeam(this.enemyTypes, this.gameState.level, this.gameState.level + 1);
    this.playerTeam = generateTeam(this.playerTypes, this.gameState.level, this.gameState.level + 1);

    const { playerPositions, enemyPositions } = this.getPositions();
    this.charactersPositions(playerPositions, this.playerTeam);
    this.charactersPositions(enemyPositions, this.enemyTeam);

    this.gamePlay.redrawPositions(this.positionedCharacters);
  }
}
