export class Api {
    constructor(optionsObject) {
        this._baseUrl = optionsObject.baseUrl;
    }


    _checkValidResponce(res) {
        if (res.ok) {
            return res.json()
        }
        else {
            console.error(Promise.reject)
            return Promise.reject;
        }
    }



    getData() {
        return fetch(`${this._baseUrl}/start-massive`, {}).then(this._checkValidResponce)
    }



}