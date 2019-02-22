export default (title, dadescription, id) => (`
  <button type="button" class="btn btn-info btn-sm" data-toggle="modal" id="${id}" data-target="#myModal">More
  <h4 class="new-modal-title d-none">${title}</h4>
  <div class="modal-description d-none">${dadescription}</div>
  </button>
`);
