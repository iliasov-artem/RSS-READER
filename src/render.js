// import renderModal from './renderModal';

export default (data) => {
  const { title, description, items } = data;
  const div = document.querySelector('.feed');
  const rssTitle = `<h2>${title}</h2><p>${description}</p>`;
  const rssFeed = `<ul>${items.map((item) => {
    const itemTitle = item.querySelector('title').textContent;
    const itemLink = item.querySelector('link').textContent;
    return `<li><a href="${itemLink}">${itemTitle}</a></li>`;
  }).join('')
  }</ul>`;
  div.innerHTML = `${rssTitle}${rssFeed}`;
};
