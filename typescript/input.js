let iteration = 1;
const API_OPTIONS = {
    baseUrl: 'http://localhost:3000'
};
class Api {
    constructor(optionsObject) {
        this._baseUrl = optionsObject.baseUrl;
        this._headers = { 'Content-Type': 'application/json' };
    }
    deleteObj(objID) {
        return fetch(`${this._baseUrl}/end-massive/${objID}`, {
            method: 'DELETE',
        })
            .then(this._checkValidResponce);
    }
    putPackage(objPackage) {
        return fetch(`${this._baseUrl}/end-massive`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(objPackage)
        });
    }
    getTenObj(page) {
        return fetch(`${this._baseUrl}/start-massive?_page=${page}&_limit=10`, {}).then(this._checkValidResponce);
    }
    _checkValidResponce(res) {
        if (res.ok) {
            return res.json();
        }
        else {
            console.error(Promise.reject);
            return Promise.reject;
        }
    }
}
// const API = new Api(API_OPTIONS)
const CASE_TEMPLATE_CONTENT = document.querySelector('.list-item-template').content.querySelector('.cases-list__item');
const CASES_LIST = document.querySelector('.cases-list');
