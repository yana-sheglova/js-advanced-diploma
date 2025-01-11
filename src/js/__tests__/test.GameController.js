import GameController from "../GameController";
import GamePlay from "../GamePlay";

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
        const result = gameController.infoFormat("string");

        expect(result).toBe('Недопустимое значение');
    });
});