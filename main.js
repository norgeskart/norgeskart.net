if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceWorker.js', { scope: './' })
        .then(function () {
            if (navigator.serviceWorker.controller) {
                console.log('The service worker is currently handling network operations.');
            } else {
                console.log('Failed to register.');
            }
        });
}

new SmartBanner({
    daysHidden: 15,   // days to hide banner after close button is clicked (defaults to 15)
    daysReminder: 20, // days to hide banner after "VIEW" button is clicked (defaults to 90)
    appStoreLanguage: 'no', // language code for the App Store (defaults to user's browser language)
    title: 'Norgeskart',
    author: 'Norgeskart',
    button: 'VIEW',
    store: {
        ios: 'On the App Store',
        android: 'In Google Play',
        windows: 'In Windows store'
    },
    price: {
        ios: 'FREE',
        android: 'FREE',
        windows: 'FREE'
    }
    // , theme: '' // put platform type ('ios', 'android', etc.) here to force single theme on all device
    // , icon: '' // full path to icon image if not using website icon image
    // , force: 'ios' // Uncomment for platform emulation
});

var layers = {
    land: L.tileLayer('https://opencache{s}.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norgeskart_bakgrunn&zoom={z}&x={x}&y={y}', {
        // bounds: [
        //     [5.322054, 60.391263]
        //     [6.465313, 60.658534]
        // ],
        tileSize: 256,
        minzoom: 1,
        maxzoom: 20,
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
        maxzoom: 20,
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
        maxzoom: 20,
        attribution: '©Kartverket',
        subdomains: ['', '2', '3'],
    })
}

var defaultSettings = {
    center: [60.6, 7.5],
    zoom: 8,
};

var currentLayer = layers.land;
var map = L.map('map', {
    center: defaultSettings.center,
    zoom: defaultSettings.zoom,
    maxBounds: [
        [73.3, -10.5],
        [54, 46]
    ],
    attributionControl: true,
    zoomControl: false,
    layers: [currentLayer],
    maxZoom: 20,
});

map.attributionControl.setPrefix(false);

if (!map.restoreView()) {
    map.setView(defaultSettings.center, defaultSettings.zoom);
}

var hash = new L.Hash(map, layers);

L.control.zoom({
    position: 'topright',
}).addTo(map);

var browserPrint = L.browserPrint({
    position: 'topright',
    hidden: true,
    printModes: ['Portrait', 'Landscape', 'Auto', 'Custom'],
    printModesNames: {
        Portrait: 'Portrait',
        Landscape: 'Landscape',
        Auto: 'Auto',
        Custom: 'Custom',
    },
}).addTo(map);

var printPlugin = L.easyPrint({
    hidden: true,
    sizeModes: ['Current', 'A4Portrait', 'A4Landscape'],
    defaultSize: {
        Current: 'Current Size',
        A4Landscape: 'A4 Landscape',
        A4Portrait: 'A4 Portrait'
    },
    position: 'topright',
    exportOnly: true,
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

document.getElementById('saveLandscape').addEventListener('click', function () { slideout.close(); printPlugin.printMap('A4Landscape page', 'norgeskart'); });
document.getElementById('savePortrait').addEventListener('click', function () { slideout.close(); printPlugin.printMap('A4Portrait page', 'norgeskart'); });

document.getElementById('printLandscape').addEventListener('click', function () { slideout.close(); browserPrint._printLandscape() });
document.getElementById('printPortrait').addEventListener('click', function () { slideout.close(); browserPrint._printPortrait() });
