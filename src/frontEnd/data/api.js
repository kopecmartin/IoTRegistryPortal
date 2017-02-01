const content = require('json!../data/translations.json');

let api = {
    getContent(language = 'en') {
        console.log(content);
        return content.filter(obj => obj.lang === language)[0];
    }
};

export default api;