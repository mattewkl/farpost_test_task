function generateRandomDate(from, to) {
    return new Date(
        from.getTime() +
        Math.random() * (to.getTime() - from.getTime()),
    );
}


const imagesMassive = [
    "https://static.baza.farpost.ru/v/1510541224458_hugeBlock",
    "https://ru.freepik.com/free-photo/coffee-beans-background_4042594.htm",
    "https://ru.freepik.com/free-photo/hands-filling-a-cup-of-coffee-with-milk_999879.htm",
]

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
    return JSON.stringify({
        id: generateID(),
        publishDate: getTimeStamp(RAND_DATE),
        publishDateString: generateDateString(RAND_DATE),
        ownerId: OWNER_ID,
        ownerLogin: `TestOwnerWithID_${OWNER_ID}`,
        bulletinSubject: `Test Title for TEST_FARPOST_TASK_PURPOUSE from TestOwnerWithID_${OWNER_ID}`,
        bulletinText: `Test Text for TEST_FARPOST_TASK_PURPOUSE from TestOwnerWithID_${OWNER_ID}`,
        bulletinImages: [getRandomImage()]

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