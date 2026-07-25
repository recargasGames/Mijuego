class SistemaFisica {
    constructor() {
        this.mundo = new CANNON.World();
        this.mundo.gravity.set(0, -9.82, 0);
        this.mundo.broadphase = new CANNON.SAPBroadphase(this.mundo);
        this.mundo.allowSleep = true;
    }
    actualizar(delta) { this.mundo.step(1/60, delta, 3); }
    crearSuelo(ancho, largo) {
        const suelo = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: new CANNON.Material() });
        suelo.quaternion.setFromEuler(-Math.PI/2, 0, 0);
        this.mundo.addBody(suelo);
    }
}
