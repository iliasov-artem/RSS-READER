import validator from 'validator';
import axios from 'axios';
import WatchJS from 'melanke-watchjs';
import renderHTML from './render';
import parseXML from './parser';

const { watch } = WatchJS;
const corsHost = 'https://cors-anywhere.herokuapp.com/';

export default () => {
  const state = {
    inputValue: '',
    inputValid: false,
    processing: false,
    currentRssChannel: '',
    rss: {},
    rssTitle: '',
  };
  const input = document.getElementById('source');
  input.addEventListener('input', (e) => {
    e.preventDefault();
    const { value } = e.target;
    state.inputValue = value;
    state.inputValid = validator.isURL(value) && value !== state.currentRssChannel;
    console.log(`${state.inputValid}${state.inputValue}`);
  });
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.processing = true;
    axios.get(`${corsHost}${input.value}`).then((response) => {
      state.currentRssChannel = input.value;
      state.rss = parseXML(response);
      state.rssTitle = state.rss.title;
      state.inputValue = '';
      state.inputValid = false;
      state.processing = false;
    }).catch((err) => {
      state.processing = false;
      console.log(err);
    });
  });
  watch(state, ['inputValue', 'processing'], () => {
    const input = document.querySelector('input');
    input.value = state.inputValue;
    const button = document.querySelector('button');
    if (state.inputValid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      button.disabled = false;
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      button.disabled = true;
    }
    if (state.processing) {
      document.querySelector('button').disabled = true;
      document.getElementById('source').disabled = true;
      button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    } else {
      document.querySelector('button').disabled = false;
      document.getElementById('source').disabled = false;
      button.textContent = 'Submit';
    }
    if (state.inputValue === '') {
      input.classList.remove('is-invalid');
    }
  });
  watch(state, 'rssTitle', () => {
    renderHTML(state.rss);
  });
};
