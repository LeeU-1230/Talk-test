firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
let ref = db.collection('Users');

let login_account = document.getElementById('login_account');
let login_password = document.getElementById('login_password');
let login_btn = document.getElementById('login_btn');
let create_account = document.getElementById('create_account');
let create_password = document.getElementById('create_password');
let create_name = document.getElementById('create_name');
let creat_btn = document.getElementById('creat_btn');
let talk = document.getElementById('talk');
let login = document.getElementById('login');

let table = document.getElementById('table');
let content = document.getElementById('content');
let po = document.getElementById('po');
let record = document.getElementById('record');
let say_vu;
let ref_talk = db.collection('talk');


login_btn.addEventListener('click', function () {
    let user = {
        email: login_account.value,
        pwd: login_password.value
    };

    firebase.auth().signInWithEmailAndPassword(user.email, user.pwd)
        .then((u) => {
            let date = new Date();              // 取得登入的時間
            let now = date.getTime();

            ref.doc(u.user.uid).update({        // 記錄資訊到 Cloud Firestore
                signup: now,
                email: user.email
            }).then(() => {
                // 登入成功後顯示訊息
                alert(`成功登入`);

                ref.doc(u.user.uid).get().then(
                    function (doc) {
                        login_user = doc.data().name; // 取得此id的用戶暱稱
                        login_id = doc.data().id;
                        console.log(login_user);
                        console.log(login_id);
                    }
                )


                login.style.display = 'none';     // 隱藏登入畫面
                talk.style.display = 'block';     // 顯示聊天介面
                get_ref();                        // 取得聊天資料紀錄
            });
        }).catch(err => {
            // 登入失敗時顯示錯誤訊息
            alert(err.message);
        });

    login_account.value = '';
    login_password.value = '';
})

creat_btn.addEventListener('click', function () {

    let user = {
        email: create_account.value,
        pwd: create_password.value,
        name: create_name.value
    };

    firebase.auth().createUserWithEmailAndPassword(user.email, user.pwd)
        .then((u) => {
            console.log(u.user.uid);
            // 取得註冊當下的時間
            let date = new Date();
            let now = date.getTime();

            // 記錄相關資訊到 Cloud Firestore
            ref.doc(u.user.uid).set({
                id: u.user.uid,
                signup: now,
                email: user.email,
                name: user.name
            }).then(() => {
                // 儲存成功後顯示訊息
                alert('使用者建立完成');
            });
        }).catch(err => {
            // 註冊失敗時顯示錯誤訊息
            alert(err.message);
        });

    create_account.value = '';
    create_password.value = '';
    create_name.value = '';
})


let login_user;   // 登入user的暱稱
let login_id;     // 登入user的id

// 取得聊天資料紀錄
function get_ref() {
    ref_talk.onSnapshot(function (querySnapshot) {
        let data = [];

        // forEach遍歷
        querySnapshot.forEach(function (doc) {
            data.push(doc.data());
        });

        // sort重新排序
        let newdata = data.sort(function (a, b) {
            return a.timeCode - b.timeCode;
        })

        // 輸出到畫面上
        Printing(newdata);
        // 載入時捲動至最底              
        record.scrollTo(0, record.scrollHeight);
    });
}

// 輸出到畫面上
function Printing(data) {                                                   // 輸出呈現
    let str = '';
    for (let i = 0; i < data.length; i++) {

        // 聊天為當前用戶，設置樣式
        if (data[i].id == login_id) {
            str += `<li class="self list-group-item row">
            <div><span class='self_say'>${data[i].title}</span></div>
            <span class='msg_time'>${(new Date(data[i].timeCode)).getMonth() + 1}/${(new Date(data[i].timeCode)).getDate()}, ${(new Date(data[i].timeCode)).getHours()}:${(new Date(data[i].timeCode)).getMinutes()}</span>
            </li>`
        } else {
            str += `<li class="gust list-group-item row">
            <span class='msg_name'>${data[i].name} : </span>
            <div><span class='gust_say'>${data[i].title}</span></div>
            <span class='msg_time'>${(new Date(data[i].timeCode)).getMonth() + 1}/${(new Date(data[i].timeCode)).getDate()}, ${(new Date(data[i].timeCode)).getHours()}:${(new Date(data[i].timeCode)).getMinutes()}</span>
            </li>`
        }
    }
    record.innerHTML = str;
}