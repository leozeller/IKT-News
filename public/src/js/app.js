const apiKey = '2d8838764ec143a29ef8f1c3fd5ee47e';
const main = document.querySelector('main');
const sourceSelector = document.querySelector('#sourceSelector');
const defaultSource = 'der-tagesspiegel';

let enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
            console.log('service worker registriert')
        })
        .catch(
            err => { console.log(err); }
        );
}

function displayConfirmNotification() {
    if('serviceWorker' in navigator) {
        let options = { body: 'You successfully subscribed to our Notification service!'};

        navigator.serviceWorker.ready
            .then( sw => {
                sw.showNotification('Successfully subscribed (from SW)!', options);
            });
    }
}

function askForNotificationPermission() {
    Notification.requestPermission( result => {
        console.log('User choice', result);
        if(result !== 'granted') {
            console.log('No notification permission granted');
        } else {
            displayConfirmNotification();
        }
    });
}

if('Notification' in window) {
    for(let button of enableNotificationsButtons) {
        button.style.display = 'inline-block';
        button.addEventListener('click', askForNotificationPermission);
    }
}


window.addEventListener('load', async e => {
    updateNews();
    await updateSources();
    sourceSelector.value = defaultSource;

    sourceSelector.addEventListener('change', e => {
        updateNews(e.target.value);
    })
});

async function updateSources() {
    const response = await fetch(`https://newsapi.org/v2/top-headlines/sources?apiKey=${apiKey}`)
    const json = await response.json();

    sourceSelector.innerHTML =
        json.sources
        .map(src => `<option value="${src.id}">${src.name}</option>`)
            .join('\n');
}
async function updateNews(sources = defaultSource) {
    const response = await fetch(`https://newsapi.org/v2/everything?sources=${sources}&apiKey=${apiKey}`);
    const json = await response.json();

    main.innerHTML = json.articles.map(createArticle).join('\n')

}

function createArticle(article) {
    return `
    <div class="article">
      <a href="${article.url}">
        <h2>${article.title}</h2>
        <img src="${article.urlToImage}" alt="${article.title}">
        <p>${article.description}</p>
      </a>
    </div>
  `;
}
