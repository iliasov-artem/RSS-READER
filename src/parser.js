import { uniqueId } from 'lodash';

export default (xml) => {
  const parse = new DOMParser();
  const parsedXML = parse.parseFromString(xml.data, 'application/xml');
  const title = parsedXML.querySelector('title').textContent;
  const description = parsedXML.querySelector('description').textContent;
  const items = Array.from(parsedXML.querySelectorAll('item'));
  const latestNews = items[0];
  const latestNewsPub = latestNews.querySelector('pubDate').textContent;
  const pubDate = Math.round(new Date(latestNewsPub).getTime() / 1000).toString();
  const id = `feed${uniqueId()}`;
  return {
    title, description, items, id, pubDate,
  };
};
