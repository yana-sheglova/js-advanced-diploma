/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  // TODO: write your logic here
  constructor(characters = []) {
    this.characters = characters;
  }

  addCharacter(character) {
    if (this.characters.includes(character)) {
      throw new Error('Такой персонаж уже есть в команде');
    }
    this.characters.push(character)
  }

  addAllCharacters(...characters) {
    characters.forEach((character) => this.addCharacter(character));
  }

  removeCharacters(character) {
    if (!this.characters.includes(character)) {
      throw new Error('Персонаж не найден в команде');
    }
    this.characters = this.characters.filter(item => item !== character);
  }

  getCharacters() {
    return this.characters;
  }
}
