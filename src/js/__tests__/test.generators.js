import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';
import { characterGenerator, generateTeam } from '../generators';

describe('characterGenerator', () => {
  const playerTypes1 = [Bowman, Swordsman, Magician];
  const playerTypes2 = [Vampire, Undead, Daemon];

  test('должен генерировать персонажей с заданными типами playerTypes1 и уровнями', () => {
    expect(characterGenerator(playerTypes1, 4).next().done).toBeFalsy();
  });

  test('должен генерировать персонажей с заданными типами playerTypes2 и уровнями', () => {
    expect(characterGenerator(playerTypes2, 4).next().done).toBeFalsy();
  });

  test('должен генерировать разных персонажей при каждом вызове', () => {
    const character1 = characterGenerator(playerTypes2, 4).next().value;
    const character2 = characterGenerator(playerTypes2, 4).next().value;

    expect(character1).not.toEqual(character2);
  });
});

describe('generateTeam', () => {
  const playerTypes = [Bowman, Swordsman, Magician];

  test('должен создавать персонажей в нужном количестве', () => {
    const team = generateTeam(playerTypes, 4, 6);

    expect([...team.characters].length).toBe(6);
  });

  test('должен создавать персонажей в нужном диапазоне уровней', () => {
    const team = generateTeam(playerTypes, 4, 6);

    expect(
      [...team.characters].every(
        (character) => character.level >= 1 && character.level < 5,
      ),
    ).toBeTruthy();
  });
});
