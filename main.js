var layers = {
    land: L.tileLayer('https://opencache{s}.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}', {
        // bounds: [
        //     [5.322054, 60.391263]
        //     [6.465313, 60.658534]
        // ],
        tileSize: 256,
        minzoom: 1,
        maxzoom: 18,
        attribution: '©Kartverket',
        subdomains: ['', '2', '3'],
    }),
    simple: L.tileLayer('https://opencache{s}.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}', {
        // bounds: [
        //     [5.322054, 60.391263]
        //     [6.465313, 60.658534]
        // ],
        tileSize: 256,
        minzoom: 1,
        maxzoom: 18,
        attribution: '©Kartverket',
        subdomains: ['', '2', '3'],
    }),
    sea: L.tileLayer('https://opencache{s}.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=sjokartraster&zoom={z}&x={x}&y={y}', {
        // bounds: [
        //     [5.322054, 60.391263]
        //     [6.465313, 60.658534]
        // ],
        tileSize: 256,
        minzoom: 1,
        maxzoom: 18,
        attribution: '©Kartverket',
        subdomains: ['', '2', '3'],
    })
}

var currentLayer = layers.land;
var map = L.map('map', {
    center: [60.6, 7.5],
    zoom: 8,
    maxBounds: [
        [73.3, -10.5],
        [54, 46]
    ],
    attributionControl: true,
    zoomControl: false,
    layers: [currentLayer],
});
map.attributionControl.setPrefix(false);

L.control.zoom({
    position: 'topright',
}).addTo(map);

L.control.scale({
    imperial: true,
}).addTo(map);

function switchLayer(name) {
    map.removeLayer(currentLayer);
    currentLayer = layers[name];
    map.addLayer(currentLayer);
    slideout.toggle();
}

// Slideout
function close(eve) {
    eve.preventDefault();
    slideout.close();
}

var slideout = new Slideout({
    panel: document.getElementById('panel'),
    menu: document.getElementById('menu'),
    padding: 256,
    tolerance: 70
})

slideout
    .on('beforeopen', function () {
        this.panel.classList.add('panel-open');
    })
    .on('open', function () {
        this.panel.addEventListener('click', close);
    })
    .on('beforeclose', function () {
        this.panel.classList.remove('panel-open');
        this.panel.removeEventListener('click', close);
    });

document.querySelector('.toggle-button').addEventListener('click', function () { slideout.toggle() });

document.querySelector('.land').addEventListener('click', function () { switchLayer('land') });
document.querySelector('.simple').addEventListener('click', function () { switchLayer('simple') });
document.querySelector('.sea').addEventListener('click', function () { switchLayer('sea') });