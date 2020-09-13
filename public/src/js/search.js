import * as musicList from './musicList.js';


const getTextContent = value => {
  const $albumTitle = document.querySelectorAll('.album-title');
  const $albumArtist = document.querySelectorAll('.album-artist');

  $albumTitle.forEach(title => {
    let html = '';
    const matchIndex = title.textContent.toLowerCase().indexOf(value);
    console.log(matchIndex);

    [...title.textContent].forEach((text, i) => {
      html += matchIndex === i && value.length === 1 ? `<span class="highlight">${text}</
      span>` : matchIndex === i && value.length > 1 ? `<span class="highlight"
      >${text}` : matchIndex + value.length === i && matchIndex !== -1 ? `</span>${text}` : text;
    });
    title.innerHTML = html;
  });

  $albumArtist.forEach(artist => {
    let html = '';
    const matchIndex = artist.textContent.toLowerCase().indexOf(value);
    console.log(matchIndex);

    [...artist.textContent].forEach((text, i) => {
      html += matchIndex === i && value.length === 1 ? `<span class="highlight">${text}</
      span>` : matchIndex === i && value.length > 1 ? `<span class="highlight"
      >${text}` : matchIndex + value.length === i && matchIndex !== -1 ? `</span>${text}` : text;
    });
    artist.innerHTML = html;
  });
};


const toSearch = (list, value) => {
  const searchCompleted = list.filter(({ title, composer }) => !!(
    title.toLowerCase().includes(value) || composer.toLowerCase().includes(value)));
  musicList.renderMusics(searchCompleted);
  getTextContent(value);
};


const getMusicListForSearch = async value => {
  // eslint-disable-next-line no-undef
  const { data } = await axios.get('/musics');
  const list = data;
  toSearch(list, value);
};


export {
  getMusicListForSearch, toSearch
};
