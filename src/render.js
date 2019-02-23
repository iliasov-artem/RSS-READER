import renderModal from './renderModal';

const modalBtnHandler = (event) => {
  const currentBtn = event.target;
  const modalBody = document.querySelector('.modal-body');
  const title = currentBtn.querySelector('.new-modal-title').textContent;
  const description = currentBtn.querySelector('.modal-description');
  const modalTitle = document.querySelector('.modal-title');
  modalTitle.innerHTML = title;
  modalBody.innerHTML = description.innerHTML;
};
export default (data) => {
  const { title, description, items } = data;
  const div = document.querySelector('.feed');
  const rssTitle = `<h2>${title}</h2><p>${description}</p><br><br>`;
  const rssFeed = `<ul class="list-group-flush justify-content-left">${items.map((item, index) => {
    const itemTitle = item.querySelector('title').textContent;
    const itemLink = item.querySelector('link').textContent;
    const itemDesription = item.querySelector('description').textContent;
    const modal = renderModal(itemTitle, itemDesription, index);
    return `<li class="list-group-item py-2">${modal}<a href="${itemLink}" disabled>      ${itemTitle}</a></li>`;
  }).join('')
  }</ul>`;
  div.innerHTML = `${rssTitle}${rssFeed}`;
  const modalButtons = document.querySelectorAll('[data-target="#myModal"]');
  modalButtons.forEach((btn) => {
    btn.addEventListener('click', modalBtnHandler);
  });
};
