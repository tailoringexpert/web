export function useFile() {
    const readAsString = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    return {
        readAsString
    };
}
