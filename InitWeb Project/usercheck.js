document.addEventListener("DOMContentLoaded",() => {
    const cookies = document.cookie.split('; ');
    let state = false;
    for (let cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name == 'loginstate') {
            state = true;
            value = value;
            break;
        }
    }
    if (!state || value != 'true') {
        window.location.href = "login.html";
    }    
})