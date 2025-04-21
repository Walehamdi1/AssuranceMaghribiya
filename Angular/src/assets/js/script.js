'use strict';




/**
 * add event on element
 */




const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}


document.addEventListener("DOMContentLoaded", function () {
  let footer = document.querySelector(".footer");
  
  function revealFooter() {
      let windowHeight = window.innerHeight;
      let footerTop = footer.getBoundingClientRect().top;
      
      if (footerTop < windowHeight - 50) {
          footer.classList.add("show");
      }
  }

  window.addEventListener("scroll", revealFooter);
  revealFooter(); // Exécuter au chargement
});



/**
 * navbar toggle
 */

const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);



/**
 * header sticky & back top btn active
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const headerActive = function () {
  if (window.scrollY > 150) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", headerActive);

let lastScrolledPos = 0;

const headerSticky = function () {
  if (lastScrolledPos >= window.scrollY) {
    header.classList.remove("header-hide");
  } else {
    header.classList.add("header-hide");
  }

  lastScrolledPos = window.scrollY;
}

addEventOnElem(window, "scroll", headerSticky);



/**
 * scroll reveal effect
 */

const sections = document.querySelectorAll("[data-section]");

const scrollReveal = function () {
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].getBoundingClientRect().top < window.innerHeight / 2) {
      sections[i].classList.add("active");
    }
  }
}

scrollReveal();

addEventOnElem(window, "scroll", scrollReveal);

document.addEventListener('DOMContentLoaded', function() {
  let currentIndex = 0;  // L'index de l'image actuellement affichée
  const images = document.querySelectorAll('.has-bg-image > div');  // Récupérer toutes les images

  function changeImage() {
      // Calculer l'index suivant, en revenant à zéro après la dernière image
      currentIndex = (currentIndex + 1) % images.length;

      // Déplacer l'élément visible vers le haut en fonction de l'index actuel
      const offset = -currentIndex * 100;  // Chaque image occupe 100% de la hauteur

      // Appliquer la transformation pour créer l'effet de défilement
      images.forEach((image, index) => {
          image.style.transform = `translateY(${offset}%)`;
          image.style.transition = 'transform 1s ease';  // Transition fluide
      });
  }




  



  // Changer d'image toutes les 4 secondes
  setInterval(changeImage, 4000); // Défilement tous les 4 secondes
});
