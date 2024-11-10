// Variable declarations
const menu = document.querySelector(".menu");
const canvas = document.querySelector(".canvas");
const pencil = document.querySelector("#pencil");
const eraser = document.querySelector("#eraser");
const color = document.querySelector("#color");
const random = document.querySelector("#random");
const menuBtn = document.querySelector("#menubtn");
const gridSize = document.querySelector("#gridSize");
const makeGrid = document.querySelector("#makeGrid");
const MIN_GRID_SIZE = 16;
const MAX_GRID_SIZE = 100;

// 1st
// generate default grid of size 32
parsegrid(canvas);

// Change grid size
makeGrid.addEventListener("click", function () {
  const size = +gridSize.value;
  if (size >= MIN_GRID_SIZE && size <= MAX_GRID_SIZE) {
    parsegrid(canvas, size);
  } else {
    alert(`
      Given input for Grid Size is Invalid!
      Min = 16 (Default Size)
      Max = 100
    `);
    gridSize.value = 16;
  }
});

// ==================================================
// ============= HELPER FUNCTION SECTION ============
// ==================================================
// -
// This function takes two parameter
// 1 an ref to a node and 2nd size to make cells
function parsegrid(canvas, size = MIN_GRID_SIZE) {
  // making grid with css
  canvas.setAttribute(
    "style",
    `grid-template-columns: repeat(${size}, 1fr); 
    grid-template-rows: repeat(${size}, 1fr);`
  );

  // making child elements
  let html_childs = "";
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      html_childs += `
      <div class="cell" 
      data-cellref="R${i + 1}C${j + 1}">
      </div>`;
    }
  }

  canvas.innerHTML = html_childs;
  cell_click_events();
}

// This is project related function and specific to the project
function cell_click_events() {
  // make input to canvas
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell) => {
    cell.addEventListener("click", function (e) {
      if (pencil.checked) {
        let currentColor = color.value;
        if (random.checked) {
          currentColor = generateRandomColor();
        }
        e.target.setAttribute("style", `background-color:${currentColor}`);
      } else if (eraser.checked) {
        e.target.setAttribute("style", `background-color:#ffffff`);
      }
    });
  });
}

// Creates random color in rgba format
function generateRandomColor() {
  const MAX_COLOR_WAVE_LENGTH = 255;
  const R = Math.floor(Math.random() * MAX_COLOR_WAVE_LENGTH);
  const G = Math.floor(Math.random() * MAX_COLOR_WAVE_LENGTH);
  const B = Math.floor(Math.random() * MAX_COLOR_WAVE_LENGTH);
  const A = Math.random();
  return `rgb(${R}, ${G}, ${B}, ${A})`;
}

// ==================================================
// ============= ANIMATION SETUP ====================
// ==================================================
// Styling for menu popup
menuBtn.addEventListener("click", function () {
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
