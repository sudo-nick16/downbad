const PARENT_DIV_SELECTOR = "#above-the-fold"
const MAIN_CONTAINER_ID = "downbad-main-container"
const DOWLOAD_BUTTON_ID = "downbad-download-btn"
const LINK_CONTAINER_ID = "downbad-links-container"
const API_URL = "https://downbad.onrender.com/api/"

const styleElement = (element) => {
    Object.assign(element.style, {
        backgroundColor: '#282828',
        color: "#fff",
        border: 'none',
        borderRadius: '25px',
        padding: '10px 12px',
        cursor: 'pointer',
        textDecoration: 'none',
        margin: '5px 0px 5px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }) 
}

const getElements = ({videos, audios}) => {
    return [...videos, ...audios].map(({url, quality}) => {
        const element = document.createElement('a')
        element.innerText = quality
        element.href = url
        element.download = true
        element.target = '_blank'
        styleElement(element)
        return element
    })
}

const mainContainer = document.createElement('div')
mainContainer.id = MAIN_CONTAINER_ID
Object.assign(mainContainer.style, {
    width: '100%',
    display: 'flex',
})

const linksContainer = document.createElement('div')
linksContainer.id = LINK_CONTAINER_ID
Object.assign(linksContainer.style, {
    display: 'flex',
    itemsAlign: 'center',
})

const downloadBtn = document.createElement('button');
downloadBtn.id = DOWLOAD_BUTTON_ID
downloadBtn.innerText = 'Download';
styleElement(downloadBtn)


downloadBtn.onclick = () => {
    const vidUrl = encodeURIComponent(window.location.href)
    linksContainer.innerHTML = ''
    downloadBtn.innerText = 'Fetching...'
    fetch(API_URL + vidUrl).then(res => res.json()).then(data => {
        const elements = getElements(data)
        const parentDiv = linksContainer
        elements.forEach(element => {
            parentDiv.appendChild(element)
        })
    }).catch(err => {
            console.log(err.message)
        }).finally(() => {
            downloadBtn.innerText = 'Download'
        })
}

const elementInterval = setInterval(() => {
    const parent = document.querySelector(PARENT_DIV_SELECTOR)
    if(parent){
        parent.appendChild(mainContainer)
        console.log("[DOWNBAD_EXTENSION] Download button added.")
        mainContainer.appendChild(downloadBtn)
        mainContainer.appendChild(linksContainer)
    }
    const main = document.querySelector(`#${MAIN_CONTAINER_ID}`)
    const button = document.querySelector(`#${DOWLOAD_BUTTON_ID}`)
    const links = document.querySelector(`#${LINK_CONTAINER_ID}`)
    if(main && button && links){
        clearElementInterval()
    }
},2000)

const clearElementInterval = () => {
    clearInterval(elementInterval)
}

let previousUrl = '';
const observer = new MutationObserver(function(_) {
    if (location.href !== previousUrl) {
        previousUrl = location.href;
        const linksContainer = document.querySelector(`#${LINK_CONTAINER_ID}`)
        if(linksContainer){
            linksContainer.innerHTML = ''
        }
    }
});
const config = {subtree: true, childList: true};
observer.observe(document, config);
