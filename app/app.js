(function(){

var $  = document.getElementById.bind(document);
var $$ = document.querySelectorAll.bind(document);

var App = function($el){
  this.$el = $el;
  this.load();

  this.$el.addEventListener(
    'submit', this.submit.bind(this)
  );

  if (this.dobSet) {
    this.renderAgeLoop();
  } else {
    this.renderChoose();
  }
};

App.fn = App.prototype;

App.fn.load = function(){
  var x;

  this.documentCircle = document.querySelector('#circles');

  var tempDoB = localStorage.dob;
  if( tempDoB != 'null') {
    this.dob = new Date(parseInt(tempDoB));
  }

  var currentDate = new Date;
  var oneDay = 24*60*60*1000;

  var diffDays = Math.round(Math.abs((this.dob.getTime() - currentDate.getTime())/(oneDay)));
  var numberMonths = Math.floor(diffDays/30);
  var fractionOfMonth = (diffDays%30)/30.0;

  var tempDoBSet = localStorage.dobSet;
  if( tempDoBSet != 'null') {
    this.dobSet = "YES";
  }

  this.generateCircleLoop(numberMonths, 1, 60, '#311B92');
  this.generateCircleLoop(numberMonths, 61, 120, '#1A237E');
  this.generateCircleLoop(numberMonths, 121, 156, '#0D47A1');
  this.generateCircleLoop(numberMonths, 157, 204, '#006064');
  this.generateCircleLoop(numberMonths, 205, 252, '#004D40');
  this.generateCircleLoop(numberMonths, 253, 792, '#1B5E20');
  this.generateCircleLoop(numberMonths, 793, 945, '#33691E');

};

App.fn.generateCircleLoop = function(numberMonths, firstCount, secondCount, bkgdColor) {
  var x;
  if( numberMonths > secondCount ) {
    for(x = firstCount ; x <= secondCount ; x++) {
      this.createCircle( bkgdColor, '1.00');
    }
  }
  else if( numberMonths > (firstCount-1) && numberMonths <= secondCount ){
    for(x = firstCount ; x < numberMonths ; x++) {
      this.createCircle(bkgdColor, '1.00');
    }
    for(x = numberMonths ; x <= secondCount ; x++) {
      this.createCircle(bkgdColor, '0.15');
    }
  }
  else
  {
    for(x = firstCount ; x <= secondCount ; x++) {
      this.createCircle(bkgdColor, '0.15');
    }
  }
};

App.fn.createCircle = function(bkgdColor, opacity) {
  var circle = document.createElement('div');
  circle.className = 'circle';
  circle.style.backgroundColor = bkgdColor;
  circle.style.opacity = opacity;
  this.documentCircle.appendChild(circle);
};

App.fn.save = function(){
  if (this.dob)
    localStorage.dob = this.dob.getTime();
    localStorage.dobSet = this.dobSet;
};

App.fn.submit = function(e){
  e.preventDefault();

  var input = this.$$('input')[0];
  if ( !input.valueAsDate ) return;

  this.dob = input.valueAsDate;
  this.dobSet = "YES";
  this.save();

  location.reload();
};

Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = (this.getDate()+1).toString();
   return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
  };

App.fn.renderChoose = function(){
  this.html(this.view('dob')());
  if( this.dob != 'null' ) {
    var test = this.dob.yyyymmdd();
    document.getElementById('dobField').value = this.dob.yyyymmdd();
  }
};

App.fn.renderAgeLoop = function(){
  this.interval = setInterval(this.renderAge.bind(this), 100);
};

App.fn.renderAge = function(){
  var now       = new Date
  var duration  = now - this.dob;
  var years     = duration / 31556900000;

  var majorMinor = years.toFixed(9).toString().split('.');

  requestAnimationFrame(function(){
    this.html(this.view('age')({
      year:         majorMinor[0],
      milliseconds: majorMinor[1]
    }));
    document.getElementById('reset').onclick = function(){
      this.dobSet = null;
      localStorage.dobSet = null;
      location.reload();
    };
    document.getElementById('reset').style.opacity = '1';
  }.bind(this));
};

App.fn.$$ = function(sel){
  return this.$el.querySelectorAll(sel);
};

App.fn.html = function(html){
  this.$el.innerHTML = html;
};

App.fn.view = function(name){
  var $el = $(name + '-template');
  return Handlebars.compile($el.innerHTML);
};

window.app = new App($('app'))

})();


(function() {
  window.onresize= function() {
    var div = document.querySelector('#circles');
    circle.style.height= div.childNodes[0].offsetWidth+'px';
  }

  var styleSheets = document.styleSheets,
      circle,
      i, j;

  for(i = 0 ; i < styleSheets.length ; i++) {
    rules= styleSheets[i].rules ||
           styleSheets[i].cssRules;
    for(j = 0 ; j < rules.length ; j++) {
      if(rules[j].selectorText==='.circle') {
        circle= rules[j];
        break;
      }
    }
  }
})();

window.onresize();
