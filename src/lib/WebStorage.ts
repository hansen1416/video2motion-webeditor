export default class WebStorage {

    static storage: Storage = window.sessionStorage;

    constructor() {

    }

    static save(key: string, data: any) {
        if (typeof data === 'object') {
            WebStorage.storage.setItem(key, JSON.stringify(data));
        } else {
            WebStorage.storage.setItem(key, data);
        }
    }

    static read(key: string) {
        const data = WebStorage.storage.getItem(key);

        if (!data) {
            return null;
        }

        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }
}