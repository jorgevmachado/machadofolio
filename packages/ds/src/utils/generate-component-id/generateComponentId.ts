function uuid(currentDate: Date = new Date())  {
    let date = currentDate.getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const random = (date + Math.random() + 16) % 16 | 0;
        date = Math.floor(date / 16);
        return (c == 'x' ? random : (random & 0x3) | 0x8).toString(16);
    });
}

export default function generateComponentId(text: string): string {
    const uuidGenerate = uuid();
    const random = (Math.random() * 10).toFixed(1);
    return `${text}-${random}-${uuidGenerate}`;
}