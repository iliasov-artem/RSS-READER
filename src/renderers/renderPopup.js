import $ from 'jquery';

export default (message) => {
  const popup = document.getElementById('myPopup');
  popup.querySelector('.modal-body').innerHTML = message;
  $('#myPopup').modal('toggle');
};
