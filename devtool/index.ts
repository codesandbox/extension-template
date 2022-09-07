document.body.innerHTML = `
    <button id="uppercase-name">Make package.json name uppercase</button>
`

const button = document.querySelector('#uppercase-name')

button?.addEventListener('click', () => {
    console.log("FETCHING!")
    fetch('/uppercase-name')
})