import * as player from "./player.js";

const PLAY_ON = false;
const myStorage = window.localStorage;

const addPlayList = async ({ target }) => {
  if (!target.matches('.album-btn.plus')) return;
  const albumTitles = document.querySelectorAll('.album-title');

  const index = +target.parentNode.parentNode.parentNode.parentNode.id.replace('ml-', '');
  const title = albumTitles[index].innerText;

  const id = myStorage.getItem('id');

  if (id === 'guest') {
    await player.setPlayList.toLocal(title);
    await player.listRender();
  } else {
    await axios.post('/addplaylist', { id, title });
    await player.setPlayList.fromServer(id);
    await player.listRender();
  }
};

const addPlayListPlay = async ({ target }) => {
  if (!target.matches('.album-btn.play')) return;
  const albumTitles = document.querySelectorAll('.album-title');

  const index = +target.parentNode.parentNode.parentNode.parentNode.id.replace('ml-', '');
  const title = albumTitles[index].innerText;

  const id = myStorage.getItem('id');

  if (id === 'guest') {
    await player.setPlayList.toLocal(title);
    await player.listRender();
  } else {
    await axios.post('/addplaylist', { id, title });
    await player.setPlayList.fromServer(id);
    await player.listRender();
  }
  myStorage.setItem('playListType', 'playList')
  player.setPlayingIndex(-1);

  player.setMusic();
  player.setPlayStatus(PLAY_ON);
};

const addFavorite = async ({ target }) => {
  if (!target.matches('.album-btn.favorite')) return;
  const albumTitles = document.querySelectorAll('.album-title');

  const index = +target.parentNode.parentNode.parentNode.parentNode.id.replace('ml-', '');
  const title = albumTitles[index].innerText;

  const id = myStorage.getItem('id');
  if (id === 'guest') return;

  const { data } = await axios.post('/favorite', { id });
  const favoriteList = data;

  const favoriteIndex = favoriteList.findIndex(music => music.title === title);

  let newFavoriteList;

  if (favoriteIndex !== -1) {
    newFavoriteList = await axios.patch('/deletefavorite', { id, deleteIndex: favoriteIndex });
    newFavoriteList = newFavoriteList.data;
    target.classList.remove('select');
  } else {
    newFavoriteList = await axios.post('/addFavorite', { id, title });
    newFavoriteList = newFavoriteList.data;
    target.classList.add('select');
  }

  player.setFavoriteList('_', newFavoriteList);
  player.paintSelectedList(player.getPlayingIndex());
  player.favoriteRender();
};


export {
  addPlayList, addPlayListPlay, addFavorite
};