window.addEventListener("resize", updateBrowserDimensions);

function updateBrowserDimensions() {
  let vh = window.innerHeight;
  let vw = window.innerWidth;
  console.log(vh);
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  document.documentElement.style.setProperty("--vw", `${vw}px`);
}

updateBrowserDimensions();

const nav = document.querySelector(".dashboard_nav"),
  overlay = document.querySelector(".overlay"),
  menu = document.querySelector("#menu");

if (menu && overlay && nav) {
  menu.addEventListener("click", (e) => {
    nav.classList.toggle("active");
    overlay.classList.add("show");
    setTimeout(() => {
      overlay.classList.add("active");
    });
  });

  overlay.addEventListener("click", (e) => {
    nav.classList.toggle("active");
    overlay.classList.remove("active");
    setTimeout(() => {
      overlay.classList.remove("show");
    }, 400);
  });
}
