function esDispositivoMovil() { return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent); }
function convertirKMH(velocidad) { return Math.round(velocidad * 3.6); }
function generarColorAleatorio() { return `hsl(${Math.random()*360}, 80%, 50%)`; }
