import Character from "../Character";
import Bowman from "../characters/Bowman";
import Daemon from "../characters/Daemon";
import Magician from "../characters/Magician";
import Swordsman from "../characters/Swordsman";
import Undead from "../characters/Undead";
import Vampire from "../characters/Vampire";

describe('Character class', () => {
    test('Должен вбрасывать исключение при создании объекта класса Character', () => {
        expect(() => {
            new Character(1);
        }).toThrow('Базовый класс не может быть использован для создания персонажа');
    });

    test('Не должен выбрасывать исключение при создании объекта унаследованного класса Bowman', () => {
        expect(() => {
            new Bowman(1);
        }).not.toThrow();
    });

    test('Не должен выбрасывать исключение при создании объекта унаследованного класса Daemon', () => {
        expect(() => {
            new Daemon(1);
        }).not.toThrow();
    });

    test('Не должен выбрасывать исключение при создании объекта унаследованного класса Magician', () => {
        expect(() => {
            new Magician(1);
        }).not.toThrow();
    });

    test('Не должен выбрасывать исключение при создании объекта унаследованного класса Swordsman', () => {
        expect(() => {
            new Swordsman(1);
        }).not.toThrow();
    });

    test('Не должен выбрасывать исключение при создании объекта унаследованного класса Undead', () => {
        expect(() => {
            new Undead(1);
        }).not.toThrow();
    });

    test('Не должен выбрасывать исключение при создании объекта унаследованного класса Vampire', () => {
        expect(() => {
            new Vampire(1);
        }).not.toThrow();
    });
})