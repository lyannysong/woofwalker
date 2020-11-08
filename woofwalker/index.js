
// Detect request animation frame
var scroll = window.requestAnimationFrame ||
             // IE Fallback
             function(callback){ window.setTimeout(callback, 1000/60)};
var elementsToShow = document.querySelectorAll('.show-on-scroll'); 

function loop() {

  elementsToShow.forEach(function (element) {
    if (isElementInViewport(element)) {
      element.classList.add('is-visible');
    } else {
      element.classList.remove('is-visible');
    }
  });

  scroll(loop);
}

// Call the loop for the first time
loop();

// Helper function from: http://stackoverflow.com/a/7557433/274826
function isElementInViewport(el) {
  // special bonus for those using jQuery
  if (typeof jQuery === "function" && el instanceof jQuery) {
    el = el[0];
  }
  var rect = el.getBoundingClientRect();
  return (
    (rect.top <= 0
      && rect.bottom >= 0)
    ||
    (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.top <= (window.innerHeight || document.documentElement.clientHeight))
    ||
    (rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
  );
}

/* weather API */

function getLocation() {
    // console.log("getting location");
    if (navigator.geolocation) {
        console.log("getting location")
        // navigator is a tool provided by browsers that allows JavaScript to request and get a user's location, this line checks if the browser supports navigator functionality
        navigator.geolocation.getCurrentPosition(getWeather, weatherError, {
        timeout: 10000
        }); // get the user's geolocation and then pass it to the getWeather function, if it errors, we'll handle the error with the weatherError function
    } else {
        document.getElementById("weather").innerHTML =
        "<h1>Your browser does not support geolocation!<h2>"; // inform the user that their browser does not support geolocation
    }
}



function getWeather(position) {

    console.log("get weather")
    // console.log(position.coords.latitude, position.coords.longitude)
    
    let lat = position.coords.latitude
    let long = position.coords.longitude

    fetch(`https://dark-sky.p.rapidapi.com/${lat},${long}?lang=en&units=auto`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "dark-sky.p.rapidapi.com",
            "x-rapidapi-key": "80cc283ce3msh858e9b66a03a471p1d7875jsn85c2b4a59f76"
        }    
    })
    .then(res => res.json())
    .then(res => {
        console.log(res)
        // log temperature
        console.log(res.currently.temperature)
        // log summary
        console.log(res.currently.summary)

        // insert temperature into the temp div
        let tempDiv = document.querySelector('#temp-num')
        tempDiv.innerText = res.currently.temperature

        // insert summary into the summary div
        let summaryDiv = document.querySelector('#summary')
        summaryDiv.innerText = res.currently.summary

    })
    .catch(err => {
        console.log(err);
    });
    
}

function weatherError(error) {
    console.error(error); // log the error to the console
}



getLocation()


// nav animation

const tlNav = gsap.timeline({
  scrollTrigger:{
    delay: 1,
    trigger: '.ps-main-nav',
    start: "center bottom",
    scrub: true,
    end: "+=350"
  }
})

tlNav.from('.menu-col', {y: 300, opacity:0, duration:3, stagger:0.2}) 

// modal recipe
const Recipe = {
  rootEl: document.querySelector("#treatrecipes"),
  init: () => {
    Notify.init();
}}



// render recipe fnc
function showRecipeModal(recipeIndex) {

  // get json data
  fetch('treatrecipes.json')
  .then(res => res.json())
  .then(res => {
    
    const recipeData = res[recipeIndex]
    console.log(recipeData)

    const template = document.getElementById('template-recipe').innerHTML;
    const rendered = Mustache.render(template, recipeData);
    
    Modal.show(rendered);

  })
  

}

const recipeBtns = document.querySelectorAll('.recipe')
recipeBtns.forEach(btn => {
  const recipeIndex = btn.getAttribute('data-recipe-index')
  btn.addEventListener('click', () => {
    showRecipeModal(recipeIndex)
  })
  
})

 const Modal = {
  showCloseBtn: true,
  show:(content) => {
    // create overlayDiv
    let overlayDiv = document.createElement('div');
    overlayDiv.className = 'modal-overlay';
  
    // append to rootEl
  Recipe.rootEl.appendChild(overlayDiv);

    // create modalDiv
    let modalDiv = document.createElement('div');
    modalDiv.className = 'modal';


    // create modalContent
    let modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // insert content
    modalContent.innerHTML = content;

    // create modalCloseBtn
    let modalCloseBtn = document.createElement('button');
    modalCloseBtn.className = 'modal-close-btn';
    modalCloseBtn.innerHTML = '&times;';

    // append modalContent to modalDiv
    modalDiv.appendChild(modalContent);

    if(Modal.showCloseBtn === true){
      modalDiv.appendChild(modalCloseBtn);
    }

    // append modalDiv to rootEl
    Recipe.rootEl.appendChild(modalDiv);

    // animate modalDiv entrance using anime.js

  
    anime({
      targets: modalDiv,
      keyframes: [
        {opacity: 0, top: '60%', duration: 0},
        {opacity: 1, top: '50%', duration: 500, easing: 'linear'}
      ]
    })

    // add evernt listener to modalCloseBtn
    modalCloseBtn.addEventListener('click', (e) => {
      Modal.remove();
    });

    // add esc key press function to trigger Modal.remove()
    Modal.modalEscKey = (e) => {
      if(e.keyCode == 27){
        console.log("Esc");
        Modal.remove();
        
      } 
    }
    // listen for esc key press
    document.addEventListener('keydown', Modal.modalEscKey);

  },

  remove: () => {
    // get modalDiv and overlayDiv
    let overlayDiv = document.querySelector('.modal-overlay');
    let modalDiv = document.querySelector('.modal');

    // overlayDiv exit animation
    anime({
      targets: overlayDiv,
      opacity: 0,
      duration: 300,
      easing: 'linear',
      complete: () => {
        overlayDiv.remove();
      }
    });

    // modalDiv exit animation
    anime({
      targets: modalDiv,
      opacity: 0,
      duration: 300,
      top: '60%',
      complete: () => {
        modalDiv.remove();
      }
    });

    // stop listening to esc key
    document.removeEventListener('keydown', Modal.modalEscKey);
  }
 }

 //slideshow
 function currentDiv(n) {
  showDivs(slideIndex = n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" w3-opacity-off", "");
  }
  x[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " w3-opacity-off";
}

// modal story
const Story = {
  rootEl: document.querySelector("#doggostories"),
  init: () => {
    Notify.init();
}}



// render story fnc
function showStoryModal(storyIndex) {

  // get json data
  fetch('story.json')
  .then(res => res.json())
  .then(res => {
    
    const storyData = res[storyIndex]
    console.log(storyData)

    const template = document.getElementById('template-story').innerHTML;
    const rendered = Mustache.render(template, storyData);
    
    Modal.show(rendered);

  })
  

}

const storyBtns = document.querySelectorAll('.circle')
storyBtns.forEach(btn => {
  const storyIndex = btn.getAttribute('data-story-index')
  btn.addEventListener('click', () => {
    showStoryModal(storyIndex)
  })
  
})

// collapsible recipe

var coll = document.getElementsByClassName("show");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var showlater = this.nextElementSibling;
    if (showlater.style.display === "block") {
      showlater.style.display = "none";
    } else {
      showlater.style.display = "block";
      const showmorerecipe = gsap.timeline({
        onStart:{
          delay: 0,
          trigger: '.showlater',
          start: "center bottom",
          end: "+=350"
        }
      })
      
      showmorerecipe.from('.showlater', {y: 300, opacity:0, duration:1, stagger:0.2}) 
    }
  });
}

// animate show recipe



// change show button innerhtml
function showFunction() {
  var x = document.getElementById("showtext");
  if (x.innerHTML === "SHOW MORE") {
    x.innerHTML = "SHOW LESS";
  } else {
    x.innerHTML = "SHOW MORE";
  }
}

// validate calculator form
function validateForm() {
  var dn = document.getElementById("dogname").value;
  var dntrue = false; //did user put dog name
  var dur = document.getElementById("duration").value;
  var durtrue = false; // did user put duration
  var z = false; // did user select a size
  if(document.getElementById("small").disabled || document.getElementById("medium").disabled|| document.getElementById("large").disabled){
    z =true; 
  }
  if (dn != "") {
    dntrue =true;
  }
  if (dur != "") {
    durtrue =true;
  }
  if(dntrue&& durtrue && z){
    document.getElementById("myBtn").disabled = false;
  }
  if(!dntrue|| !durtrue || !z){
    document.getElementById("myBtn").disabled = true;
  }
  
}

//calculator size button function

function small() {
  document.getElementById("medium").disabled = true;
  document.getElementById("large").disabled = true;
  validateForm();
}

function medium() {
  document.getElementById("small").disabled = true;
  document.getElementById("large").disabled = true;
  validateForm();
}

function large() {
  document.getElementById("small").disabled = true;
  document.getElementById("medium").disabled = true;
  validateForm();
}

function clear1(){
  document.getElementById("medium").disabled = false;
  document.getElementById("large").disabled = false;
  document.getElementById("small").disabled = false;
}


//load bar
var i = 0;
function move() {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("myBar");
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }

  setTimeout(function() { calcoutput(); }, 1000);
}

// calculate output
function calcoutput(){
  var dogname = document.getElementById("dogname").value;
  var dogsize = 0;
  var duration = document.getElementById("duration").value;
  var sduration= 210;
  var mduration = 280;
  var lduration = 350;
  var enoughwalk = 0;
  var enough = false;
  //find dog size
  if(!document.getElementById("small").disabled){
    dogsize = 1;
  }
  if(!document.getElementById("medium").disabled){
    dogsize = 2;
  }
  if(!document.getElementById("large").disabled){
    dogsize = 3;
  }
  //calculate walk
  if(dogsize == 1){
    enoughwalk = duration-sduration;
  }
  if(dogsize == 2){
    enoughwalk = duration-mduration;
  }
  if(dogsize == 3){
    enoughwalk = duration-lduration;
  }

  if(enoughwalk >= 0){
    enough = true;
  }else{
    enough =false;
  }
  displaywalkresults(dogname, enough, enoughwalk);
}
function displaywalkresults(dogname, enough, enoughwalk){
  
  if (enough){
    document.getElementById("walkresults").innerHTML = dogname+ " has enough walk" +"<br />" +
    ""
  }
  if (!enough){
    document.getElementById("walkresults").innerHTML = dogname+ " needs " +-enoughwalk+ " minutes more walk" +"<br />" +
    ""
  }
}