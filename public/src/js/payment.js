import * as signin from "./signin.js";

const myStorage = window.localStorage;

// 결제모듈
const startPay = async (e) => {
  const { data } = await axios.get('/key');
  const key = data;

  BootPay.request({
    price: '3000',
    application_id: key.application_id,
    name: 'Baam player 월정기권',
    pg: '',
    method: '',
    show_agree_window: 0,
    items: [
      {
        item_name: 'Baam player 월정기권',
        qty: 1, //수량
        unique: '123', // 해당 상품을 구분짓는 primary key
        price: 3000, // 상품 단가
        cat1: '이용권' // 대표 상품의 카테고리 상, 50글자 이내
        // cat2: '티셔츠', // 대표 상품의 카테고리 중, 50글자 이내
        // cat3: '라운드 티', // 대표상품의 카테고리 하, 50글자 이내
      }
    ],
    user_info: {
      username: '유성균',
      email: 'ysungkyun@gmail.com',
      addr: '',
      phone: '010-1234-4567'
    },
    order_id: '123456789',
    params: { callback1: '그대로 콜백받을 변수 1', callback2: '그대로 콜백받을 변수 2', customvar1234: '변수명도 마음대로' },
    account_expire_at: '2020-05-25',
    extra: {
      start_at: '2020-05-10',
      end_at: '2022-05-10',
      vbank_result: 1,
      quota: '0,2,3'
    }
  }).error((data) => {
    // 결제 에러시 진행
  }).cancel((data) => {
    // 결제 취소시 진행
  }).ready((data) => {
    // 가상계좌 발급시 진행
  }).confirm((data) => {
    // 결제 진행 전 요건 확인 (재고 확인 같은것)
    var enable = true;
    if (enable) {
      BootPay.transactionConfirm(data);
    } else {
      BootPay.removePaymentWindow();
    }
  }).close((data) => {
    // 결제창이 닫힐 때 작동 (결제 성공, 실패 안가림)

  }).done(async (data) => {
    // 결제 완료시 작동
    const id = myStorage.getItem('id');
    let confirm = await axios.post('/confirm', { id, data });
    confirm = confirm.data;
    if (!confirm) return;
    signin.setUserInfo(id, confirm.name, confirm.premium, confirm.email);
    signin.renderUserInfo();
  });
};

export {
  startPay
};
