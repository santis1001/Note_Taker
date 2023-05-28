class note {
    constructor(id, title, content) {
        this.ID = id,
        this.Title = title,
        this.Content = content
    }
    setId(id) {
        this.ID = id;
    }
    setTitle(title) {
        this.Title = title;
    }
    setContent(content) {
        this.Content = content;
    }
    getId() {
        return this.ID;
    }
    getTitle() {
        return this.Title;
    }
    getContent() {
        return this.Content;
    }
    toJSON() {
        return {
            ID: this.ID,
            Title: this.Title,
            Content: this.Content
        };
    }
}
module.exports = note;