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

export default (feeds, activeId) => {
  // console.log(feeds);
  const newsListHTML = feeds.map(({ items, id }) => {
    // console.log(items);
    return `
      <div id="${id}" class="container tab-pane"><br>
        <ul class="list-group-flush">
          ${items.map(({ title, link, description }) => {
    const modal = renderModal(title, description);
    return `<li class="list-group-item py-2">${modal}<a href="${link}" disabled>${title}</a></li>`;
  }).join('')}
        </ul>
      </div>`;
  }).join('');
  const newsList = document.querySelector('.tab-content');
  newsList.innerHTML = newsListHTML;
  const activeFeed = document.getElementById(activeId);
  activeFeed.classList.add('active');
  const modalButtons = document.querySelectorAll('[data-target="#myModal"]');
  modalButtons.forEach((btn) => {
    btn.addEventListener('click', modalBtnHandler);
  });
};
