// Variable declarations
const menu = document.querySelector(".menu");
const button = document.querySelector("#menubtn");
// Styling for menu popup
button.addEventListener("click", function () {
  if (this.dataset.status == 0) {
    menu.classList.add("animate");
    this.dataset.status = 1;
    this.innerText = "CLOSE";
  } else if (this.dataset.status == 1) {
    this.dataset.status = 0;
    this.innerText = "MENU";

    menu.classList.add("remove");
    setTimeout(() => {
      menu.classList.remove("animate");
      menu.classList.remove("remove");
    }, 500);
  }
});
