export default (title, description, id) => (`
  <button type="button" class="btn btn-info btn-sm" data-toggle="modal" id="${id}" data-target="#myModal">More
  <h4 class="new-modal-title d-none">${title}</h4>
  <div class="modal-description d-none">${description}</div>
  </button>
`);
