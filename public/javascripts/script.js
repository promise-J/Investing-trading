window.addEventListener("resize", updateBrowserDimensions);

function updateBrowserDimensions() {
  let vh = window.innerHeight;
  let vw = window.innerWidth;
  console.log(vh);
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  document.documentElement.style.setProperty("--vw", `${vw}px`);
}

updateBrowserDimensions();
