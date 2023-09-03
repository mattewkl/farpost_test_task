function generateRandomDate(from, to) {
    return new Date(
        from.getTime() +
        Math.random() * (to.getTime() - from.getTime()),
    );
}


const imagesMassive = [
    {src: "https://static.baza.farpost.ru/v/1510541224458_hugeBlock", alt: 'Медитирующий молодой человек - Лого Фарпост'},
    {src: 'https://img.freepik.com/free-photo/coffee-beans-background_23-2148093889.jpg', alt: 'Кофе высыпается из банки'},
    {src: '"https://img.freepik.com/free-photo/hands-filling-a-cup-of-coffee-with-milk_1286-198.jpg"', alt: 'Процесс вливания латте-арта'},
    {src: "https://img.freepik.com/free-vector/letter-k-logo-with-abstract-shapes_1017-8744.jpg", alt: 'Лого с буквой K'},
    {src: "https://img.freepik.com/free-vector/spring-rabbit-with-bow_18591-76711.jpg", alt: 'Милый кролик'}]


function getRandomImage() {
    return imagesMassive[Math.floor(Math.random() * imagesMassive.length)]

}

const RAND_DATE = generateRandomDate(new Date(2023, 0, 31), new Date())
function generateID() {
    return Math.floor(1000000 + Math.random() * 9000000)
}

function getTimeStamp(RAND_DATE) {
    return RAND_DATE.getTime()
}

console.log(RAND_DATE)

function generateDateString(RAND_DATE) {
    const RAND_DATE_HOUR = RAND_DATE.getHours() < 10 ? `0${RAND_DATE.getHours()}` : RAND_DATE.getHours()
    const RAND_DATE_MINUTES =  RAND_DATE.getMinutes() < 10 ? `0${RAND_DATE.getHours()}` : RAND_DATE.getMinutes()
    return `${RAND_DATE_HOUR}:${RAND_DATE_MINUTES}, ${RAND_DATE.toDateString() === new Date().toDateString() ? 'Сегодня' : RAND_DATE.toLocaleDateString()}`
}

console.log(
    generateRandomDate(new Date(2023, 0, 1), new Date()).toLocaleTimeString()
);
console.log(generateID())

function generateDBObject() {
    const RAND_DATE = generateRandomDate(new Date(2023, 0, 31), new Date())
    const OWNER_ID = generateID()
    let imageMassive = []
    if ((Math.floor(Math.random()* 1000) < 500)) {
        imageMassive.push(getRandomImage())
        imageMassive.push(getRandomImage())
    }
    else {
        imageMassive.push(getRandomImage())
    }
    return JSON.stringify({
        id: generateID(),
        publishDate: getTimeStamp(RAND_DATE),
        publishDateString: generateDateString(RAND_DATE),
        ownerId: OWNER_ID,
        ownerLogin: `TestOwnerWithID_${OWNER_ID}`,
        bulletinSubject: `Test Title for TEST_FARPOST_TASK_PURPOUSE from TestOwnerWithID_${OWNER_ID}`,
        bulletinText: `Test Text for TEST_FARPOST_TASK_PURPOUSE from TestOwnerWithID_${OWNER_ID}`,
        bulletinImages: imageMassive
    })
}
function generate100DBOBJECTS() {
    let massive = []
    for (let i = 1; i < 101; i++) {
        massive.unshift(generateDBObject())
    }
    return massive
}

for (let i = 1; i < 101; i++) {
    console.log(`${generateDBObject()}, `)
}