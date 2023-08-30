if (navigator.serviceWorker) {
    const reg = await navigator.serviceWorker.register('/sw.js')
}

const response = await fetch('https://test-api.javascript.ru/v1/iliakan/')
const data = await response.json()

const fullName = data.users[0].fullName 
const email = data.users[0].email

const markup = `<p>${fullName}</p><p>${email}</p>`
document.querySelector('.container').insertAdjacentHTML('afterbegin', markup)