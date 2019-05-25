import StringUtils from "./StringUtils";

describe('String utilities check', () => {
    test('Clean string from extra space and lower case it', () => {
        const originString = StringUtils.cleanAndLower(" /Api/Hello/WORLD ");
        const expectedString = "/api/hello/world";
        expect(originString).toBe(expectedString);
    });

    test('Clean string from extra space', () => {
        const originString = StringUtils.clean(" /api/test ");
        const expectedString = "/api/test";
        expect(originString).toBe(expectedString);  
    });
});