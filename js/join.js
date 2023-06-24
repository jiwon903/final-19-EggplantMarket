const nextButton = document.querySelector('#next-btn');
const inps = document.querySelectorAll('.join-email input');
const email = document.querySelector('#email');
const pw = document.querySelector('#pw');

// 이메일 비밀번호 입력 후 포커스 잃으면 형식 및 유효성 검사
let validPw = false;
let validEmail = false; 

inps.forEach(item => {
    item.addEventListener('change', async () => {
        if(item.id === 'email'){
            item.value = item.value.trim();
        }
        await validateJoin(item)

        // email 형식에 맞고 가입 가능한 이메일 && pw 길이 맞으면 => 버튼 활성화
        if (validEmail && validPw) {
            console.log('다 통과했는디')
            nextButton.disabled = false;
        } else {
            nextButton.disabled = true;
        }
    })
})

async function validateJoin(target) {

    // email validation
    if (target.type === 'email') {
        const msg = await validateEmail();

        console.log(msg);
        document.querySelector('.warning-msg-email').textContent = '*' + msg.message;
        document.querySelector('.warning-msg-email').style.display = 'block';
        if (msg.status == 422 || msg.message === '이미 가입된 이메일 주소 입니다.') {
            validEmail = false;
        } else {
            validEmail = true;
        }
    }

    // pw validation
    if (target.type === 'password') {
        if (target.validity.tooShort) {
            document.querySelector(`.warning-msg-pw`).style.display = 'block'
            pw.style.borderBottom = '1px solid red';
            validPw = false
        } else {
            document.querySelector(`.warning-msg-pw`).style.display = 'none'
            pw.style.borderBottom = '1px solid #f2f2f2';
            validPw = true;
        }
    }
}

// 다음버튼 누르면 프로필설정 폼으로 변경
nextButton.addEventListener('click', (e) => {
    e.preventDefault()
    document.querySelector('.join-email').style.display = 'none';
    document.querySelector('.profile-setting').style.display = 'block';
})


// api 연동 
async function validateEmail() {
    const url = "https://api.mandarin.weniv.co.kr";
    const reqPath = "/user/emailvalid";
    const emailData = {
        "user": {
            "email": email.value
        }
    }
    const res = await fetch(url + reqPath, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(emailData)
    })
    const json = await res.json();
    return json;
}

// // SUCCESS
// // 사용 가능한 이메일인 경우
// {
//     "message": "사용 가능한 이메일 입니다."
// }

// // 가입한 이메일이 있는 경우
// {
//     "message": "이미 가입된 이메일 주소 입니다."
// }

// 이메일 형식에 맞지 않는 경우
// {
//     "message": "잘못된 이메일 형식입니다.",
//     "status" : 422
// }

// // FAIL
// {
//     "message": "잘못된 접근입니다."
// }