import GameController from '../GameController';
import GamePlay from '../GamePlay';
import PositionedCharacter from '../PositionedCharacter';
import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';

describe('GameController.infoFormat', () => {
  let gameController;
  beforeEach(() => {
    const gamePlay = new GamePlay();
    const stateService = {};
    gameController = new GameController(gamePlay, stateService);
  });

  test('должны выводиться корректные характеристики', () => {
    const character = {
      level: 2,
      attack: 10,
      defence: 40,
      health: 50,
    };
    const expected = '\u{1F396} 2 \u{2694} 10 \u{1F6E1} 40 \u{2764} 50';
    const result = gameController.infoFormat(character);

    expect(result).toBe(expected);
  });

  test('должна возвращаться строка "Недопустимое значение"', () => {
    const result = gameController.infoFormat('string');

    expect(result).toBe('Недопустимое значение');
  });
});

describe('Bowman/s movements and attacks', () => {
  let gameController;
  const character = new Bowman(1);
  beforeEach(() => {
    const gamePlay = new GamePlay();
    const stateService = {};
    gameController = new GameController(gamePlay, stateService);
    gameController.positionedCharacters.push(
      new PositionedCharacter(character, 0),
    );
    [gameController.currentChar] = gameController.positionedCharacters;
  });

  test('movement', () => {
    const canMove = gameController.canMove(3);
    expect(canMove).toBe(false);
  });

  test('attack', () => {
    const canAttack = gameController.canAttack(3);
    expect(canAttack).toBe(false);
  });
});

describe('Daemon/s movements and attacks', () => {
  let gameController;
  const character = new Daemon(1);
  beforeEach(() => {
    const gamePlay = new GamePlay();
    const stateService = {};
    gameController = new GameController(gamePlay, stateService);
    gameController.positionedCharacters.push(
      new PositionedCharacter(character, 0),
    );
    [gameController.currentChar] = gameController.positionedCharacters;
  });

  test('movement', () => {
    const canMove = gameController.canMove(3);
    expect(canMove).toBe(false);
  });

  test('attack', () => {
    const canAttack = gameController.canAttack(6);
    expect(canAttack).toBe(false);
  });
});

describe('Magician/s movements and attacks', () => {
  let gameController;
  const character = new Magician(1);
  beforeEach(() => {
    const gamePlay = new GamePlay();
    const stateService = {};
    gameController = new GameController(gamePlay, stateService);
    gameController.positionedCharacters.push(
      new PositionedCharacter(character, 0),
    );
    [gameController.currentChar] = gameController.positionedCharacters;
  });

  test('movement', () => {
    const canMove = gameController.canMove(3);
    expect(canMove).toBe(false);
  });

  test('attack', () => {
    const canAttack = gameController.canAttack(6);
    expect(canAttack).toBe(false);
  });
});

describe('Swordsman/s movements and attacks', () => {
  let gameController;
  const character = new Swordsman(1);
  beforeEach(() => {
    const gamePlay = new GamePlay();
    const stateService = {};
    gameController = new GameController(gamePlay, stateService);
    gameController.positionedCharacters.push(
      new PositionedCharacter(character, 0),
    );
    [gameController.currentChar] = gameController.positionedCharacters;
  });

  test('movement', () => {
    const canMove = gameController.canMove(3);
    expect(canMove).toBe(true);
  });

  test('attack', () => {
    const canAttack = gameController.canAttack(1);
    expect(canAttack).toBe(true);
  });
});

describe('Undead/s movements and attacks', () => {
  let gameController;
  const character = new Undead(1);
  beforeEach(() => {
    const gamePlay = new GamePlay();
    const stateService = {};
    gameController = new GameController(gamePlay, stateService);
    gameController.positionedCharacters.push(
      new PositionedCharacter(character, 0),
    );
    [gameController.currentChar] = gameController.positionedCharacters;
  });

  test('movement', () => {
    const canMove = gameController.canMove(3);
    expect(canMove).toBe(true);
  });

  test('attack', () => {
    const canAttack = gameController.canAttack(1);
    expect(canAttack).toBe(true);
  });
});

describe('Vampire/s movements and attacks', () => {
  let gameController;
  const character = new Vampire(1);
  beforeEach(() => {
    const gamePlay = new GamePlay();
    const stateService = {};
    gameController = new GameController(gamePlay, stateService);
    gameController.positionedCharacters.push(
      new PositionedCharacter(character, 0),
    );
    [gameController.currentChar] = gameController.positionedCharacters;
  });

  test('movement', () => {
    const canMove = gameController.canMove(2);
    expect(canMove).toBe(true);
  });

  test('attack', () => {
    const canAttack = gameController.canAttack(2);
    expect(canAttack).toBe(true);
  });
});
