import { calcTileType } from "../utils";

describe('calcTileType', () => {
    test('should return "top-left" for index 0', () => {
        expect(calcTileType(0, 8)).toBe('top-left');
    });

    test('should return "top-right" for index 7', () => {
        expect(calcTileType(7, 8)).toBe('top-right');
    });

    test('should return "top" for index 5', () => {
        expect(calcTileType(5, 8)).toBe('top');
    });

    test('should return "bottom-left" for index 56', () => {
        expect(calcTileType(56, 8)).toBe('bottom-left');
    });

    test('should return "bottom-right" for index 63', () => {
        expect(calcTileType(63, 8)).toBe('bottom-right');
    });

    test('should return "bottom" for index 60', () => {
        expect(calcTileType(60, 8)).toBe('bottom');
    });

    test('should return "left" for index 16', () => {
        expect(calcTileType(16, 8)).toBe('left');
    });

    test('should return "right" for index 15', () => {
        expect(calcTileType(15, 8)).toBe('right');
    });

    test('should return "center" for index 27', () => {
        expect(calcTileType(27, 8)).toBe('center');
    });
});
