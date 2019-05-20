export default class StringUtils {
    static cleanAndLower(string: string) {
        if(!string) return "";

        return string.toLowerCase().trim();
    }

    static clean(string: string) {
        return string.trim();
    }
}