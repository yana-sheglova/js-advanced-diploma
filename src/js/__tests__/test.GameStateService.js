import GameStateService from '../GameStateService';

const mocks = {
  data: {},
  setItem(key, value) {
    this.data[key] = value.toString();
  },
  getItem(key) {
    return this.data[key] || null;
  },
};

describe('GameStateService. load', () => {
  let gameStateService;

  beforeEach(() => {
    gameStateService = new GameStateService(mocks);
  });
  afterEach(() => {
    mocks.data = {};
  });

  test('Сохранение должно быть загружено', () => {
    const state = {
      activePlayer: 'player',
      level: 1,
      score: 40,
      maxScore: 40,
      characters: ['bowman', 'swordsman', 'magician'],
      theme: 'prairie',
    };
    mocks.setItem('state', JSON.stringify(state));
    const loaded = gameStateService.load();

    expect(loaded).toEqual(state);
  });

  test('Должен выбросить ошибку', () => {
    mocks.setItem('state', 'invalid_json');

    expect(() => {
      gameStateService.load();
    }).toThrow('Invalid state');
  });
});
