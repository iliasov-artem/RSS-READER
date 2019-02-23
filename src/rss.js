import validator from 'validator';
import axios from 'axios';
import WatchJS from 'melanke-watchjs';
import renderPopup from './renderPopup';
import renderHTML from './render';
import parseXML from './parser';


const { watch } = WatchJS;
const corsHost = 'https://cors-anywhere.herokuapp.com/';

export default () => {
  const state = {
    inputValue: '',
    inputValidity: 'invalid',
    processing: 'downtime',
    currentRssChannel: '',
    message: '',
    rss: {},
    feeds: [],
  };
  const input = document.getElementById('source');
  input.addEventListener('input', (e) => {
    e.preventDefault();
    const { value } = e.target;
    state.inputValue = value;
    state.inputValidity = (validator.isURL(value) && value !== state.currentRssChannel) ? 'valid' : 'invalid';
  });
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const link = `${corsHost}${input.value}`;
    state.processing = 'loading';
    axios.get(link).then((response) => {
      state.currentRssChannel = input.value;
      state.rss = parseXML(response);
      state.inputValue = '';
      state.inputValidity = 'invalid';
      state.processing = 'downtime';
      state.feeds = [...state.feeds, state.rss];
    }).catch((err) => {
      state.processing = 'downtime';
      state.message = 'Please check your link. RSS feed does not available rigth now!';
      state.inputValue = '';
      state.inputValidity = 'invalid';
      console.log(err);
    });
  });
  const updateChecker = () => {
    if (state.currentRssChannel) {
      const latestNews = state.rss.items[0];
      // const latestNewsTitle = latestNews.querySelector('title').textContent;
      const latestNewsPub = latestNews.querySelector('pubDate').textContent;
      const sec = Math.round(new Date(latestNewsPub).getTime() / 1000).toString();
      axios.get(`${corsHost}${state.currentRssChannel}`).then((response) => {
        const { items } = parseXML(response);
        const newsToAdd = items.filter((item) => {
          const date = item.querySelector('pubDate').textContent;
          const dateSec = Math.round(new Date(date).getTime() / 1000).toString();
          return dateSec > sec;
        });
        const newItems = [...newsToAdd, ...state.rss.items];
        state.rss.items = newItems;
      });
    }
  };
  setInterval(updateChecker, 5000);
  watch(state, 'inputValue', () => {
    input.value = state.inputValue;
    const button = document.querySelector('button');
    switch (state.inputValidity) {
      case 'valid':
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        button.disabled = false;
        break;
      case 'invalid':
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        button.disabled = true;
        break;
      default: break;
    }
  });
  watch(state, 'processing', () => {
    input.value = state.inputValue;
    const button = document.querySelector('button');
    switch (state.processing) {
      case 'downtime':
        button.disabled = false;
        input.disabled = false;
        button.textContent = 'Sign In';
        break;
      case 'loading':
        button.disabled = true;
        input.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
        break;
      default: break;
    }
  });
  watch(state, 'rss', () => {
    renderHTML(state.rss);
  });
  watch(state, 'message', () => renderPopup(state.message));
};
