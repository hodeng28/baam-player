const express = require('express');
const cors = require('cors');
const key = require('./config.json');
const BootpayRest = require('bootpay-rest-client');

const app = express();
app.use(cors());


let musics = [
  { id: 1, type: 'hiphop', title: 'A to the O', fileName: 'A_to_the_O', composer: 'Diamond Ortiz', time: '3:38', totalCount: 100},
  { id: 2, type: 'hiphop', title: 'Triumph', fileName: 'Triumph', composer: 'Yung Logos', time: '3:01', totalCount: 200},
  { id: 3, type: 'hiphop', title: 'Same Time', fileName: 'Same_Time', composer: 'Spence', time: '2:48', totalCount: 100},
  { id: 4, type: 'hiphop', title: 'Easy trip trap', fileName: 'Easy_trip_trap', composer: 'The Brothers Records', time: '2:01', totalCount: 60},
  { id: 5, type: 'hiphop', title: 'Bit Coin', fileName: 'Bit_Coin', composer: 'Otis Macdonal', time: '2:41', totalCount: 150},
  { id: 6, type: 'hiphop', title: 'Charisma', fileName: 'Charisma', composer: 'The Brothers Records', time: '3:00', totalCount: 180},
  { id: 7, type: 'jazz', title: 'Blues Infusion', fileName: 'Blues_Infusion', composer: 'Quincas Moreira', time: '2:10', totalCount: 200},
  { id: 8, type: 'jazz', title: 'Tiptoe Out the Back', fileName: 'Tiptoe_Out_the_Back', composer: 'Dan Lebowitz', time: '2:44', totalCount: 191},
  { id: 9, type: 'jazz', title: 'Down by the Riverside', fileName: 'Down_by_the_Riverside', composer: "E's Jammy Jams", time: '3:07', totalCount: 300},
  { id: 10, type: 'jazz', title: 'Cruiser', fileName: 'Cruiser', composer: 'Magic In The Other', time: '2:06', totalCount: 550},
  { id: 11, type: 'jazz', title: 'Hurts So Good Blues', fileName: 'Hurts_So_Good_Blues', composer: 'Unicorn Heads', time: '4:48', totalCount: 490},
  { id: 12, type: 'jazz', title: 'Like Lee', fileName: 'Like_Lee', composer: 'The Mini Vandals', time: '2:10', totalCount: 100},
  { id: 13, type: 'classic', title: 'Anton', fileName: 'Anton', composer: 'Dan bodan', time: '2:40', totalCount: 190},
  { id: 14, type: 'classic', title: 'Beneath the Moonlight', fileName: 'Beneath_the_Moonlight', composer: 'Aaron Kenny', time: '2:08', totalCount: 100},
  { id: 15, type: 'classic', title: 'Bellissimo', fileName: 'Bellissimo', composer: 'Doug Maxwell', time: '1:55', totalCount: 100},
  { id: 16, type: 'classic', title: "New Year's Anthem", fileName: 'New_Years_Anthem', composer: 'Quincas Moreira', time: '1:41', totalCount: 300},
  { id: 17, type: 'classic', title: 'Pirouette', fileName: 'Pirouette', composer: 'Asher Fulero', time: '2:50', totalCount: 371},
  { id: 18, type: 'classic', title: 'Unrequited', fileName: 'Unrequited', composer: 'Asher Fulero', time: '2:26', totalCount: 320},
  { id: 19, type: 'rock', title: 'Motel Rock', fileName: 'Motel_Rock', composer: 'Hanu Dixit', time: '1:46', totalCount: 190},
  { id: 20, type: 'rock', title: 'Flex', fileName: 'Flex', composer: 'Jeremy Blake', time: '3:33', totalCount: 380},
  { id: 21, type: 'rock', title: 'The Big Guns', fileName: 'The_Big_Guns', composer: 'Silent Partner', time: '2:06', totalCount: 100},
  { id: 22, type: 'rock', title: 'Fight or Flight', fileName: 'Fight_or_Flight', composer: 'Ethan Meixsell', time: '1:52', totalCount: 100},
  { id: 23, type: 'rock', title: 'Sun Spots', fileName: 'Sun_Spots', composer: 'Silent Partner', time: '2:13', totalCount: 450},
  { id: 24, type: 'rock', title: 'Run', fileName: 'Run', composer: 'Ethan Meixsell', time: '1:58', totalCount: 400},
  { id: 25, type: 'dance', title: 'Cages', fileName: 'Cages', composer: 'Density & Time', time: '3:16', totalCount: 100},
  { id: 26, type: 'dance', title: 'Firefly', fileName: 'Firefly', composer: 'Quincas Moreira', time: '2:55', totalCount: 220},
  { id: 27, type: 'dance', title: 'Cloud Chaser', fileName: 'Cloud_Chaser', composer: 'Spence', time: '1:51', totalCount: 380},
  { id: 28, type: 'dance', title: 'Right Here Beside You', fileName: 'Right_Here_Beside_You', composer: 'Ethan Meixsell', time: '1:58', totalCount: 180},
  { id: 29, type: 'dance', title: 'Nightingale', fileName: 'Nightingale', composer: 'Eveningland', time: '2:52', totalCount: 130},
  { id: 30, type: 'dance', title: 'Moskito', fileName: 'Moskito', composer: 'Quincas Moreira', time: '1:58', totalCount: 449},
]

let users = [
  { id: 'ysungkoon', name: '유성균', password: '111111', email: 'ysungkyun@gmail.com', premium: true,
    playlist: ['A to the O', 'Hurts So Good Blues', 'Fight or Flight', 'Right Here Beside You', 'Sun Spots', 'Nightingale'],
    favorite: ['Unrequited', 'Pirouette', 'Hurts So Good Blues', 'Fight or Flight', 'Right Here Beside You', 'Sun Spots'],
  },
  { id: 'angryboo', name: '송부용',password: '111111', email: 'angryboo@gmail.com', premium: false,
    playlist: ['Same Time', 'Motel Rock', 'Cages', 'Firefly', 'Down by the Riverside', 'Hurts So Good Blues'],
    favorite: ['Cloud Chaser', 'Motel Rock', 'Cages', 'Down by the Riverside', 'Hurts So Good Blues'],
  },
  { id: 'hozero', name: '정호영', password: '111111', email: 'hozero@gmail.com', premium: false,
    playlist: ['Motel Rock', 'Cloud Chaser', 'Firefly', 'Blues Infusion', 'Bit Coin', 'Fight or Flight'],
    favorite: ['Bellissimo', 'Motel Rock', 'Bit Coin', 'Fight or Flight', 'Right Here Beside You'],
  },
  { id: 'pkt0831', name: '박기태', password: '111111', email: 'pkt0831@gmail.com', premium: true,
    playlist: ['Bit Coin', 'Sun Spots', 'Charisma', 'Triumph', 'Run', 'Moskito'],
    favorite: ['Sun Spots', 'Charisma', 'Bit Coin'],
  },
  { id: 'guest', name: 'Guest', password: '111111', email: 'call@gmail.com', premium: false,
    playlist: [],
    favorite: [],
  }
];


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => res.send(`<h1>${req.protocol}://${req.get('host')}${req.originalUrl}</h1>`));


// login
app.post('/login', (req, res) => {
  console.log('[POST] login');
  const { id, password } = req.body;

  const userData = users.find(user => user.id === id && user.password === password);

  res.send(userData ? { id: userData.id, name: userData.name, premium: userData.premium, playlist: userData.playlist, favorite: userData.favorite, email: userData.email } : undefined);
});


// signup
app.post('/signup', (req, res) => {
  console.log('[POST] signup');
  const { id, password, name, email } = req.body;

  const userData = users.find(user => user.id === id);

  if (!userData) users = [...users, { id, name, password, email, premium: false, playlist: [], favorite: [] }];

  res.send(userData ? { type: false, message: '이미 가입된 아이디 입니다' } : { type: true, message: `${id}님 회원가입을 축하드립니다` });
});


// get all music list
app.get('/musics', (req, res) => {
  console.log('[GET] musics');

  res.send(musics);
});

// get single music data
app.post('/music', (req, res) => {
  console.log('[GET] single music');

  const { title } = req.body;

  const music = musics.filter(music => music.title === title);
  console.log(title, music);
  res.send(music[0]);
});

// get Top 10 music list
app.get('/top10', (req, res) => {
  console.log('[GET] top10 musics');

  res.send(musics.sort((music1, music2) => music2.totalCount - music1.totalCount).slice(0, 10));
});

// get playlist
app.post('/playlist', (req, res) => {
  console.log(`[POST] playlist ${req.body.id}`);

  const { id } = req.body;
  const { playlist } = users.find(user => user.id === id);

  res.send(playlist.map(list => musics.find(music => music.title === list)));
});

// get favorite
app.post('/favorite', (req, res) => {
  console.log(`[POST] favorite ${req.body.id}`);

  const { id } = req.body;
  const { favorite } = users.find(user => user.id === id);

  res.send(favorite.map(list => musics.find(music => music.title === list)));
});

// get music type list
app.post('/typelist', (req, res) => {
  console.log(`[POST] typelist ${req.body.id}`);

  const { type } = req.body;

  let lenderList;
  if (type === 'all') lenderList = musics;
  else if (type === 'top10') lenderList = musics.sort((music1, music2) => music2.totalCount - music1.totalCount).slice(0, 10);
  else lenderList = musics.filter(music => music.type === type);

  res.send(lenderList);
});

// add playlist
app.post('/addplaylist', (req, res) => {
  console.log(`[POST] addplaylist ${req.body.id}`);

  const { id, title } = req.body;

  let newPlaylist = users.find(user => user.id === id).playlist;
  const userIndex = users.findIndex(user => user.id === id);

  newPlaylist = [...newPlaylist, title];
  users[userIndex].playlist = newPlaylist;

  res.send(users[userIndex].playlist.map(list => musics.find(music => music.title === list)));
});

// add favorite
app.post('/addfavorite', (req, res) => {
  console.log(`[POST] addfavorite ${req.body.id}`);

  const { id, title } = req.body;

  let newFavorite = users.find(user => user.id === id).favorite;
  const userIndex = users.findIndex(user => user.id === id);

  newFavorite = [...newFavorite, title];
  users[userIndex].favorite = newFavorite;

  res.send(users[userIndex].favorite.map(list => musics.find(music => music.title === list)));
});

// delete playlist
app.patch('/deleteplaylist', (req, res) => {
  console.log(`[PATCH] delete playlist ${req.body.id}`);

  const { id, deleteIndex } = req.body;

  let newPlaylist = users.find(user => user.id === id).playlist;

  const userIndex = users.findIndex(user => user.id === id);

  newPlaylist = newPlaylist.filter((_, i) => i !== deleteIndex);
  users[userIndex].playlist = newPlaylist;

  res.send(users[userIndex].playlist.map(list => musics.find(music => music.title === list)));
});

// patch playlist
app.patch('/patchplaylist', (req, res) => {
  console.log(`[PATCH] patch playlist ${req.body.id}`);

  const { id, index, isUp } = req.body;

  const newPlaylist = users.find(user => user.id === id).playlist;
  const userIndex = users.findIndex(user => user.id === id);
  let newIndex = 0;

  if (isUp) {
    newIndex = index - 1;
    if (newIndex < 0) newIndex = 0;
  } else {
    newIndex = index + 1;
    if (newIndex > newPlaylist.length - 1) newIndex = newPlaylist.length - 1;
  }

  const splicedMusic = newPlaylist.splice(index, 1);
  newPlaylist.splice(newIndex, 0, splicedMusic[0]);

  users[userIndex].playlist = newPlaylist;

  res.send(users[userIndex].playlist.map(list => musics.find(music => music.title === list)));
});

// patch favorite
app.patch('/patchfavorite', (req, res) => {
  console.log(`[PATCH] patch favorite ${req.body.id}`);

  const { id, index, isUp } = req.body;

  const newFavorite = users.find(user => user.id === id).favorite;
  const userIndex = users.findIndex(user => user.id === id);
  let newIndex = 0;

  if (isUp) {
    newIndex = index - 1;
    if (newIndex < 0) newIndex = 0;
  } else {
    newIndex = index + 1;
    if (newIndex > newFavorite.length - 1) newIndex = newFavorite.length - 1;
  }

  const splicedMusic = newFavorite.splice(index, 1);
  newFavorite.splice(newIndex, 0, splicedMusic[0]);

  users[userIndex].favorite = newFavorite;

  res.send(users[userIndex].favorite.map(list => musics.find(music => music.title === list)));
});

// delete favorite
app.patch('/deletefavorite', (req, res) => {
  console.log(`[PATCH] patch favorite ${req.body.id}`);

  const { id, deleteIndex } = req.body;
  // deleteIndex = +deleteIndex;

  let newFavorite = users.find(user => user.id === id).favorite;
  const userIndex = users.findIndex(user => user.id === id);

  newFavorite = newFavorite.filter((_, i) => i !== deleteIndex);
  users[userIndex].favorite = newFavorite;

  res.send(users[userIndex].favorite.map(list => musics.find(music => music.title === list)));
});

// payment
app.get('/key', (req, res) => {
  console.log('[GET] key');
  res.send(key);
});

app.post('/confirm', (req, res) => {
  console.log('[POST] confirm');

  const { id, data } = req.body;

  BootpayRest.setConfig(
    key.rest_id,
    key.private_key
  );

  BootpayRest.getAccessToken().then(function (response) {
    // Access Token을 발급 받았을 때
    if (response.status === 200 && response.data.token !== undefined) {
      BootpayRest.verify(data.receipt_id).then(function (_response) {
        // 검증 결과를 제대로 가져왔을 때
        if (_response.status === 200) {
          const newUserData = users.find(user => user.id === id);
          const userIndex = users.findIndex(user => user.id === id);
          newUserData.premium = true;
          users[userIndex] = newUserData;
          console.log('결제성공');
          res.send({ id: users[userIndex].id, name: users[userIndex].name, premium: users[userIndex].premium, playlist: users[userIndex].playlist, favorite: users[userIndex].favorite, email: users[userIndex].email });
        } else {
          res.send(undefined);
        }
      });
    }
  }).catch((err) => console.log(err));
});

app.listen(9000, () => console.log('Simple Rest API Server listening on port 9000'));
