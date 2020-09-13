const $toastContainer = document.querySelector('.toast-container');
const $albumList = document.querySelector('.music-list');

const myStorage = window.localStorage;

const toastControl = (() => {
  // let count = 0;

  const makeMessage = (type, title, message) => {
    const $newDiv = document.createElement('div');
    $newDiv.classList.add('toast', type);

    const $strong = document.createElement('strong');
    const $title = document.createTextNode(`${title}`);
    const $message = document.createTextNode(message);
    // const $closeBtn = document.createElement('button');
    // const $closeBtnText = document.createTextNode('X');

    // $closeBtn.appendChild($closeBtnText);
    // $closeBtn.classList.add('close');

    $strong.appendChild($title);

    $newDiv.appendChild($strong);
    $newDiv.appendChild($message);
    // $newDiv.appendChild($closeBtn);

    $toastContainer.appendChild($newDiv);

    setTimeout(() => {
      if (![...$toastContainer.children].includes($newDiv)) return;

      $toastContainer.removeChild($newDiv);
      // count--;
    }, 1500);

    // $closeBtn.onclick = () => {
    //   $toastContainer.removeChild($newDiv);
    //   count--;
    // };

    // count++;
  };

  const addPlayListToast = (musicTitle) => makeMessage('addplaylistToast', 'Playlist 추가', `${musicTitle}를 추가하였습니다.`);
  const addFavoriteToast = (musicTitle) => makeMessage('addfavoriteToast', 'Favorite 추가', `${musicTitle}를 추가하였습니다`);
  const deleteFavoriteToast = (musicTitle) => makeMessage('deletefavoriteToast', 'Favorite 제거', `${musicTitle}를 제거하였습니다`);
  // const warning = () => makeMessage('warning', 'Check it out!', 'This is warning alert');

  return { addPlayListToast, addFavoriteToast, deleteFavoriteToast };
})();

const addPlayListMessage = ({ target }) => {
  if (!target.matches('.album-btn.plus')) return;

  const musicTitle = target.parentNode.parentNode.parentNode.nextSibling.nextSibling.innerText;

  toastControl.addPlayListToast(musicTitle);
};

const addFavoriteMessage = ({ target }) => {
  if (!target.matches('.album-btn.favorite ') || myStorage.getItem('id') === 'guest') return;

  const musicTitle = target.parentNode.parentNode.parentNode.nextSibling.nextSibling.innerText;

  if (target.matches('.select')) {
    toastControl.deleteFavoriteToast(musicTitle);
    return;
  }
  toastControl.addFavoriteToast(musicTitle);
};

$albumList.addEventListener('click', addPlayListMessage);
$albumList.addEventListener('click', addFavoriteMessage);
