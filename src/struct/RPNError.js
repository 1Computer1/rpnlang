class RPNError {
    constructor(type, message, pos) {
        this.type = type;
        this.message = message;
        this.position = `${pos.last_line}:${pos.last_column}`;
    }

    toString() {
        return `${this.type}Error ${this.position}: ${this.message}`;
    }
}

module.exports = RPNError;
