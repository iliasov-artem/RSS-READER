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
      state.rss = { ...parseXML(response), link };
      state.inputValidity = 'invalid';
      state.inputValue = '';
      state.processing = 'downtime';
      state.feeds = [state.rss, ...state.feeds];
    }).catch((err) => {
      state.processing = 'downtime';
      state.message = 'Please check your link. RSS feed does not available rigth now!';
      state.inputValidity = 'invalid';
      state.inputValue = '';
      console.log(err);
    });
  });
  const updateChecker = () => {
    if (state.feeds.length > 0) {
      state.feeds.forEach((feed) => {
        axios.get(feed.link).then((response) => {
          const newFeed = parseXML(response);
          const { pubDate } = newFeed;
          const { items } = parseXML(response);
          if (pubDate > feed.pubDate) {
            // eslint-disable-next-line no-param-reassign
            feed = Object.assign(feed, { items }, { pubDate });
          }
        });
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
  watch(state, 'rss', () => renderHTML(state.feeds));
  watch(state, 'message', () => renderPopup(state.message));
};
