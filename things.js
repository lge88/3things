
var svgEl = document.getElementById('chart');

function loadData(url, cb) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 200) cb(null, JSON.parse(req.responseText));
      else cb({ msg: 'request to ' + url + ' failed.' });
    }
  };
  req.open('GET', url);
  req.send();
}

function drawUnderline(size, shrink, g) {
  var l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  var hfSize = 0.5*size;
  var shrinked = shrink*hfSize;
  l.setAttribute('x1', -shrinked);
  l.setAttribute('y1', -hfSize);
  l.setAttribute('x2', shrinked);
  l.setAttribute('y2', -hfSize);
  l.setAttribute('stroke', 'black');
  l.setAttribute('stroke-width', 1);
  g.appendChild(l);
}

function drawCircle(size, g) {
  var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  var hfSize = 0.5*size;
  c.setAttribute('cx', 0);
  c.setAttribute('cy', 0);
  c.setAttribute('r', hfSize);
  c.setAttribute('stroke', 'black');
  c.setAttribute('fill', 'none');
  g.appendChild(c);
}

function drawCross(size, g) {
  var l1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  var l2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  var hfSize = 0.5*size;
  var w = hfSize*Math.cos(Math.PI/4);

  l1.setAttribute('x1', -w);
  l1.setAttribute('y1', -w);
  l1.setAttribute('x2', w);
  l1.setAttribute('y2', w);
  l1.setAttribute('stroke', 'black');
  l1.setAttribute('stroke-width', 1);

  l2.setAttribute('x1', -w);
  l2.setAttribute('y1', w);
  l2.setAttribute('x2', w);
  l2.setAttribute('y2', -w);
  l2.setAttribute('stroke', 'black');
  l2.setAttribute('stroke-width', 1);

  g.appendChild(l1);
  g.appendChild(l2);
}

// value - 0
function drawUnderlines(data, svgEl) {
  data.accomplishments.forEach(function(a) {
    var done = a.done;
    if (done.indexOf("0") !== -1)
      drawUnderline(a.size, 0.7, a.g);
  });
}

// value - 1
function drawCircles(data, svgEl) {
  data.accomplishments.forEach(function(a) {
    var done = a.done;
    if (done.indexOf("1") !== -1)
      drawCircle(a.size*0.7, a.g);
  });
}

// value - 2
function drawCrosses(data, svgEl) {
  data.accomplishments.forEach(function(a) {
    var done = a.done;
    if (done.indexOf("2") !== -1)
      drawCross(a.size*0.7, a.g);
  });
}

function visualizeData(data, svgEl) {
  drawUnderlines(data, svgEl);
  drawCircles(data, svgEl);
  drawCrosses(data, svgEl);
}

function parseDate(data) {
  data.accomplishments.forEach(function(a) {
    a.date = new Date(a.date);
  });
  return data;
}

function getWeek(d) {
  var onejan = new Date(d.getFullYear(),0,1);
  return Math.ceil((((d - onejan) / 86400000) + onejan.getDay()+1)/7);
}

function dateToXY(data, size, spacing) {
  data.accomplishments.forEach(function(a) {
    var d = a.date;
    var i = d.getDay();
    var j = getWeek(d);
    a.x = i * size + (i+1)*spacing;
    a.y = j * size + (j+1)*spacing;
    a.size = size;
  });
  return data;
}

function createGroups(data) {
  data.accomplishments.forEach(function(a) {
    var x = a.x;
    var y = a.y;
    var size = a.size;
    a.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    a.g.setAttribute('transform', 'translate(' + [x+0.5*size, y+0.5*size] + ') scale(1, -1)');
    svgEl.appendChild(a.g);
  });
  return data;
}


loadData('data/things-lge.json', function(err, data) {
  if (err) {
    console.log(err);
    return;
  }

  data = parseDate(data);
  data = dateToXY(data, 22, 4);
  data = createGroups(data);

  visualizeData(data, svgEl);
});
