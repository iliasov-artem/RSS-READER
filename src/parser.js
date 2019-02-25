
export default (xml) => {
  const parse = new DOMParser();
  const parsedXML = parse.parseFromString(xml.data, 'application/xml');
  const channelTitle = parsedXML.querySelector('title').textContent;
  const channelDescription = parsedXML.querySelector('description').textContent;
  const channel = {
    title: channelTitle,
    description: channelDescription,
  };
  const channelFeed = Array.from(parsedXML.querySelectorAll('item'));
  const latestNews = channelFeed[0];
  const latestNewsPub = latestNews.querySelector('pubDate').textContent;
  const pubDate = Math.round(new Date(latestNewsPub).getTime() / 1000).toString();
  const items = channelFeed.map((item) => {
    const itemTitle = item.querySelector('title').textContent;
    const itemLink = item.querySelector('link').textContent;
    const itemDesription = item.querySelector('description').textContent;
    return {
      title: itemTitle,
      link: itemLink,
      description: itemDesription,
    };
  });
  const feed = { items, pubDate };
  return { channel, feed };
};
