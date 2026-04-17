export function useFile() {
    const readAsString = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const readAsBinary = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });

    return {
        readAsString,
        readAsBinary
    };
}
