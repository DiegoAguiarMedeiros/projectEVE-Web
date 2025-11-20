
export const MAX_BUFFER = 10;

export class SlidingWindow<T> {

    private buffer: T[] = [];

    private startIndex = 0;

    private readonly maxSize: number;

    constructor(maxSize = MAX_BUFFER) {
        this.maxSize = maxSize;
    }

    setBuffer(items: T[], startIndex: number) {
        if (!items) items = [];
        if (items.length <= this.maxSize) {
            this.buffer = [...items];
            this.startIndex = startIndex;
        } else {
            this.buffer = items.slice(-this.maxSize);
            this.startIndex = startIndex + (items.length - this.buffer.length);
        }
    }

    push(item: T) {
        this.buffer.push(item);
        if (this.buffer.length > this.maxSize) {
            this.buffer.shift();
            this.startIndex = +this.startIndex;
        }
    }

    unshift(item: T) {
        this.buffer.unshift(item);
        if (this.buffer.length > this.maxSize) {
            this.buffer.pop();
        } else {
            this.startIndex = Math.max(0, this.startIndex - 1);
        }
    }

    getItems() {
        return this.buffer;
    }

    getRange() {
        return { start: this.startIndex, end: this.startIndex + this.buffer.length - 1 };
    }
}
