var cart = [];   // [ [ index1,pageNumber1] , [ index2,pageNumber2] , ... ]
var gamedata =[] // [ data1, data2, ... ]
var pageNumber = 1
var pageSize = 20
var counter = 0;
var SlideShowId
let temp=0
function DrawCartContent(cartDROP){
        cartDROP.innerHTML = `<ul class="cart-content"></ul><h2>Check Out</h2>`
        const cartcontent = document.querySelector(".cart-content")
        cartcontent.innerHTML = ``
        for (let i = 0; i < cart.length; i++){
            cartcontent.innerHTML += `<li>${gamedata[cart[i][1]].results[cart[i][0]].name}<button class="remove"onclick="removeFromCart(${cart[i][0]},${cart[i][1]})">Remove</button></li>`
        }
        if(cart.length == 0){ 
            cartDROP.innerHTML = `<ul class="cart-content"><li style="opacity:0.5;display:flex;justify-content:center;font-size:15px">No-content</li></ul>`
        }
}
function AddToCart(index,pageNumber){
    console.log(cart)
    let exists = cart.some(item => item[0] === index && item[1] === pageNumber);
    if(exists){
        alert("This game is already in your cart");
        return;
    }
    cart.push([index,pageNumber]);
    const cartamount= document.querySelector(".cart-amount")
    cartamount.innerHTML = cart.length;
    DrawCartContent(document.querySelector(".cartDrop"))
}
function removeFromCart(index,pageNumber){
    cart.splice(cart.findIndex(item => item[0] === index && item[1] === pageNumber),1);
    const cartamount= document.querySelector(".cart-amount")
    cartamount.innerHTML = cart.length;
    DrawCartContent(document.querySelector(".cartDrop"))
}
function SlideShowView(data,i){
    // slide image every 2.5 seconds
    document.querySelectorAll(".slideshowbut").forEach(button => {
        button.addEventListener('click',()=>{
                const num = parseInt(button.getAttribute("data-num"))
                counter += num;
                if (counter >= data.results[i].short_screenshots.length) counter = 0
                if (counter < 0) counter = data.results[i].short_screenshots.length - 1
                document.querySelector(".SlideShow-Image").src = data.results[i].short_screenshots[counter].image
                document.querySelectorAll(".SlideShow-Small-Image")[counter].classList.add("ACTIVESLIDE")
                document.querySelectorAll(".SlideShow-Small-Image")[temp].classList.remove("ACTIVESLIDE")
                temp = counter
                console.log(document.querySelectorAll(".SlideShow-Small-Image"))
                clearInterval(SlideShowId)
                startInterval()
        })
    })
    // this function is so u can stop interval when user changes slide manually
    function startInterval(){
        SlideShowId = setInterval(()=>{
            counter += 1;
            if (counter >= data.results[i].short_screenshots.length) counter = 0
            if (counter < 0) counter = data.results[i].short_screenshots.length - 1
            document.querySelector(".SlideShow-Image").src = data.results[i].short_screenshots[counter].image
            document.querySelectorAll(".SlideShow-Small-Image")[counter].classList.add("ACTIVESLIDE")
            document.querySelectorAll(".SlideShow-Small-Image")[temp].classList.remove("ACTIVESLIDE")
            temp = counter
        },2500)
    }
    startInterval()
    const small_images=document.querySelector(".SlideShow-Small-Images")
    let j = 0
    data.results[i].short_screenshots.forEach(e =>{
        small_images.innerHTML += `<img data-counter="${j}" class="SlideShow-Small-Image" src="${e.image}">`
        j++
    })  
    // small images code 
    document.querySelectorAll(".SlideShow-Small-Image").forEach(image => {
        image.addEventListener('click',()=>{
            document.querySelector(".SlideShow-Image").src = image.src
            counter = parseInt(image.getAttribute("data-counter"))
            document.querySelectorAll(".SlideShow-Small-Image")[counter].classList.add("ACTIVESLIDE")
            document.querySelectorAll(".SlideShow-Small-Image")[temp].classList.remove("ACTIVESLIDE")
            temp = counter
            clearInterval(SlideShowId)
            startInterval()
        })
    })
    
}
function BackToMainStorePage(){
    document.querySelector(".Single-Game-go-Back").addEventListener("click",()=>{
        document.querySelector("main").classList.replace("newMain","main")
        document.querySelector("main").innerHTML = `<div class="container"></div><button onclick="fetchdata()">Load More</button>`
        pageNumber = 1
        clearInterval(SlideShowId)
        fetchdata()
    })
}
function SingleGamePageView(){
    const game_images = document.querySelectorAll(".game-image")
    game_images.forEach(image=>{
        image.addEventListener('click',()=>{  
            document.querySelector("main").classList.replace("main","newMain")
            const i = image.getAttribute("data-index")
            const pageNumber = image.getAttribute("data-pageNumber")
            const data = gamedata[pageNumber-1]
            document.querySelector("main").innerHTML = `
            <div class="game-content-container">
               <div class="images">
                  <div class="single-game-name">${data.results[i].name}</div>
                  <img class="SlideShow-Image" src="${data.results[i].short_screenshots[0].image}">
                  <div class="SlideShow-buttons">
                     <button class="slideshowbut" id="button1" data-num="-1"><</button>
                     <button class="slideshowbut" id="button2" data-num="1">></button>
                  </div>
                  <div class="SlideShow-Small-Images">
                  </div>
               </div>
               <div class="information-container">
                   <img class="single-game-image"src="${data.results[i].background_image}">
                   <div class="description">
                       <h3 style="display:flex;justify-content:center;">Reviews : ${data.results[i].rating}/5⭐ <p style="font-size:15px;">(${data.results[i].ratings_count})</p></h2>
                       <br>
                       <h3>Release Date : ${data.results[i].released}</h2>
                       <br>
                       <h3>Developer : </h2>
                   </div>
                   <div class="tags"></div>
                   <button class="single-game-addToCart"onclick="AddToCart(${i},${pageNumber-1})">Add To Cart</button>
               </div>
               <div class="Single-Game-go-Back">Go Back</div>
            </div>
            `
            const tags = document.querySelector(".tags")
            tags.innerHTML = ``
            for (let j = 0; j < data.results[i].genres.length; j++) {
             tags.innerHTML += `
              <p>${data.results[i].genres[j].name}</p>
             `
            } 
            SlideShowView(data,i)
            BackToMainStorePage()
                   
        })
    })

}
function fetchdata(){
    const apiKey = 'ca4c16d5fca14dc68685ee99c54358fd';
    fetch('https://api.rawg.io/api/games?key=' + apiKey+`&page=${pageNumber}&page_size=${pageSize}`)
       .then(response => response.json())
       .then(data => {
           console.log(data);
           const container = document.querySelector(".container")
           //all games loading to webpage
           for(let i = 0; i < data.results.length; i++){
             let emojies = ""
             data.results[i].parent_platforms.forEach(platform => {
                if (platform.platform.name == "PlayStation") emojies += `<i class="fa-brands fa-playstation"></i>`
                if (platform.platform.name == "Xbox") emojies += `<i class="fa-brands fa-xbox"></i>`
                if (platform.platform.name == "PC") emojies += `<i class="fa-solid fa-desktop"></i>`
             })
             container.innerHTML += `
             <div class="box">
                <img class="game-image" src="${data.results[i].background_image}" data-index="${i}" data-pageNumber="${pageNumber}">
                <h2 class="game-price">50 $</h2>
                <div class="game-information">
                    <div class="name-price">
                       <h1>${data.results[i].name.slice(0,25)}</h1>
                    </div>
                    <div class="tags"></div>
                    <p class="game-platforms">${emojies}</p>
                    <button class="buy-button"onclick="AddToCart(${i},${pageNumber-1})">Add To Cart</button>
                    <p class="game-release">release: ${data.results[i].released}</p>
                </div>
             </div>
             `
             const tags = document.querySelectorAll(".tags")
             tags[i+20*(pageNumber-1)].innerHTML = ``
             for (let j = 0; j < data.results[i].genres.length; j++) {
              tags[i+20*(pageNumber-1)].innerHTML += `
               <p>${data.results[i].genres[j].name}</p>
              `
             }           
             tags[i+20*(pageNumber-1)].innerHTML += `<p>${data.results[i].rating}/5⭐</p>`
           }
           gamedata.push(data)
           pageNumber += 1 //= Math.floor(Math.random()*100);
           pageSize += 0 // Math.floor(Math.random()*100)+50;
           SingleGamePageView(data)
       })
       .catch(error => {
           console.error('Error:', error);
       });
    
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
console.log(document.cookie);
document.addEventListener("DOMContentLoaded",()=>{
   document.querySelector('.Username').innerHTML = getCookie("username");
   document.querySelector('.balance').innerHTML = `${Number(getCookie("balance")).toFixed(2)} $`
})