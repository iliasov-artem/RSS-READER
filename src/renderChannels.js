
const getChannelHTML = ({ title, description, id }) => (`
<li class="nav-item">
  <a class="nav-link" data-toggle="pill" href="#${id}">
    <p class="mb-1"><strong>${title}</strong></p>
    <p class="mb-1">${description}</p>
  </a>
</li>
`);

export default (channels, activeId) => {
  if (channels.length > 0) {
    document.querySelector('.channels-container').classList.remove('d-none');
  }
  const channelsHTML = channels.map(channel => getChannelHTML(channel)).join(''); // \n
  const channelsList = document.querySelector('.nav');
  channelsList.innerHTML = channelsHTML;
  const activeChannel = document.querySelector(`a[href="#${activeId}"]`);
  activeChannel.classList.add('active');
};
