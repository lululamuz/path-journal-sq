/* =====================================================================
   03 — INVISIBLE SYSTEMS : interactive network (SVG)
   Nodes and relationships come from NODES and EDGES in content.js.
   They come from qualitative observation — not measured flows.
   ===================================================================== */
window.Systems = (function () {
  var R = 42;                       // node radius
  var CENTER = { x: 500, y: 350 };
  var svg = document.getElementById('system-map');
  var panel = document.getElementById('panel');
  var byId = {};
  NODES.forEach(function (n) { byId[n.id] = n; });

  var selection = null;             // { type: 'node' | 'edge', id }

  /* ---------- geometry ---------- */
  // Curved line; bending left of travel keeps A→B and B→A apart.
  function edgeGeometry(e) {
    var a = byId[e.from], b = byId[e.to];
    if (a === b) {
      var x = a.x, y = a.y;
      return {
        d: 'M ' + (x - 30) + ' ' + (y + 30) + ' C ' + (x - 200) + ' ' + (y + 175) + ', ' +
           (x + 200) + ' ' + (y + 175) + ', ' + (x + 30) + ' ' + (y + 30),
        lx: x, ly: y + 150
      };
    }
    // Straight line between the two circles. If two systems are linked in
    // both directions, the two lines are shifted apart a little.
    var dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
    var ux = dx / len, uy = dy / len, nx = uy, ny = -ux;
    var twoWay = EDGES.some(function (o) { return o.from === e.to && o.to === e.from; });
    var off = twoWay ? 9 : 0;
    var sx = a.x + ux * (R + 6) + nx * off, sy = a.y + uy * (R + 6) + ny * off;
    var ex = b.x - ux * (R + 12) + nx * off, ey = b.y - uy * (R + 12) + ny * off;
    var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    var lo = twoWay ? 26 : 16;
    return { d: 'M ' + sx + ' ' + sy + ' L ' + ex + ' ' + ey, lx: mx + nx * lo, ly: my + ny * lo + 4 };
  }

  function partPositions(node) {
    var angles, radius;
    if (node.id === 'passengers') {
      // fan sideways so the parts don't collide with the crowding loop
      angles = [192, 166, 14, -12].map(function (d) { return d * Math.PI / 180; });
      radius = 175;
    } else {
      var out = Math.atan2(node.y - CENTER.y, node.x - CENTER.x);
      var spread = 38 * Math.PI / 180;
      angles = node.parts.map(function (_, i) { return out + (i - (node.parts.length - 1) / 2) * spread; });
      radius = 108;
    }
    return node.parts.map(function (label, i) {
      return { label: label, x: node.x + Math.cos(angles[i]) * radius, y: node.y + Math.sin(angles[i]) * radius * 0.85 };
    });
  }

  /* ---------- build the SVG once ---------- */
  var html =
    '<defs>' +
      '<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">' +
        '<path d="M0 1 L9 5 L0 9" fill="none" stroke="rgba(168,186,214,0.32)" stroke-width="1.4"/></marker>' +
      '<marker id="arrow-on" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">' +
        '<path d="M0 1 L9 5 L0 9" fill="none" stroke="#e2b867" stroke-width="1.4"/></marker>' +
    '</defs>';

  EDGES.forEach(function (e) {
    var g = edgeGeometry(e);
    html +=
      '<g class="edge" data-edge="' + e.id + '" tabindex="0" role="button" aria-pressed="false" ' +
        'aria-label="Relationship: ' + e.chain.join(' to ') + '">' +
        '<path d="' + g.d + '" class="edge__hit"/>' +
        '<path d="' + g.d + '" class="edge__line" marker-end="url(#arrow)"/>' +
        '<text x="' + g.lx + '" y="' + g.ly + '" class="edge__label" text-anchor="middle">' + e.chain[1] + '</text>' +
      '</g>';
  });

  html += '<g id="parts"></g>';

  NODES.forEach(function (n) {
    html +=
      '<g class="node" data-node="' + n.id + '" transform="translate(' + n.x + ' ' + n.y + ')" ' +
        'tabindex="0" role="button" aria-pressed="false" aria-label="' + n.label + ' system">' +
        '<circle r="' + R + '" class="node__ring"/>' +
        '<circle r="5" class="node__core"/>' +
        '<text y="' + (R + 26) + '" text-anchor="middle" class="node__label">' + n.label + '</text>' +
      '</g>';
  });

  svg.innerHTML = html;
  var partsLayer = document.getElementById('parts');

  /* ---------- selection state → classes + panel ---------- */
  function connected(nodeId, otherId) {
    return EDGES.some(function (e) {
      return (e.from === nodeId && e.to === otherId) || (e.to === nodeId && e.from === otherId);
    });
  }

  function update() {
    var selNode = selection && selection.type === 'node' ? byId[selection.id] : null;
    var selEdge = selection && selection.type === 'edge'
      ? EDGES.filter(function (e) { return e.id === selection.id; })[0] : null;

    svg.querySelectorAll('.edge').forEach(function (el) {
      var e = EDGES.filter(function (x) { return x.id === el.dataset.edge; })[0];
      var active = selEdge ? selEdge.id === e.id
        : selNode ? (e.from === selNode.id || e.to === selNode.id) : false;
      el.classList.toggle('is-active', active);
      el.classList.toggle('is-dim', !!selection && !active);
      el.setAttribute('aria-pressed', !!selEdge && selEdge.id === e.id);
      el.querySelector('.edge__line').setAttribute('marker-end', active ? 'url(#arrow-on)' : 'url(#arrow)');
    });

    svg.querySelectorAll('.node').forEach(function (el) {
      var id = el.dataset.node;
      var lit = selEdge ? (selEdge.from === id || selEdge.to === id)
        : selNode ? (selNode.id === id || connected(selNode.id, id)) : true;
      el.classList.toggle('is-selected', !!selNode && selNode.id === id);
      el.classList.toggle('is-dim', !lit);
      el.setAttribute('aria-pressed', !!selNode && selNode.id === id);
    });

    // second level: small related parts around the selected node
    partsLayer.innerHTML = selNode ? partPositions(selNode).map(function (p, i) {
      return '<g class="part">' +
        '<line x1="' + selNode.x + '" y1="' + selNode.y + '" x2="' + p.x + '" y2="' + p.y + '" class="part__line"/>' +
        '<circle cx="' + p.x + '" cy="' + p.y + '" r="4" class="part__dot"/>' +
        '<text x="' + p.x + '" y="' + (p.y + 20) + '" text-anchor="middle" class="part__label">' + p.label + '</text>' +
      '</g>';
    }).join('') : '';

    // side panel
    if (!selection) {
      panel.innerHTML =
        '<div class="panel__default">' +
          '<h2 class="systems__question">' + SYSTEMS.heading + '</h2>' +
          '<p>' + SYSTEMS.intro + '</p>' +
          '<p class="panel__hint mono">' + SYSTEMS.hint + '</p>' +
          '<p class="panel__power">' + SYSTEMS.power + '</p>' +
          '<p class="panel__fine">' + SYSTEMS.fine + '</p>' +
        '</div>';
      return;
    }
    if (selNode) {
      var related = EDGES.filter(function (e) { return e.from === selNode.id || e.to === selNode.id; });
      panel.innerHTML =
        '<div class="panel__content">' +
          '<p class="eyebrow eyebrow--accent">System</p>' +
          '<h3 class="panel__title">' + selNode.label + '</h3>' +
          '<p>' + selNode.summary + '</p>' +
          '<ul class="panel__parts">' + selNode.parts.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul>' +
          '<p class="eyebrow">Relationships</p>' +
          '<ul class="panel__relations">' + related.map(function (e) {
            return '<li><button data-pick-edge="' + e.id + '">' + e.chain.join(' → ') + '</button></li>';
          }).join('') + '</ul>' +
        '</div>';
    } else {
      panel.innerHTML =
        '<div class="panel__content">' +
          '<p class="eyebrow eyebrow--accent">Relationship</p>' +
          '<ol class="chain">' + selEdge.chain.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ol>' +
          '<p>' + selEdge.text + '</p>' +
          '<p class="panel__basis mono">Source: ' + selEdge.basis + '</p>' +
        '</div>';
    }
    panel.innerHTML += '<button class="panel__clear" data-clear>Clear selection</button>';
  }

  function pick(type, id) {
    selection = selection && selection.type === type && selection.id === id ? null : { type: type, id: id };
    update();
  }

  /* ---------- events ---------- */
  svg.addEventListener('click', function (e) {
    var node = e.target.closest('[data-node]');
    var edge = e.target.closest('[data-edge]');
    if (node) pick('node', node.dataset.node);
    else if (edge) pick('edge', edge.dataset.edge);
  });
  svg.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var node = e.target.closest('[data-node]');
    var edge = e.target.closest('[data-edge]');
    if (!node && !edge) return;
    e.preventDefault();
    if (node) pick('node', node.dataset.node); else pick('edge', edge.dataset.edge);
  });
  panel.addEventListener('click', function (e) {
    var b = e.target.closest('[data-pick-edge]');
    if (b) pick('edge', b.dataset.pickEdge);
    if (e.target.closest('[data-clear]')) { selection = null; update(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && selection) { selection = null; update(); }
  });

  update();

  return {
    enter: function () {},
    leave: function () { selection = null; update(); }
  };
})();
