/* Architecture docs - mermaid init + UI */
mermaid.initialize({
  startOnLoad: true,
  theme: 'base',
  themeVariables: {
    darkMode: false,
    background: '#ffffff',
    primaryColor: '#c8dede',
    primaryTextColor: '#0d2626',
    primaryBorderColor: '#1a4d4d',
    lineColor: '#1a4d4d',
    secondaryColor: '#e8e4de',
    tertiaryColor: '#f3f1ed',
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: '15px',
    noteBkgColor: '#e8e4de',
    noteTextColor: '#1c1b1a',
    noteBorderColor: '#b5a89a',
    actorBorder: '#1a4d4d',
    actorBkg: '#c8dede',
    actorTextColor: '#0d2626',
    actorLineColor: '#1a4d4d',
    signalColor: '#1c1b1a',
    signalTextColor: '#1c1b1a',
    labelBoxBkgColor: '#e8e4de',
    labelBoxBorderColor: '#b5a89a',
    labelTextColor: '#1c1b1a',
    loopTextColor: '#1a4d4d',
    activationBorderColor: '#1a4d4d',
    activationBkgColor: '#c8dede',
    sequenceNumberColor: '#ffffff',
    edgeLabelBackground: '#f3f1ed',
    clusterBkg: '#e8e4de',
    clusterBorder: '#b5a89a',
    titleColor: '#1c1b1a',
    classText: '#0d2626',
  },
  flowchart: { curve: 'basis', padding: 20 },
  sequence: { mirrorActors: false, bottomMarginAdj: 10 },
});

// Add expand buttons to diagrams after Mermaid renders
window.addEventListener('load', function() {
  document.querySelectorAll('.diagram-wrap').forEach(function(wrap) {
    var btn = document.createElement('button');
    btn.className = 'expand-btn';
    btn.title = 'Expand diagram';
    btn.innerHTML = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"/></svg>';
    btn.onclick = function() { expandDiagram(wrap); };
    wrap.appendChild(btn);
  });
});

// Expand diagram overlay
function expandDiagram(wrap) {
  var svg = wrap.querySelector('svg');
  if (!svg) return;
  var overlay = document.getElementById('diagram-overlay');
  var content = document.getElementById('overlay-content');
  content.innerHTML = '';
  var clone = svg.cloneNode(true);
  clone.style.maxWidth = 'none';
  clone.style.width = 'auto';
  clone.style.height = 'auto';
  content.appendChild(clone);
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOverlay() {
  document.getElementById('diagram-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeOverlay();
});

document.getElementById('diagram-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeOverlay();
});

// Sidebar active section tracking
var navLinks = document.querySelectorAll('#sidebar-nav a');
var sections = document.querySelectorAll('section[id]');

var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      navLinks.forEach(function(link) { link.classList.remove('active'); });
      var active = document.querySelector('#sidebar-nav a[href="#' + entry.target.id + '"]');
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-10% 0px -80% 0px', threshold: 0 });

sections.forEach(function(section) { observer.observe(section); });

// Mobile sidebar toggle
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.querySelector('.sidebar-backdrop').classList.toggle('open');
}

// Close sidebar on nav click (mobile)
navLinks.forEach(function(link) {
  link.addEventListener('click', function() {
    if (window.innerWidth < 1024) {
      document.getElementById('sidebar').classList.remove('open');
      document.querySelector('.sidebar-backdrop').classList.remove('open');
    }
  });
});
