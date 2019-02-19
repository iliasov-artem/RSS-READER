import validator from 'validator';
import axios from 'axios';
import WatchJS from 'melanke-watchjs';

const watch = WatchJS.watch;
const corsHost = 'https://cors-anywhere.herokuapp.com/';
const parse = new DOMParser();

const isURL = str => validator.isURL(str);

export default () => {
  const state = {
    inputValue: '',
    inputValid: false,
    rssFeed: [],
  };
  const input = document.getElementById('source');
  input.addEventListener('input', (e) => {
    e.preventDefault();
    const { value } = e.target.value;
    state.inputValue = value;
    //state.inputValid = isURL(value);
  });
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(input.value);
    axios.get(`${corsHost}${input.value}`).then((response) => {
      const parsedResponse = parse.parseFromString(response.data, 'application/xml');
      const title = parsedResponse.querySelector('title');
      const description = parsedResponse.querySelector('description');
      const items = parsedResponse.querySelectorAll('item');
      console.log([title, description, items]);
    });
  });
};
