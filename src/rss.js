import validator from 'validator';
import axios from 'axios';
import WatchJS from 'melanke-watchjs';
import renderPopup from './renderPopup';
import parseXML from './parser';
import renderChannels from './renderChannels';
import renderFeed from './renderFeed';


const { watch } = WatchJS;
const corsHost = 'https://cors.io/?'; // https://crossorigin.me/ https://cors-anywhere.herokuapp.com/

export default () => {
  const state = {
    inputValue: '',
    inputValidity: 'invalid',
    processing: 'downtime',
    currentRssChannel: '',
    message: 'nothing',
    rss: {},
    channels: [],
    feeds: [],
    lastChannel: '',
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
      state.inputValidity = 'invalid';
      state.inputValue = '';
      state.processing = 'downtime';
      const { channel } = parseXML(response);
      state.lastChannel = channel.id;
      const feed = { ...parseXML(response).feed, link };
      feed.id = state.lastChannel;
      state.channels = [channel, ...state.channels];
      state.feeds = [feed, ...state.feeds];
      state.message = 'success';
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
      state.feeds.forEach((item) => {
        axios.get(item.link).then((response) => {
          const { feed } = parseXML(response);
          const { items, pubDate } = feed;
          if (pubDate > item.pubDate) {
            // eslint-disable-next-line no-param-reassign
            item.pubDate = pubDate;
            // eslint-disable-next-line no-param-reassign
            item.items = items;
          }
        }).catch(err => console.error('error', err.message))
          .finally(() => setTimeout(updateChecker, 5000));
      });
    }
  };
  setTimeout(updateChecker, 5000);
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
  watch(state, 'channels', () => renderChannels(state.channels, state.lastChannel));
  watch(state, 'feeds', () => renderFeed(state.feeds, state.lastChannel));
  watch(state, 'message', () => {
    const messages = {
      success: 'Channel was successfully added',
      error: 'Something wrong with your link. Channel is not available!',
    };
    switch (state.message) {
      case 'nothing':
        break;
      case 'success':
        renderPopup(messages.success);
        break;
      case 'error':
        renderPopup(messages.error);
        break;
      default: break;
    }
  });
};
