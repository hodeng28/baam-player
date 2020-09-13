import * as player from "./player.js";


const myStorage = window.localStorage;

// dom
// play List
const $listOpenBtn = document.querySelector('.play-list-open');
const $playListAll = document.querySelector('.play-list-all');
const $playCloseBtn = document.querySelector('.play-list-close');
// favorite List
const $favoriteCloseBtn = document.querySelector('.favorite-list-close');
const $favoriteListAll = document.querySelector('.favorite-list-all');
const $favorOpenBtn = document.querySelector('.sign-favorite');
const $favoriteList = document.querySelector('.favorite-list-all');

const $logoBox = document.querySelector('.logo-box');
const $musicList = document.querySelector('.music-list');

// music genre  (side menu)
const $jazzGenre = document.querySelector('.jazz-ganre');
const $rockGenre = document.querySelector('.rock-ganre');
const $classicGenre = document.querySelector('.classic-ganre');
const $danceGenre = document.querySelector('.dance-ganre');
const $hiphopGenre = document.querySelector('.hiopop-ganre');

// music top
const $musicTop = document.querySelector('.music-top');


const setBackgroundImg = data => {
  const $albumImgs = document.querySelectorAll('.album-img');
  $albumImgs.forEach((imgs, i) => {
    imgs.style = `background-image: url(./css/al-img/${data[i].fileName}.png)`;
  });
};

const renderMusics = async (musics, type) => {
  const id = myStorage.getItem('id');
  let favoriteMusics;

  if (id !== 'guest') {
    const { data } = await axios.post('/favorite', { id });
    favoriteMusics = data;
  }

  let musicItems = '';
  musics.forEach((music, i) => {
    musicItems += `<li id="ml-${i}" class="music">
         <div class="album-con-outer">
           <div class="album-con-inner">
             <div class="album-img"></div>
             <div class="album-blur hidden"></div>
             <div class="album-btn-set hidden">
               <button class="album-btn favorite ${id === 'guest' ? '' : favoriteMusics.find((fmusic) => fmusic.title === music.title) ? 'select' : ''}"></button>
               <button class="album-btn play"></button>
               <button class="album-btn plus"></button>
             </div>
           </div>
         </div>
         <div class="album-title">${music.title}</div>
         <div class="album-artist">${music.composer}</div>
       </li>`;
  });


  myStorage.setItem('albumType', type);
  $musicList.innerHTML = musicItems;
  setBackgroundImg(musics);
};

// 렌더함수
const renderAllMusic = async () => {
  const { data } = await axios.get('/musics');
  renderMusics(data, 'all');
};


// 장르별 음악
const renderTypeList = async type => {
  const { data } = await axios.post('/typelist', { type });
  const typeMusicList = data;
  renderMusics(typeMusicList, type);
};


const getTop10Musics = async () => {
  const { data } = await axios.get('/top10');
  const musics = data;
  renderMusics(musics, 'top10');
};


$logoBox.addEventListener('click', renderAllMusic);

$musicTop.addEventListener('click', getTop10Musics);


$jazzGenre.addEventListener('click', () => {
  renderTypeList('jazz');
});
$rockGenre.addEventListener('click', () => {
  renderTypeList('rock');
});
$classicGenre.addEventListener('click', () => {
  renderTypeList('classic');
});
$danceGenre.addEventListener('click', () => {
  renderTypeList('dance');
});
$hiphopGenre.addEventListener('click', () => {
  renderTypeList('hiphop');
});


// playList open close btn
$listOpenBtn.addEventListener('click', async () => {
  $playListAll.classList.toggle('active');
  $favoriteList.classList.remove('active');
  // await player.setPlayList.fromServer(myStorage.getItem('id'));
  await player.listRender();
});

$playCloseBtn.addEventListener('click', () => {
  $playListAll.classList.toggle('active');
});

// favorite open close btn
$favorOpenBtn.addEventListener('click', async () => {
  $favoriteList.classList.toggle('active');
  $playListAll.classList.remove('active');
  // await player.setFavoriteList(myStorage.getItem('id'));
  await player.favoriteRender();
});

$favoriteCloseBtn.addEventListener('click', () => {
  $favoriteListAll.classList.toggle('active');
});


export {
  renderAllMusic, renderMusics, renderTypeList
};