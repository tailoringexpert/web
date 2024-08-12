export function useEnv() {
    const get = (name) => {
        return window?.configs?.[name] || process.env[name];
    };

    return {
        get,
    };
}
