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
  var foundImages = globalDataContainer.nrPathMap[nr];
  var sorted = sortImgPathsByGeneration(foundImages);
  writeImageListToPage(sorted);
}

function writeImageListToPage(sortedImgPaths) {
  document.getElementById("imgSelectContainer").innerHTML = "";
  for (var index in sortedImgPaths) {
    var img = document.createElement("img");
    img.src = sortedImgPaths[index];
    document.getElementById("imgSelectContainer").appendChild(img);
  }
}

function sortImgPathsByGeneration(paths) {
  var obj = {
    rgby: [],
    gsc: [],
    rse: [],
    frlg: [],
    dppt: [],
    hgss: []
  };
  for (var index in paths) {
    var path = paths[index];
    if (contains(path, ["firered", "leafgreen"])){
      obj.frlg.push(path)
    }
    else if (contains(path, ["red", "green", "blue", "yellow"])){
      obj.rgby.push(path)
    }
    else if (contains(path, ["heartgold", "soulsilver"])){
      obj.hgss.push(path)
    }
    else if (contains(path, ["gold", "silver", "crystal"])){
      obj.gsc.push(path)
    }
    else if (contains(path, ["ruby", "sapphire", "emerald"])){
      obj.rse.push(path)
    }
    else if (contains(path, ["diamond", "pearl", "platinum"])){
      obj.dppt.push(path)
    }

  }
  console.dir(obj);
  return obj.rgby.concat(obj.gsc, obj.rse, obj.frlg, obj.dppt, obj.hgss);
}

function contains(target, pattern){
    var value = 0;
    pattern.forEach(function(word){
      value = value + target.includes(word);
    });
    return (value > 0)
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
