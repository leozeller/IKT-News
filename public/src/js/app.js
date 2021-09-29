const apiKey = '2d8838764ec143a29ef8f1c3fd5ee47e';
const main = document.querySelector('main');
const sourceSelector = document.querySelector('#sourceSelector');
const defaultSource = 'der-tagesspiegel';

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
