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
  const channels = `<ul class="nav nav-pills" role="tablist">
    ${data.map(({ title, description, id }) => {
    return (`
      <li class="nav-item">
        <a class="nav-link" data-toggle="pill" href="#${id}">${title}</a>
      </li>
      `);
  }).join('')}
  </ul>`;
  const feed = `<div class="tab-content">
    ${data.map(({ items, id }) => {
    return (`
        <div id="${id}" class="container tab-pane"><br>
          <ul class="list-group-flush">
            ${items.map((item) => {
        const itemTitle = item.querySelector('title').textContent;
        const itemLink = item.querySelector('link').textContent;
        const itemDesription = item.querySelector('description').textContent;
        const modal = renderModal(itemTitle, itemDesription);
        return `<li class="list-group-item py-2">${modal}<a href="${itemLink}" disabled>${itemTitle}</a></li>`;
      }).join('')}
          </ul>
        </div>
      `);
  }).join('')}
  </div>`;
  const feedList = document.querySelector('.feed-list');
  const feedNews = document.querySelector('.feed');
  feedList.innerHTML = `${channels}`;
  feedNews.innerHTML = `${feed}`;
  const { id } = data[0];
  const activeFeed = document.getElementById(id);
  const activeChannel = document.querySelector(`a[href="#${id}"]`);
  activeFeed.classList.add('active');
  activeChannel.classList.add('active');
  const modalButtons = document.querySelectorAll('[data-target="#myModal"]');
  modalButtons.forEach((btn) => {
    btn.addEventListener('click', modalBtnHandler);
  });
};
