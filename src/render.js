import renderModal from './renderModal';

export default (data) => {
  const { title, description, items } = data;
  const div = document.querySelector('.feed');
  const rssTitle = `<h2>${title}</h2><p>${description}</p><br><br>`;
  const rssFeed = `<ul class="list-group-flush justify-content-left">${items.map((item, index) => {
    const itemTitle = item.querySelector('title').textContent;
    const itemLink = item.querySelector('link').textContent;
    const itemDesription = item.querySelector('description').textContent;
    //  const itemPubDate = item.querySelector('pubDate').textContent;
    //  const btnId = Math.round(new Date(itemPubDate).getTime() / 1000).toString();
    console.log(index);
    const modal = renderModal(itemTitle, itemDesription, index);
    return `<li class="list-group-item py-2">${modal}<a href="${itemLink}">      ${itemTitle}</a></li>`;
  }).join('')
  }</ul>`;
  div.innerHTML = `${rssTitle}${rssFeed}`;
};
