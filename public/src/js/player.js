import * as login from "./login.js";

const PLAY_ON = false;
const PLAY_OFF = true;

const $musicPlayer = document.querySelector('.musicPlayer');
const $playBtn = document.querySelector('.player-play');
const $musicCover = document.querySelector('.playing-music-img');
const $musicTitle = document.querySelector('.playing-music-title');
const $composer = document.querySelector('.playing-music-artist');
const $playList = document.querySelector('.play-list');
const $progInner = document.querySelector('.play-bar-inner');
const $progOuter = document.querySelector('.play-bar-outer');
const $playTimeIng = document.querySelector('.play-time-ing');
const $playTime = document.querySelector('.play-time');
const $volumeInner = document.querySelector('.sound-bar-inner');
const $soundBtn = document.querySelector('.player-sound');
const $soundGetevent = document.querySelector('.sound-bar-getevent');
const $shuffleBtn = document.querySelector('.player-shuffle');
const $favoriteListUL = document.querySelector('.favorite-list');
const $musicList = document.querySelector('.music-list');

const myStorage = window.localStorage;

let playingIndex = 0;
let shuffled = false;


// control player to button
const isPlaying = () => !$musicPlayer.paused;
const setPlayingIndex = (index) => {
  if (index === -1) playingIndex = JSON.parse(myStorage.getItem('playList')).length - 1;
  else playingIndex = index;
};
const getPlayingIndex = () => playingIndex;

// set music func
const setMusic = () => {
  const musics = JSON.parse(myStorage.getItem('playList'));

  // const musics = data;
  if (musics.length === 0) return;

  const music = musics[playingIndex];
  $musicPlayer.src = `musics/${music.fileName}.mp3`;
  $musicTitle.innerText = music.title;
  $composer.innerText = music.composer;

  $musicCover.style.backgroundImage = `url(./css/al-img/${music.fileName}.png)`;
};

const paintSelectedList = (index) => {
  const $targetNode = myStorage.getItem('playListType') === 'playList' ? $playList : $favoriteListUL;
  [...$playList.children].forEach((li) => li.classList.remove('playing'));
  [...$favoriteListUL.children].forEach((li) => li.classList.remove('playing'));
  // console.log(index, $targetNode,$targetNode.children[index]);
  if (!$musicPlayer.paused) $targetNode.children[index].classList.add('playing');
};

const setPlayList = (() => {
  const setPlayList = async (type, id, title) => {
    if (type === 'server') {
      const { data } = await axios.post('/playlist', { id });
      myStorage.setItem('playList', JSON.stringify(data));
      return;
    }
    const musicList = JSON.parse(myStorage.getItem('playList'));

    const { data } = await axios.post('/music', { title });
    const newMusicList = [...musicList, data];

    myStorage.setItem('playList', JSON.stringify(newMusicList));
  };

  const fromServer = async (id) => await setPlayList('server', id);
  const toLocal = async (title) => await setPlayList('local', '_', title);

  return { fromServer, toLocal };
})();

const setFavoriteList = async (id, MusicList = false) => {
  if (MusicList) {
    myStorage.setItem('playList', JSON.stringify(MusicList));
    return;
  }
  const { data } = await axios.post('/favorite', { id });
  myStorage.setItem('playList', JSON.stringify(data));
};

const setPlayStatus = (boolean) => {
  const musics = JSON.parse(myStorage.getItem('playList'));
  if (musics.length === 0) return;

  if (boolean) {
    $playBtn.childNodes[0].classList.remove('fa-pause');
    $playBtn.childNodes[0].classList.add('fa-play');

    $musicPlayer.pause();
  } else {
    // $playBtn.classList.add('playing');
    $playBtn.childNodes[0].classList.remove('fa-play');
    $playBtn.childNodes[0].classList.add('fa-pause');

    $musicPlayer.play();
    paintSelectedList(playingIndex);
  }
  login.premiumPop();
};


const setShuffleStatus = () => {
  if (shuffled) {
    $shuffleBtn.classList.remove('random');
    shuffled = false;
  } else {
    $shuffleBtn.classList.add('random');
    shuffled = true;
  }
};

const playSelectedList = async (e, index) => {
  if (e.target.matches('.list-up, .list-down, .list-remove')) return;

  // const title = e.target.matches('.list-item-title') ? e.target.innerText : e.target.previousSibling.previousSibling.innerText;

  playingIndex = index;
  const id = myStorage.getItem('id');

  if (e.target.parentNode.matches('.play-list') || e.target.parentNode.parentNode.matches('.play-list')) {
    // if (id === 'guest') await setPlayList.
    if (id !== 'guest') await setPlayList.fromServer(myStorage.getItem('id'));
    // console.log('hi');
  }
  else {
    await setFavoriteList(myStorage.getItem('id'));
    // console.log('bye');
  }

  setMusic();
  setPlayStatus(PLAY_ON);
  paintSelectedList(playingIndex);
};

const playNext = () => {
  const musics = JSON.parse(myStorage.getItem('playList'));
  if (musics.length === 0) return;

  if (shuffled === false) {
    playingIndex++;
    if (playingIndex > musics.length - 1) playingIndex = 0;
  } else {
    let randomIndex = 0;
    do {
      randomIndex = Math.floor(Math.random() * musics.length);
    } while (playingIndex === randomIndex);
    playingIndex = randomIndex;
  }

  setMusic();
  setPlayStatus(PLAY_ON);
  paintSelectedList(playingIndex);
};

const playPrev = () => {
  const musics = JSON.parse(myStorage.getItem('playList'));
  if (musics.length === 0) return;

  if (shuffled === false) {
    playingIndex--;
    if (playingIndex < 0) playingIndex = musics.length - 1;
  } else {
    let randomIndex = 0;
    do {
      randomIndex = Math.floor(Math.random() * musics.length);
    } while (playingIndex === randomIndex);
    playingIndex = randomIndex;
  }

  setMusic();
  setPlayStatus(PLAY_ON);
  paintSelectedList(playingIndex);
};


// list render
const listRender = async () => {
  const { data } = await axios.post('/playlist', { id: myStorage.getItem('id') })
  const serverPlayList = data;

  let musics;
  if (myStorage.getItem('id') === 'guest') {
    musics = JSON.parse(myStorage.getItem('playList'));
  } else musics = serverPlayList;

  if (musics.length === 0) {
    $playList.innerHTML = '';
    return;
  }

  let playList = '';
  musics.forEach((music, i) => {
    playList += `<li id="pl-${i}" class="play-list-item">
                  <span class="list-item-title">${music.title}</span>
                  <span class="list-item-artist">${music.composer}</span>
                  <button class="list-up"></button>
                  <button class="list-down"></button>
                  <button class="list-remove"></button>
                </li>`;
  });
  $playList.innerHTML = playList;
  paintSelectedList(playingIndex);
};

const clearPlayList = () => {
  $playList.innerHTML = '';
  myStorage.setItem('playList', JSON.stringify([]));
};

const clearFavorite = () => { $playList.innerHTML = ''; };

const favoriteRender = async () => {
  const { data } = await axios.post('/favorite', { id: myStorage.getItem('id') });

  const musics = data;

  if (musics.length === 0) {
    $favoriteListUL.innerText = '';
    return;
  }

  let playList = '';
  musics.forEach((music, i) => {
    playList += `<li id="pl-${i}" class="play-list-item">
                  <span class="list-item-title">${music.title}</span>
                  <span class="list-item-artist">${music.composer}</span>
                  <button class="list-up"></button>
                  <button class="list-down"></button>
                  <button class="list-remove"></button>
                </li>`;
  });
  $favoriteListUL.innerHTML = playList;
  paintSelectedList(playingIndex);
};

const listUpDown = (() => {
  const control = async (e, type) => {
    if (!e.target.matches('.list-up, .list-down')) return;

    const apiAddress = type === 'playlist' ? '/patchplaylist' : '/patchfavorite';

    const isUp = e.target.matches('.list-up');
    const addIndex = e.target.matches('.list-up') ? -1 : 1;

    const id = myStorage.getItem('id');

    const index = +e.target.parentNode.id.replace('pl-', '');

    let nowMusicTitle;
    let newPlayList;
    if (id === 'guest') {
      newPlayList = JSON.parse(myStorage.getItem('playList'));
      nowMusicTitle = newPlayList[playingIndex].title;

      const newIndex = index + addIndex;
      const splicedMusic = newPlayList.splice(index, 1);

      newPlayList.splice(newIndex, 0, splicedMusic[0]);
    } else {
      let musics = type === 'playlist' ? await axios.post('/playlist', { id: myStorage.getItem('id') }) : await axios.post('/favorite', { id: myStorage.getItem('id') });
      musics = musics.data;
      nowMusicTitle = musics[playingIndex].title;
      const { data } = await axios.patch(apiAddress, { id, index, isUp });
      newPlayList = data;
    }

    myStorage.setItem('playList', JSON.stringify(newPlayList));

    const check = playingIndex - index;
    playingIndex = check === -1 && isUp ? playingIndex + 1 : check === 1 && !isUp ? playingIndex - 1 : playingIndex;
    playingIndex = check === 0 && isUp ? playingIndex - 1 : check === 0 && !isUp ? playingIndex + 1 : playingIndex;


    listRender();
    favoriteRender();
    paintSelectedList(playingIndex);
  };

  const playListUpDown = (e) => control(e, 'playlist');
  const favoriteListUpDown = (e) => control(e, 'favorite');

  return {
    playListUpDown, favoriteListUpDown
  };
})();


const deleteList = async ({ target }) => {
  if (!target.matches('li > .list-remove')) return;

  const id = myStorage.getItem('id');
  const deleteIndex = +target.parentNode.id.replace('pl-', '');
  let newPlayList;

  if (target.parentNode.parentNode.matches('.play-list')) {
    if (id === 'guest') {
      newPlayList = JSON.parse(myStorage.getItem('playList')).filter((_, i) => i !== deleteIndex);
    }
    else {
      const { data } = await axios.patch('/deletePlaylist', { id, deleteIndex });
      newPlayList = data;
    }
    myStorage.setItem('playList', JSON.stringify(newPlayList));
  } else {
    // const { data } = await axios.patch('/deletefavorite', { id, deleteIndex });
    await axios.patch('/deletefavorite', { id, deleteIndex });
    // newPlayList = data;
    favoriteRender();

    const deleteTitle = [...target.parentNode.children].find(node => node.matches('.list-item-title')).innerText;
    const findTitleNode = [...$musicList.children].find(li => {
      const listTitle = [...li.children].find(music => music.matches('.album-title')).innerText;
      return listTitle === deleteTitle;
    });

    if (findTitleNode) {
      const $favoriteBtns = document.querySelectorAll('.album-btn.favorite');
      const $favoriteBtn = [...$favoriteBtns].find(btn => btn.parentNode.parentNode.parentNode.nextSibling.nextSibling.innerText === deleteTitle);
      $favoriteBtn.classList.remove('select');
    }
    // hoRender.renderTypeList(myStorage.getItem('albumType'));
  }
  listRender();

  if (deleteIndex === playingIndex) {
    setPlayStatus(PLAY_OFF);
    setMusic();
  }
  const check = playingIndex - deleteIndex;
  playingIndex = check === 1 ? playingIndex - 1 : playingIndex;
  paintSelectedList(playingIndex);
};


// progressbar funcs
const calcTime = (time) => {
  let min = Math.floor(time / 60);
  let sec = Math.floor(time - (min * 60));
  sec = sec >= 10 ? sec : `0${sec}`;
  min = min >= 10 ? min : `0${min}`;

  return `${min}:${sec}`;
};

const setProgToRuntime = () => {
  const isNaNDuration = isNaN($musicPlayer.duration);
  const isPremium = JSON.parse(myStorage.getItem('premium'));

  const duration = isPremium ? $musicPlayer.duration : 60;

  $progInner.style.width = isNaNDuration ? '0%' : `${($musicPlayer.currentTime / duration) * 100}%`;
  $playTime.innerText = isNaNDuration ? '00:00' : calcTime(duration);
  $playTimeIng.innerText = calcTime($musicPlayer.currentTime);

  if (!isPremium && $musicPlayer.currentTime >= 60) playNext();
};

const setRuntimeToProg = (e) => {
  let duration = isNaN($musicPlayer.duration) ? 0 : $musicPlayer.duration;
  const isPremium = JSON.parse(myStorage.getItem('premium'));

  duration = isPremium ? duration : 60;
  $musicPlayer.currentTime = (e.offsetX / $progOuter.offsetWidth) * duration;
};

const removeSetProg = () => $musicPlayer.removeEventListener('timeupdate', setProgToRuntime);
const addSetProg = () => $musicPlayer.addEventListener('timeupdate', setProgToRuntime);


// volume
const setVolume = (e) => {
  let volume = e.offsetX / $soundGetevent.offsetWidth;

  if (e.target.matches('.play-list-all') && e.offsetX < 250) volume = 0;
  else if (e.target.matches('.main-window') && e.offsetX < 800) volume = 0;
  else if (e.target.matches('.favorite-list-all') && e.offsetX < 250) volume = 0;
  else if (e.target.matches('.music-list') && e.offsetX < 780) volume = 0;
  else if (e.target.matches('.sound-pop') && e.offsetX < 10) volume = 0;
  else if (e.target.matches('.sound-popup') && e.offsetX < 10) volume = 0;
  else if (e.target.matches('.nomal-user-pop') && e.offsetX < 400) volume = 0;
  else if (e.target.matches('.sound-bar-inner') && e.offsetX < 10) volume = 0;
  else if (e.target.matches('.album-con-outer') && e.offsetX < 100) volume = 0;
  else if (e.target.matches('.album-btn-set')) volume = 0;
  else if (e.target.matches('.album-img, .album-btn')) volume = 0;

  volume = volume > 200 || volume <= 0 ? 0 : volume > 1 ? 1 : volume;

  if (volume <= 0) {
    $soundBtn.childNodes[0].classList.remove('fa-volume-up');
    $soundBtn.childNodes[0].classList.add('fa-volume-mute');
  } else {
    $soundBtn.childNodes[0].classList.remove('fa-volume-mute');
    $soundBtn.childNodes[0].classList.add('fa-volume-up');
  }

  $volumeInner.style.width = `${volume * 100}%`;
  $musicPlayer.volume = volume;
};

export {
  isPlaying, setMusic, setPlayStatus, playSelectedList, 
  playNext, playPrev, listRender, favoriteRender,
  setPlayList, setFavoriteList, setPlayingIndex, getPlayingIndex, 
  paintSelectedList, clearPlayList, clearFavorite,
  setProgToRuntime, setRuntimeToProg, removeSetProg, addSetProg,
  setShuffleStatus,
  setVolume,
  deleteList, listUpDown
};
