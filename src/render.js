import renderModal from './renderModal';

export default (data) => {
  const { title, description, items } = data;
  const div = document.querySelector('.feed');
  const rssTitle = `<h2>${title}</h2><p>${description}</p><br><br>`;
  const rssFeed = `<ul class="list-group-flush justify-content-left">${items.map((item) => {
    const itemTitle = item.querySelector('title').textContent;
    const itemLink = item.querySelector('link').textContent;
    const itemDesription = item.querySelector('description').textContent;
    const itemPubDate = item.querySelector('pubDate');
    const btnId = Math.round(new Date(itemPubDate).getTime() / 1000);
    const modal = renderModal(itemDesription, btnId);
    return `<li class="list-group-item py-2">${modal}<a href="${itemLink}">      ${itemTitle}</a></li>`;
  }).join('')
  }</ul>`;
  div.innerHTML = `${rssTitle}${rssFeed}`;
};
