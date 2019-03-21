import validator from 'validator';
import axios from 'axios';
import WatchJS from 'melanke-watchjs';
import { uniqueId } from 'lodash';
import renderPopup from './renderers/renderPopup';
import parseXML from './parser';
import renderChannels from './renderers/renderChannels';
import renderFeed from './renderers/renderFeed';

const { watch } = WatchJS;
const corsHost = 'https://cors.io/?'; // https://crossorigin.me/ https://cors-anywhere.herokuapp.com/ https://cors.io/?

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
    state.message = 'nothing';
    const link = `${corsHost}${input.value}`;
    state.processing = 'loading';
    axios.get(link).then((response) => {
      const id = `feed${uniqueId()}`;
      state.currentRssChannel = input.value;
      state.inputValidity = 'invalid';
      state.inputValue = '';
      state.processing = 'downtime';
      const channel = { ...parseXML(response).channel, id };
      state.lastChannel = id;
      const feed = { ...parseXML(response).feed, link, id };
      state.channels = [channel, ...state.channels];
      state.feeds = [feed, ...state.feeds];
      state.message = 'success';
    }).catch((err) => {
      state.processing = 'downtime';
      state.message = 'error';
      state.inputValidity = 'invalid';
      state.inputValue = '';
      console.log(err);
    });
  });

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

  const checkUpdate = (feeds) => {
    if (feeds.length === 0) {
      setTimeout(checkUpdate, 5000, state.feeds);
      return;
    }
    const requests = feeds.map(feed => axios.get(feed.link));
    axios.all(requests).then((responses) => {
      const newFeeds = responses.map(res => ({ ...parseXML(res).feed }));
      const oldFeedsDate = feeds.map(feed => feed.pubDate);
      const oldLatest = Math.max(...oldFeedsDate);
      const newFeedsDate = newFeeds.map(feed => feed.pubDate);
      const newLatest = Math.max(...newFeedsDate);
      if (newLatest > oldLatest) {
        const feedsToUpdate = feeds.map((feed, index) => {
          const { items } = newFeeds[index];
          const { pubDate } = newFeeds[index];
          return { ...feed, items, pubDate };
        });
        state.feeds = feedsToUpdate;
      }
    }).catch(err => console.error('error', err)).finally(() => setTimeout(checkUpdate, 5000, state.feeds));
  };
  setTimeout(checkUpdate, 5000, state.feeds);
};
