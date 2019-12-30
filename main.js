
init();

function init(){
  var jsonStr = getDirectoryAsJson();
  var json = JSON.parse(jsonStr);
  console.dir(json);

  document.getElementById("testimg").src = "src/crystal/2.png";
}
