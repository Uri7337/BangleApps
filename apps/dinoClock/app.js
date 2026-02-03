const storage = require('Storage');
const locale = require("locale");




// add modifiied 4x5 numeric font
(function(graphics) {
  graphics.prototype.setFont4x5NumPretty = function() {
    this.setFontCustom(atob("IQAQDJgH4/An4QXr0Fa/BwnwdrcH63BCHwfr8Ha/"),45,atob("AwIEBAQEBAQEBAQEBA=="),5);
  };
})(Graphics);

// add font for days of the week
(function(graphics) {
  graphics.prototype.setFontDoW = function() {
    this.setFontCustom(atob("///////ADgB//////+AHAD//////gAAAH//////4D8B+A///////4AcAOAH//////4AcAOAAAAAB//////wA4AcAP//////wAAAAAAAA//////4AcAP//////wA4Af//////gAAAH//////5z85+c/OfnOAA4AcAOAH//////4AcAOAAAAAB//////wcAOAHB//////wAAAAAAAA///////ODnBzg5wc4AAAAD//////84OcH//8/+fAAAAAAAAAAAAA/z/5/8/OfnPz/5/8/wAAAD//////84OcH//////AAAAAAAAAAAAA/z/5/8/OfnPz/5/8/wAAAD//////gBwA///////AAAAAAAAAAAAA"),48,24,13);
  };
})(Graphics);


/**
Weather icons from https://icons8.com/icon/set/weather/ios-glyphs
**/
function weatherIcon() {
      return atob("ICCBAAAAAAAAAAAAAAAABAAAABgAAAAwAAAE8AAAGeAAAH/gAAH/wAAH/YAAD3OAADzjAABwhgAB4Q+AA4APgAcAHwAOAD8AHAAmABjwDAAx+BwAM5wYADMMOAAzDHAAM5xgADn44AAY8cAADAOAAA8HAAAD/gAAAPgAAAAAAAAAAAAA");
}

/**
Get weather stored in json file by weather app.
*/
function getWeather() {
  let jsonWeather = storage.readJSON('weather.json');
  return jsonWeather;
}

// timeout used to update every minute
var drawTimeout;

// schedule a draw for the next minute
function queueDraw() {
  if (drawTimeout) clearTimeout(drawTimeout);
  drawTimeout = setTimeout(function() {
    drawTimeout = undefined;
    draw();
  },60000-(Date.now()%60000));
}

// only draw the first time
function drawBg() {
  var bgImg = require("heatshrink").decompress(atob("2E7wINKn///+AEaIVUgIUB//wCs/5CtRXrCvMD8AVTg4LFCv4VZ/iSLCrwWMCrMOAQMPCp7cBCojjFCo/xFgIVQgeHCopABCpcH44Vuh/AQQX/wAV7+F/Cq/nCsw/CCqyvRCvgODCqfAgEDCp4QCSIIVQgIOBDQgGDABX/NgIECCp8HCrM/CgP4CqKaCCqSfCCqq1BCqBuB54VqgYVG/gCECp0BwgCDCp8HgYCDCo/wCo0MgHAjACBj7rDABS1Bv4lBv4rPAAsPCo3+gbbPJAIVFiAXMFZ2AUQsAuAQHiOAgJeEA"));
  g.reset();
  g.drawImage(bgImg,0,101);
}

function square(x,y,w,e) {
  g.setColor("#000").fillRect(x,y,x+w,y+w);
  g.setColor("#fff").fillRect(x+e,y+e,x+w-e,y+w-e);
}

function draw() {
  var d = new Date();
  var h = d.getHours(), m = d.getMinutes();
  h = ("0"+h).substr(-2);
  m = ("0"+m).substr(-2);

  var day = d.getDate(), mon = d.getMonth(), dow = d.getDay();
  day = ("0"+day).substr(-2);
  mon = ("0"+(mon+1)).substr(-2);
  dow = ((dow+6)%7).toString();
  date = day+"."+mon;

  var weatherJson = getWeather();
  var wIcon = weatherIcon();
  var temp;
  if(weatherJson && weatherJson.weather){
      var currentWeather = weatherJson.weather;
      temp = locale.temp(currentWeather.temp-273.15).match(/^(\D*\d*)(.*)$/);
      const code = currentWeather.code||-1;
  }else{
      temp = "";
  }
  g.reset();
  g.clearRect(22,35,153,75);
  g.setFont("4x5NumPretty",8);
  g.fillRect(84,42,92,49);
  g.fillRect(84,60,92,67);
  g.drawString(h,22,35);
  g.drawString(m,98,35);

  g.clearRect(22,95,22+4*2*4+2*4,95+2*5);
  g.setFont("4x5NumPretty",2);
  g.drawString(date,22,95);

  g.clearRect(22,79,22+24,79+13);
  g.setFont("DoW");
  g.drawString(dow,22,79);

  g.drawImage(wIcon,126,81);

  g.clearRect(108,114,176,114+4*5);
  if (temp != "") {
    var tempWidth;
    const mid=126+15;
    if (temp[1][0]=="-") {
      // do not account for - when aligning
      const minusWidth=3*4;
      tempWidth = minusWidth+(temp[1].length-1)*4*4;
      x = mid-Math.round((tempWidth-minusWidth)/2)-minusWidth;
    } else {
      tempWidth = temp[1].length*4*4;
      x = mid-Math.round(tempWidth/2);
    }
    g.setFont("4x5NumPretty",4);
    g.drawString(temp[1],x,114);
    square(x+tempWidth,114,6,2);
  }

  // queue draw in one minute
  queueDraw();
}

g.clear();
drawBg();
Bangle.setUI("clock");  // Show launcher when middle button pressed
Bangle.loadWidgets();
Bangle.drawWidgets();
draw();

