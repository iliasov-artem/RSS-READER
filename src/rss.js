import validator from 'validator';
import axios from 'axios';
import WatchJS from 'melanke-watchjs';
import renderHTML from './render';

const { watch } = WatchJS;
const corsHost = 'https://cors-anywhere.herokuapp.com/';
const parse = new DOMParser();

export default () => {
  const state = {
    inputValue: '',
    inputValid: false,
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
    axios.get(`${corsHost}${input.value}`).then((response) => {
      state.currentRssChannel = input.value;
      const parsedResponse = parse.parseFromString(response.data, 'application/xml');
      const title = parsedResponse.querySelector('title').textContent;
      const description = parsedResponse.querySelector('description').textContent;
      const items = Array.from(parsedResponse.querySelectorAll('item'));
      state.rss = { title, description, items };
      state.rssTitle = state.rss.title;
      state.inputValue = '';
      input.value = '';
      state.inputValid = false;
    });
  });
  watch(state, 'inputValue', () => {
    if (state.inputValid) {
      document.getElementById('source').className = 'form-control is-valid';
      document.querySelector('button').disabled = false;
    } else {
      document.getElementById('source').className = 'form-control is-invalid';
      document.querySelector('button').disabled = true;
    }
  });
  watch(state, 'rssTitle', () => {
    renderHTML(state.rss);
  });
};
