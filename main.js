window.globalDataContainer = {};

init();

function init() {
  var directoryStr = getDirectoryAsJson();
  globalDataContainer.directory = JSON.parse(directoryStr);
  var nameNrMapStr = getPkmnNameNrMap();
  globalDataContainer.nameNrMap = JSON.parse(nameNrMapStr);
  var nrNameMapStr = getPkmnNrNameMap();
  globalDataContainer.nrNameMap = JSON.parse(nrNameMapStr);
  var nrPathMapStr = getPathByNrMap();
  globalDataContainer.nrPathMap = JSON.parse(nrPathMapStr);

  initAutocomplete();
  initDropdown();
}

function displayChosenPkmns(nr) {
  document.getElementById("imgSelectContainer").innerHTML = "";
  var foundImages = globalDataContainer.nrPathMap[nr];
  console.dir(foundImages);
  for(var entry in foundImages){
    var img = document.createElement("img");
    img.src = globalDataContainer.nrPathMap[nr][entry];
    document.getElementById("imgSelectContainer").appendChild(img);
  }
}

function findImgByNr(obj, nr, currPathArr, imgs) {
  if (obj["_t"] === "f") { //If type is file
    if (obj["_p"] === (nr)) {
      console.log(obj);
      var path = currPathArr.join("/");
      return [path + nr + ".png"];
    }
  }
  if (obj["_t"] === "d" && obj.hasOwnProperty("c")) { //If type is directory and has children
    for (var child in obj["c"]) {
      currPathArr.push(obj["_p"]);
      var foundImg = findImgByNr(obj["c"][child], nr, currPathArr, imgs);
      if (foundImg) {
        currPathArr.pop();
        imgs.push(foundImg)
        return imgs;
      }
    }
  }
  return null;
};

function insertImgIntoContainer(obj) {
  //console.log(obj[i]);
}

function nameToNr(name) {
  return globalDataContainer.nameNrMap[name];
}

function initDropdown() {
  var dropdown = document.getElementById("dropdown");
  dropdown.length = 0;
  let defaultOption = document.createElement("option");
  defaultOption.text = "Choose Pokemon";
  dropdown.add(defaultOption);
  dropdown.selectedIndex = 0;

  for (var nr in globalDataContainer.nrNameMap) {
    option = document.createElement("option");
    option.text = "#" + nr + " - " + globalDataContainer.nrNameMap[nr];
    option.value = nr;
    dropdown.add(option);
  }
  dropdown.onchange = function() {
    var nr = document.getElementById("dropdown").value;
    displayChosenPkmns(nr);
  }
}

function initAutocomplete() {
  var inp = document.getElementById("autocompleteInput");
  var arr = []
  for (var name in globalDataContainer.nameNrMap) {
    arr.push(name);
  }

  var currentFocus;
  inp.addEventListener("input", function(e) {
    var a, b, i, val = this.value;
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    for (i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        b.addEventListener("click", function(e) {
          inp.value = this.getElementsByTagName("input")[0].value;
          nr = nameToNr(inp.value);
          displayChosenPkmns(nr);
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  inp.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) { //up
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function(e) {
    closeAllLists(e.target);
  });
}
