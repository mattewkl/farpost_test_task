class Api {
    constructor(optionsObject) {
        this._baseUrl = optionsObject.baseUrl;
        this._headers = {'Content-Type': 'application/json'}
    }

    _checkValidResponce(res) {
        if (res.ok) {
            return res.json()
        } else {
            console.error(Promise.reject)
            return Promise.reject;
        }
    }

    deleteObj(objID) {
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

}

let iteration = 1
const API_OPTIONS = {
    baseUrl: 'http://localhost:3000'
}
const API = new Api(API_OPTIONS)
const CASE_TEMPLATE_CONTENT = document.querySelector('.list-item-template').content.querySelector('.cases-list__item')
const CASES_LIST = document.querySelector('.cases-list')

function createCaseElement(dataObj) {
    const CASE_COPY = CASE_TEMPLATE_CONTENT.cloneNode(true)
    const CASE_ID_ELEMENT = CASE_COPY.querySelector('.cases-list__item-id')
    const CASE_TIME_ELEMENT = CASE_COPY.querySelector('.cases-list__timestamp')
    const CASE_USER_ID_ELEMENT = CASE_COPY.querySelector('.cases-list__user-id')
    const CASE_TITLE_ELEMENT = CASE_COPY.querySelector('.cases-list__main-info-title')
    const CASE_TEXT_ELEMENT = CASE_COPY.querySelector('.cases-list__main-info-text')
    const CASE_FIGURE_ELEMENT = CASE_COPY.querySelector('.cases-list__item-figure')
    for (imageDeclaration of dataObj.bulletinImages) {
            const IMG = document.createElement('img')
            IMG.src = imageDeclaration.src
            IMG.alt = imageDeclaration.alt
            IMG.classList.add('cases-list__item-img')
            CASE_FIGURE_ELEMENT.appendChild(IMG)
        }
    CASE_COPY.id = dataObj.id
    CASE_TIME_ELEMENT.id = dataObj.publishDate
    CASE_ID_ELEMENT.textContent = dataObj.id
    CASE_TIME_ELEMENT.textContent = `  — ${dataObj.publishDateString}`
    CASE_USER_ID_ELEMENT.textContent = dataObj.ownerId
    CASE_TITLE_ELEMENT.textContent = dataObj.bulletinSubject
    CASE_TEXT_ELEMENT.textContent = dataObj.bulletinText
    return CASE_COPY
}

function manipulateTextareaLabel(LABEL_ELEMENT,invalid = false, text ) {
    LABEL_ELEMENT.classList.remove('cases-list__textarea-label_hidden')
    if (invalid) {
        LABEL_ELEMENT.classList.add('cases-list__textarea-label_invalid')
    }
    else {
        LABEL_ELEMENT.classList.remove('cases-list__textarea-label_invalid')
    }
    LABEL_ELEMENT.textContent = text
}

function deleteAllFromList() {
    const CASES_ELEMENTS_LIST = CASES_LIST.querySelectorAll('.created-by-js-node')
    for (CASE of CASES_ELEMENTS_LIST) {
        CASE.remove()
    }
}

function focusOnFirst() {
    const CASES_ELEMENTS_LIST = CASES_LIST.querySelectorAll('.created-by-js-node')
    const DISCLAMER = document.querySelector('.standart-main__disclaimer')
    if (CASES_ELEMENTS_LIST[0]) {
        CASES_ELEMENTS_LIST[0].focus()
        DISCLAMER.classList.add('standart-main__disclaimer_hidden')
    }
    else {
        DISCLAMER.classList.remove('standart-main__disclaimer_hidden')
        DISCLAMER.textContent = "Вы все сделали. Круто!"
    }

}

function getObjFromCase(CASE) {
    const processedObj = {}
    const CASE_ARTICLE = CASE.querySelector('.cases-list__item')
    const CASE_ID_ELEMENT = CASE.querySelector('.cases-list__item-id')
    const CASE_TIME_ELEMENT = CASE.querySelector('.cases-list__timestamp')
    const CASE_USER_ID_ELEMENT = CASE.querySelector('.cases-list__user-id')
    const CASE_TITLE_ELEMENT = CASE.querySelector('.cases-list__main-info-title')
    const CASE_TEXT_ELEMENT = CASE.querySelector('.cases-list__main-info-text')
    const CASE_TEXTAREA = CASE.querySelector('.standart-textarea')
    const CASE_TEXTAREA_LABEL = CASE.querySelector('.cases-list__textarea-label')
    const CASE_IMG_ARRAY = CASE.querySelector('.cases-list__item-figure').querySelectorAll('.cases-list__item-img')
    let srcArray = []
    for (imgElement of CASE_IMG_ARRAY) {
        srcArray.push({
            src: imgElement.src,
            alt: imgElement.alt
        })
    }
    processedObj.id = parseInt(CASE_ID_ELEMENT.textContent)
    processedObj.publishDate = CASE_TIME_ELEMENT.id
    processedObj.publishDateString = CASE_TIME_ELEMENT.textContent.substring(4)
    processedObj.ownerId = parseInt(CASE_USER_ID_ELEMENT.textContent)
    processedObj.ownerLogin = `TestOwnerWithID_${processedObj.ownerId}`
    processedObj.bulletinSubject = CASE_TITLE_ELEMENT.textContent
    processedObj.bulletinText = CASE_TEXT_ELEMENT.textContent
    processedObj.bulletinImages = srcArray
    if (CASE_ARTICLE.ariaLabel) {
        processedObj.status = CASE_ARTICLE.ariaLabel
    }
    else {
        CASE_TEXTAREA_LABEL.classList.remove('case-item__textarea-label_hidden')
        manipulateTextareaLabel(CASE_TEXTAREA_LABEL,true, 'Необходимо выбрать действие с помощью горячих клавиш')
        CASE.focus()
        return null }
    if (processedObj.status === 'denied' && CASE_TEXTAREA.value === "") {
        manipulateTextareaLabel(CASE_TEXTAREA_LABEL,true,'При отклонении объявления необходимо указать причину')
        CASE_TEXTAREA.focus()
        return
    }
    if (processedObj.status === 'denied' ) {
        manipulateTextareaLabel(CASE_TEXTAREA_LABEL,false,'При отклонении объявления необходимо указать причину')
        processedObj.comment = CASE_TEXTAREA.value
    }
    if (processedObj.status === 'escalated' && CASE_TEXTAREA.value) {
        processedObj.comment = CASE_TEXTAREA.value
    }
    return(processedObj)

}

function createEndPackage() {
    const CASES_ELEMENTS_LIST = CASES_LIST.querySelectorAll('.created-by-js-node')
    let objPackage = []
    for (CASE of CASES_ELEMENTS_LIST) {
        const CASE_PROCESSED_OBJ = getObjFromCase(CASE)
            objPackage.push(CASE_PROCESSED_OBJ)
    }
    if (objPackage.includes(null)) {
        return null
    }
    return objPackage

}

function addCaseToList(CASE, tabindex) {
    const LI_COPY = CASES_LIST.querySelector('.cases-list__li-selector').cloneNode(false)
    LI_COPY.classList.remove('cases-list__li-selector')
    LI_COPY.classList.add('created-by-js-node')
    CASES_LIST.appendChild(LI_COPY)
    LI_COPY.appendChild(CASE)
    LI_COPY.tabIndex = tabindex
    const CASE_TEXTAREA = CASE.querySelector('.standart-textarea')
    const CASE_TEXTAREA_LABEL = CASE.querySelector('.cases-list__textarea-label')
    LI_COPY.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault()
            CASE_TEXTAREA_LABEL.classList.add('cases-list__textarea-label_hidden')
            CASE_TEXTAREA.classList.add('standart-textarea_hidden')
            CASE_TEXTAREA.removeEventListener('focusout', changeLabelColorToDefault)
            CASE.ariaLabel = 'approved'
            CASE.classList.add('cases-list__item_approved')
            if (event.currentTarget.nextSibling) {
                event.currentTarget.nextSibling.focus()
            }
        }
    })

    LI_COPY.addEventListener('keydown', (event) => {
        if (event.code === 'Delete') {
            event.preventDefault()
            CASE.ariaLabel = 'denied'
            CASE.classList.add('cases-list__item_denied')
            CASE_TEXTAREA.addEventListener('focusout', changeLabelColorToDefault)
            manipulateTextareaLabel(CASE_TEXTAREA_LABEL,false,'Укажите причину отказа.')
            CASE_TEXTAREA.classList.remove('standart-textarea_hidden')
            if (!CASE_TEXTAREA.value) {
                CASE_TEXTAREA.focus()
            } else {
                if (event.currentTarget.nextSibling) {
                    event.currentTarget.nextSibling.focus()
                }
            }


        }
    })

    LI_COPY.addEventListener('keydown', (event) => {
        if (event.shiftKey && event.code === 'Enter') {
            event.stopPropagation()
            event.preventDefault()
            CASE.ariaLabel = 'escalated'
            CASE.classList.add('cases-list__item_escalated')
            CASE_TEXTAREA.removeEventListener('focusout', changeLabelColorToDefault)
            manipulateTextareaLabel(CASE_TEXTAREA_LABEL,false, 'Если нужно - оставьте комментарий.')
            CASE_TEXTAREA.classList.remove('standart-textarea_hidden')
            if (!CASE_TEXTAREA.value) {
                CASE_TEXTAREA.focus()
            } else {
                if (event.currentTarget.nextSibling) {
                    event.currentTarget.nextSibling.focus()
                }
            }
        }
    })

    LI_COPY.addEventListener('mousedown', (event) => {
        event.currentTarget.focus()
        event.preventDefault()
    })
    CASE_TEXTAREA.addEventListener('mousedown', (event) => {
        event.stopPropagation()
        event.currentTarget.focus()
        event.preventDefault()
    })
    CASE_TEXTAREA.addEventListener('keydown', (event) => {
        if (event.code === "Space" || event.code === "Delete" || (event.shiftKey && event.code === 'Enter')) {
            event.stopPropagation()
        }

    })

}

function get10ObjFromAPI(page) {
    Promise.all([API.getTenObj(page)])
        .then(res => {
            console.log(res)
            const MASSIVE = res[0]
            let tabindex = 0
            for (obj of MASSIVE) {
                addCaseToList(createCaseElement(obj), tabindex)
                tabindex += 1
            }
        })
        .catch(err => console.error(err))
        .finally(() => {
            document.removeEventListener('keydown', loadPackage);
            focusOnFirst()
        })
}

function loadPackage(event) {
    if (event.key === 'Enter') {
        get10ObjFromAPI(1)
    }
}

function changeLabelColorToDefault(event) {
    if (event.currentTarget.value !== "") {
        const LABEL = event.currentTarget.parentNode.querySelector('.cases-list__textarea-label')
        LABEL.classList.remove('cases-list__textarea-label_invalid')
    }

}

document.addEventListener('keydown', loadPackage)

document.addEventListener('keydown', (event) => {
    if (event.key === 'F7') {
        event.preventDefault()
        if (createEndPackage()) {
            API.putPackage({pack: createEndPackage()})
                .then(res => console.log(res))
                .catch(err => console.error(err))
                .finally(() => {
                iteration++
                deleteAllFromList()
                API.deleteObj(1).then()
                get10ObjFromAPI(iteration)
                }
            )
        }
    }}
)
