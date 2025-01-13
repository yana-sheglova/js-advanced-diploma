import Bowman from "../characters/Bowman";
import Daemon from "../characters/Daemon";
import Magician from "../characters/Magician";
import Swordsman from "../characters/Swordsman";
import Undead from "../characters/Undead";
import Vampire from "../characters/Vampire";

describe('Bowman class', () => {
    test ('Должен содержать правильные характеристики персонажа 1-го уровня', () => {
        const bowman = new Bowman(1);
        const correct = {
            level: 1,
            attack: 25,
            defence: 25,
            health: 50,
            movement: 2,
            attackRange: 2,
            type: 'bowman'
        };

        expect(bowman).toEqual(correct);
    });
});

describe('Daemon class', () => {
    test ('Должен содержать правильные характеристики персонажа 1-го уровня', () => {
        const daemon = new Daemon(1);
        const correct = {
            level: 1,
            attack: 10,
            defence: 10,
            health: 50,
            movement: 1,
            attackRange: 4,
            type: 'daemon'
        };

        expect(daemon).toEqual(correct);
    });
});

describe('Magician class', () => {
    test ('Должен содержать правильные характеристики персонажа 1-го уровня', () => {
        const magician = new Magician(1);
        const correct = {
            level: 1,
            attack: 10,
            defence: 40,
            health: 50,
            movement: 1,
            attackRange: 4,
            type: 'magician'
        };

        expect(magician).toEqual(correct);
    });
});

describe('Swordsman class', () => {
    test ('Должен содержать правильные характеристики персонажа 1-го уровня', () => {
        const swordsman = new Swordsman(1);
        const correct = {
            level: 1,
            attack: 40,
            defence: 10,
            health: 50,
            movement: 4,
            attackRange: 1,
            type: 'swordsman'
        };

        expect(swordsman).toEqual(correct);
    });
});

describe('Undead class', () => {
    test ('Должен содержать правильные характеристики персонажа 1-го уровня', () => {
        const undead = new Undead(1);
        const correct = {
            level: 1,
            attack: 40,
            defence: 10,
            health: 50,
            movement: 4,
            attackRange: 1,
            type: 'undead'
        };

        expect(undead).toEqual(correct);
    });
});

describe('Vampire class', () => {
    test ('Должен содержать правильные характеристики персонажа 1-го уровня', () => {
        const vampire = new Vampire(1);
        const correct = {
            level: 1,
            attack: 25,
            defence: 25,
            health: 50,
            movement: 2,
            attackRange: 2,
            type: 'vampire'
        };

        expect(vampire).toEqual(correct);
    });
});
