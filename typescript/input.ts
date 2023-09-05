let iteration:number = 1
type typeApiOptions = {
    baseUrl: string
}

type typeCaseInputObj = {
    bulletinSubject : string
    bulletinText: string
    id: number
    ownerId: number
    ownerLogin: string
    publishDate: 1676468402887
    publishDateString: string
}

type typeArrayFromResponse = typeCaseInputObj[]

const API_OPTIONS:typeApiOptions = {
    baseUrl: 'http://localhost:3000'
}

type typePromiseAnyOrT = Promise<any> | Promise<T>


class Api {

    _baseUrl: string;
    _headers: {'Content-Type': string}
    constructor(optionsObject:typeApiOptions) {
        this._baseUrl = optionsObject.baseUrl;
        this._headers = {'Content-Type': 'application/json'}
    }


    deleteObj(objID:number):Promise<any> {
        return fetch(`${this._baseUrl}/end-massive/${objID}`, {
            method: 'DELETE',
        })
            .then(this._checkValidResponce)
    }

    putPackage(objPackage) {
        return fetch(`${this._baseUrl}/end-massive`,{
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(objPackage)
        })
    }

    getTenObj(page) {
        return fetch(`${this._baseUrl}/start-massive?_page=${page}&_limit=10`, {}).then(this._checkValidResponce)
    }

    _checkValidResponce(res:Response):Promise<typeArrayFromResponse> | <T = never>(reason?: any) => Promise<T> {
        if (res.ok) {
            return res.json()
        } else {
            console.error(Promise.reject)
            return Promise.reject;
        }
    }
}



// const API = new Api(API_OPTIONS)
const CASE_TEMPLATE_CONTENT: HTMLElement = document.querySelector('.list-item-template').content.querySelector('.cases-list__item')
const CASES_LIST:HTMLUListElement = document.querySelector('.cases-list')