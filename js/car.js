class Coche {
    constructor(datos) {
        this.datos = datos;
        this.velocidad = 0;
        this.rpm = 0;
        this.nivelNitro = 100;
        this.direccion = 0;
        this.derrape = 0;
        this.geometria = new THREE.BoxGeometry(2.2, 1.1, 4.8);
        this.material = new THREE.MeshStandardMaterial({ color: 0xff2222, metalness: 0.8, roughness: 0.2 });
        this.malla = new THREE.Mesh(this.geometria, this.material);
        this.malla.castShadow = true;
        this.malla.receiveShadow = true;
        escena.add(this.malla);
    }
    actualizar(delta, controles) {
        // Lógica de aceleración, frenado, suspensión y colisiones
        if(controles.acelerar) this.velocidad += this.datos.aceleracion * delta * 5;
        this.velocidad = Math.max(-15, Math.min(this.datos.velocidad * 50, this.velocidad));
        this.malla.position.z -= this.velocidad * delta;
    }
}

