
po.addEventListener('click', function (e) {  // 發送訊息
    e.preventDefault();
    let vu = content.value.trim();
    let say_arr = (vu).split('>');
    say_vu = say_arr[0];

    let date = new Date();
    let now = date.getTime();

    let msg = {
        id: login_id,               // user的id
        name: login_user,           // user的暱稱
        title: say_vu,              // 訊息內容
        timeCode: now               // 訊息發布的時間
    }

    writing(msg);                   // 儲存發送的聊天資訊
    get_ref();                      // 取得聊天資料紀錄
    content.value = '';
})

function writing(msg) {  
    ref_talk.add({       // 儲存發送的聊天資訊
        id: msg.id,
        name: msg.name,
        title: msg.title,
        timeCode: msg.timeCode
    })
    // .then(
    //     () => {
    //         alert(`成功`);
    //     }
    // ).catch(
    //     err => {
    //         alert(err.message);
    //     }
    // )
}

back.addEventListener('click', function (e) {     // 返回登入頁面
    location.reload()
})

content.addEventListener('keydown', function (e) {
    if (e.keyCode == 13) {
        po.click();
    }
})

