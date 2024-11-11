// ===========================================
// ===========VARIABLE DECLARATIONS===========
// ===========================================
const menu = document.querySelector(".menu");
const canvas = document.querySelector(".canvas");
const pencil = document.querySelector("#pencil");
const eraser = document.querySelector("#eraser");
const color = document.querySelector("#color");
const hovermode = document.querySelector("#hovermode");
const random = document.querySelector("#random");
const menuBtn = document.querySelector("#menubtn");
const gridSize = document.querySelector("#gridSize");
const makeGrid = document.querySelector("#makeGrid");
const MIN_GRID_SIZE = 16;
const MAX_GRID_SIZE = 100;

// ********* INITIAL SETUP ******************
parsegrid(canvas);

// IF ANY ATTEMPT HAPPENS TO CHANGE THE GRID SIZE HANDLE IT
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

// *****************************************************************
// BELOW THIS IS MY WRITTEN CODE WHICH TAKE TWO PARAMETER
// CANVAS = A DOM NODE
// SIZE = SIZE OF WHICH, WE NEED GRID
//
// function parsegrid(canvas, size = MIN_GRID_SIZE) {
//   // making grid with css
//   canvas.setAttribute(
//     "style",
//     `grid-template-columns: repeat(${size}, 1fr);
//     grid-template-rows: repeat(${size}, 1fr);`
//   );

//   // making child elements
//   let html_childs = "";
//   for (let i = 0; i < size; i++) {
//     for (let j = 0; j < size; j++) {
//       html_childs += `
//       <div class="cell"
//       data-cellref="R${i + 1}C${j + 1}">
//       </div>`;
//     }
//   }

//   canvas.innerHTML = html_childs;
//   cell_click_events();
// }
// *****************************************************************

// This code is taken from code review of CHAT GPT
// I like the Approach of "DOM fragment" which make
// a temproray place in memory to update DOM for efficiancy
function parsegrid(canvas, size = MIN_GRID_SIZE) {
  // Create a fragment for better performance
  const fragment = document.createDocumentFragment();

  // Set grid styles
  canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  canvas.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  // Create cells and append them to the fragment
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("data-cellref", `R${i + 1}C${j + 1}`);
      fragment.appendChild(cell);
    }
  }

  // Append the fragment to the canvas
  canvas.innerHTML = ""; // Clear any existing cells
  canvas.appendChild(fragment);

  // Bind events to cells
  cell_click_events();
}

// *********************************************************************************
// this is my version of code
//
// function cell_click_events(inputMethod = "click") {
//   // make input to canvas
//   const cells = document.querySelectorAll(".cell");

//   cells.forEach((cell) => {
//     cell.addEventListener(inputMethod, function (e) {
//       if (pencil.checked) {
//         let currentColor = color.value;
//         if (random.checked) {
//           currentColor = generateRandomColor();
//         }
//         e.target.setAttribute("style", `background-color:${currentColor}`);
//       } else if (eraser.checked) {
//         e.target.setAttribute("style", `background-color:#ffffff`);
//       }
//     });
//   });
// }
// *********************************************************************************

// Update cell interaction based on hover mode
function cell_click_events(inputMethod = "click") {
  // Get all the cells in the canvas
  const cells = document.querySelectorAll(".cell");

  // Add event listeners based on the current input method (click or mouseover)
  cells.forEach((cell) => {
    cell.removeEventListener("click", handleCellEvent);
    cell.removeEventListener("mouseover", handleCellEvent);

    if (inputMethod === "mouseover") {
      cell.addEventListener("mouseover", handleCellEvent); // Hover Mode
    } else {
      cell.addEventListener("click", handleCellEvent); // Click Mode
    }
  });
}

// Event handler for cell interactions
function handleCellEvent(e) {
  const cell = e.target;

  // If pencil is selected, apply color
  if (pencil.checked) {
    let currentColor = color.value;
    if (random.checked) {
      currentColor = generateRandomColor(); // Random color if the checkbox is checked
    }
    cell.style.backgroundColor = currentColor;
  }
  // If eraser is selected, clear the cell
  else if (eraser.checked) {
    cell.style.backgroundColor = "#ffffff"; // Erase by setting background to white
  }
}

// Add event listener to hovermode checkbox
hovermode.addEventListener("change", function () {
  // If hovermode is checked, use 'mouseover' event; otherwise, use 'click' event
  if (hovermode.checked) {
    // Change the interaction method to 'mouseover'
    cell_click_events("mouseover");
  } else {
    // Change the interaction method back to 'click'
    cell_click_events("click");
  }
});

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

// =======================================================================
// ===================== DOWNLOAD ART BUTTON =============================
// =======================================================================
// Get the necessary elements
const downloadBtn = document.querySelector("#downloadBtn");

// Function to capture the canvas state and generate an image for download
function downloadArt() {
  // Create a temporary canvas to draw the grid as an image
  const tempCanvas = document.createElement("canvas");
  const context = tempCanvas.getContext("2d");

  // Get the grid size and set the temp canvas size accordingly
  const gridSize = document.querySelectorAll(".cell").length;
  const cells = document.querySelectorAll(".cell");
  const cellSize = cells[0].offsetWidth; // Assuming all cells are the same size

  // Set the size of the temporary canvas to match the grid size
  tempCanvas.width = Math.sqrt(gridSize) * cellSize; // Width
  tempCanvas.height = Math.sqrt(gridSize) * cellSize; // Height

  // Loop through each cell and draw it onto the temporary canvas
  cells.forEach((cell, index) => {
    const row = Math.floor(index / Math.sqrt(gridSize));
    const col = index % Math.sqrt(gridSize);

    // Get the background color of the cell
    const color = window.getComputedStyle(cell).backgroundColor;

    // Draw the color onto the temporary canvas
    context.fillStyle = color;
    context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
  });

  // Convert the canvas to a data URL (image format)
  const imageData = tempCanvas.toDataURL("image/png");

  // Create a temporary download link
  const downloadLink = document.createElement("a");
  downloadLink.href = imageData;
  downloadLink.download = "art.png"; // File name for download
  downloadLink.click(); // Trigger the download
}

// Add event listener to the download button
downloadBtn.addEventListener("click", downloadArt);
