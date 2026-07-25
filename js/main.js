// VARIABLES GLOBALES
let escena, camara, renderizador, fisica, jugador, mapa;
let reloj = new THREE.Clock();
let tiempoAnterior = 0;
let cargado = false;

// LISTA DE COCHES DISPONIBLES
const catalogoCoches = [
    { id: 'nissan_gtr', nombre: 'Nissan GT-R', velocidad: 9.2, aceleracion: 8.8, frenado: 7.5, manejo: 8.0, precio: 120000 },
    { id: 'toyota_supra', nombre: 'Toyota Supra', velocidad: 8.9, aceleracion: 9.0, frenado: 7.2, manejo: 8.5, precio: 95000 },
    { id: 'bmw_m4', nombre: 'BMW M4', velocidad: 8.5, aceleracion: 8.3, frenado: 8.0, manejo: 9.2, precio: 110000 },
    { id: 'audi_r8', nombre: 'Audi R8', velocidad: 9.0, aceleracion: 8.7, frenado: 8.5, manejo: 8.2, precio: 140000 },
    { id: 'lamborghini_huracan', nombre: 'Lamborghini Huracán', velocidad: 9.5, aceleracion: 9.3, frenado: 7.8, manejo: 7.9, precio: 220000 },
    { id: 'ferrari_488', nombre: 'Ferrari 488', velocidad: 9.4, aceleracion: 9.1, frenado: 8.2, manejo: 8.1, precio: 250000 },
    { id: 'mclaren_720s', nombre: 'McLaren 720S', velocidad: 9.7, aceleracion: 9.5, frenado: 8.3, manejo: 8.0, precio: 300000 },
    { id: 'ford_mustang', nombre: 'Ford Mustang', velocidad: 8.2, aceleracion: 8.5, frenado: 6.8, manejo: 7.0, precio: 75000 }
];

// INICIO DEL JUEGO
async function iniciarJuego() {
    // Inicializar sistemas
    escena = new THREE.Scene();
    fisica = new SistemaFisica();
    mapa = new GeneradorMapa();
    jugador = new Jugador();

    // Configurar cámara y renderizado
    configurarCamara();
    configurarRenderizador();
    configurarIluminacion();
    
    // Cargar recursos
    await cargarRecursos();
    mapa.generarMundoAbierto();
    jugador.seleccionarCoche(catalogoCoches[0]);

    // Ocultar carga y mostrar menú
    setTimeout(() => {
        gsap.to('#pantallaCarga', { opacity: 0, duration: 0.8, onComplete: () => {
            document.getElementById('pantallaCarga').style.display = 'none';
            document.getElementById('interfaz').classList.remove('oculto');
            cargado = true;
            bucleJuego();
        }});
    }, 1500);
}

// CONFIGURACIONES BÁSICAS
function configurarRenderizador() {
    renderizador = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderizador.setSize(window.innerWidth, window.innerHeight);
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderizador.shadowMap.enabled = true;
    renderizador.shadowMap.type = THREE.PCFSoftShadowMap;
    renderizador.toneMapping = THREE.ACESFilmicToneMapping;
    renderizador.toneMappingExposure = 1.2;
    document.body.appendChild(renderizador.domElement);
    window.addEventListener('resize', () => {
        camara.aspect = window.innerWidth / window.innerHeight;
        camara.updateProjectionMatrix();
        renderizador.setSize(window.innerWidth, window.innerHeight);
    });
}

function configurarIluminacion() {
    // Luz ambiental
    const luzAmbiental = new THREE.AmbientLight(0x4060a0, 0.5);
    escena.add(luzAmbiental);

    // Sol con sombras
    const sol = new THREE.DirectionalLight(0xfff8dc, 1.3);
    sol.position.set(150, 250, 100);
    sol.castShadow = true;
    sol.shadow.mapSize.width = 4096;
    sol.shadow.mapSize.height = 4096;
    escena.add(sol);

    // Niebla dinámica
    escena.fog = new THREE.FogExp2(0x88aadd, 0.0008);
}

async function cargarRecursos() {
    const barra = document.getElementById('progresoCarga');
    const texto = document.getElementById('textoCarga');
    const pasos = ['Inicializando motor 3D', 'Cargando físicas', 'Preparando mapa', 'Cargando vehículos', 'Finalizando...'];
    
    for(let i = 0; i < pasos.length; i++) {
        texto.textContent = pasos[i];
        barra.style.width = `${(i+1)*20}%`;
        await new Promise(res => setTimeout(res, 400));
    }
}

// BUCLE PRINCIPAL
function bucleJuego() {
    requestAnimationFrame(bucleJuego);
    const tiempo = reloj.getElapsedTime();
    const delta = Math.min(tiempo - tiempoAnterior, 0.1);
    tiempoAnterior = tiempo;

    if(cargado && jugador.enJuego) {
        fisica.actualizar(delta);
        jugador.actualizar(delta);
        actualizarUI();
        controlarDerrape(jugador.coche, delta);
        actualizarNitro(jugador.coche, delta);
    }

    renderizador.render(escena, camara);
}

// FUNCIONES DE INICIO DE MODOS
function iniciarMundoLibre() {
    document.getElementById('menuPrincipal').classList.add('oculto');
    document.getElementById('hud').classList.remove('oculto');
    if(esDispositivoMovil()) document.getElementById('controlesMovil').classList.remove('oculto');
    jugador.enJuego = true;
}

// INICIAR EL JUEGO AL CARGAR LA PÁGINA
window.addEventListener('load', iniciarJuego);
      
