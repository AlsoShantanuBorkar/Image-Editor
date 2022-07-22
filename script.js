// Query Selectors
const fileInput = document.querySelector(".file-input");

const chooseImg = document.querySelector(".choose-img");

const previewImg = document.querySelector(".preview-img img");

const filterName = document.querySelector(".filter-info .name");

const filterOptions = document.querySelectorAll(".filter button");

const filterSlider = document.querySelector(".slider input");

const filterValue = document.querySelector(".filter-info .value");

const rotateOptions = document.querySelectorAll(".rotate button");

const resetFilterBtn = document.querySelector(".reset-filter");

const saveBtn = document.querySelector(".save-img");

// Preset Values
let brightness = 100,
  saturation = 100,
  inversion = 0,
  grayscale = 0;

let rotate = 0;
let flipHorizontal = 1;
let flipVertical = 1;

// Functions:

// Apply Filter Function
const applyFilters = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal} , ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};

// Load Selected Image onto Page
const loadImage = () => {
  let file = fileInput.files[0]; // Storing User Selected File
  if (!file) return; // If not selected return
  previewImg.src = URL.createObjectURL(file); // Creating URL for user selected file and passing it to src of preview-image
  previewImg.addEventListener("load", () => {
    resetFilterBtn.click();
    document.querySelector(".container").classList.remove("disable");
  }); // Removing Disable Class when image is loaded
};

// Adding Event Listeners for Each Option
filterOptions.forEach((options) => {
  options.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active"); //remove active class from non selected option
    options.classList.add("active"); //add active class to selected option
    filterName.innerText = options.innerText;

    if (options.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (options.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (options.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});

// Update Function
const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector(".filter .active");

  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilters();
};

// Adding Event Listeners for Each Options
rotateOptions.forEach((selectedOption) => {
  selectedOption.addEventListener("click", () => {
    if (selectedOption.id === "left") {
      rotate -= 90;
    } else if (selectedOption.id === "right") {
      rotate += 90;
    } else if (selectedOption.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else if (selectedOption.id === "vertical") {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilters();
  });
});

// Reset Function
const resetFilter = () => {
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  filterOptions[0].click();
  applyFilters();
};

// Save Image Function
const saveImage = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = previewImg.naturalWidth;
  canvas.height = previewImg.naturalHeight;

  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotate != 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.scale(flipHorizontal, flipVertical);
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  const link = document.createElement("a");
  link.download = "image.jpg";
  link.href = canvas.toDataURL();
  link.click();
};

// Event Listeners
fileInput.addEventListener("change", loadImage);
chooseImg.addEventListener("click", () => fileInput.click());
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveBtn.addEventListener("click", saveImage);
