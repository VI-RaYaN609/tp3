const inputs = document.querySelectorAll(".input")
const form = document.querySelector("form")
const lock = document.querySelectorAll(".passlock")
const check = document.querySelector("#check")
const alive = 1 
function Incorrect(){
    document.querySelector(".WRONG").innerHTML = "Passwords do not match ! Try again"
}
function Register(){
    form.addEventListener("submit",event=>{event.preventDefault()})
    if( inputs[2].value != inputs[3].value ) {
        Incorrect()
        return
    }
    if (String(inputs[0].value).trim()==``){
        document.querySelector(".WRONG").innerHTML = `Username cannot be empty`
        return
    }
    if(inputs[0].value!="" && inputs[1].value!=""){
        createCookie(`username`,inputs[0].value,999)
        createCookie(`email`,inputs[1].value,999)
        createCookie(`password`,inputs[2].value,999)
        createCookie(`balance`,0.10,999)
        createCookie(`loginstate`,"true",1)
        document.querySelector(".WRONG").innerHTML=``
    }
    console.log("All Cookies = ",document.cookie)
    setTimeout(()=>{window.location.href="store.html"},900)
}
function Login(){
    form.addEventListener("submit",event=>{event.preventDefault()})
    const username = inputs[0].value
    const password = inputs[1].value
    if(username==getCookie("username") && password==getCookie("password")){
        createCookie(`loginstate`,"true",1)
        createCookie("rememberme",`${check.checked}`,1)
        window.location.href="store.html"
    }
    else{
        document.querySelector(".WRONG").innerHTML = "Incorrect Username or Password"
    }
}
function changePassword(){
    form.addEventListener("submit",event=>{event.preventDefault()})
    const username = inputs[0].value
    if ( username!=getCookie("username")){
        document.querySelector(".WRONG").innerHTML = `Wrong Username`
        return
    }
    if ( inputs[2].value != inputs[3].value) {
        Incorrect()
        return
    }
    if ( inputs[2].value == ``){
        document.querySelector(".WRONG").innerHTML = `New Password cannot be empty`
        return
    }
    const newPassword = inputs[2].value;
    createCookie("password",newPassword,999)
    document.querySelector(".WRONG").innerHTML = `Password Changed Successfully`
    setTimeout(() => {
        window.location.href="login.html"
    }, 1500);
}
function createCookie(name,value,alive){
    const date = new Date()
    date.setTime(date.getTime()+(alive*24*60*60*1000))
    let expires="expires="+date.toUTCString()
    document.cookie=`${name}=${value};${expires};path=/`
}
function deleteCookie(cookieName) {
    createCookie(cookieName,null,null)
}
function getCookie(cookieName){
    const decoded = decodeURIComponent(document.cookie).split("; ");//split cookie into an array
    let result
    decoded.forEach(cookie=>{
        if(cookie.indexOf(cookieName)==0){
            result= cookie.substring(cookieName.length+1)
        }
    })
    return result
}

document.addEventListener("DOMContentLoaded",()=>{
    deleteCookie("loginstate")
    let username = getCookie("username")
    let password = getCookie("password")
    inputs[0].value=``
    if(username!=null && password!=null && getCookie("rememberme")=="true"){
        inputs[0].value= username
        inputs[1].value= password
    }
    
    //Password locks
    lock.forEach( e => {
    e.addEventListener("click",()=>{
        if(e.classList=="bx bxs-lock passlock"){
            e.classList='bx bxs-lock-open passlock'
            inputs[e.getAttribute("data-i")].type="text"
        }
        else{
            e.classList='bx bxs-lock passlock'
            inputs[e.getAttribute("data-i")].type="password"
        }
        })
    })
    console.log(document.cookie)
})