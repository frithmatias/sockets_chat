import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;
  public usuario: Usuario;

  constructor(
    private socket: Socket,
    private router: Router
  ) {
    // metodos necesarios cuando la clase es instanciada por primera vez.
    this.cargarStorage();
    this.checkStatus();
  }

  // ESTADO DEL SERVIDOR

  checkStatus() {
    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
      this.socketStatus = true;
    });
    this.socket.on('disconnect', () => {
      console.log('Desconectado al servidor');
      this.socketStatus = false;
    });
  }

  // EMITIR EVENTOS

  emit(evento: string, payload?: any, callback?: Function) {
    this.socket.emit(evento, payload, callback);
  }

  // ESCUCHAR CUALQUIER EVENTO 
  listen(evento: string) {
    return this.socket.fromEvent(evento);
  }

  // LOGIN 

  loginWS(nombre: string) {
    console.log('Login: ', nombre);
    return new Promise((resolve, reject) => {
      this.emit('configurar-usuario', { nombre }, resp => {
        console.log('Respuesta del backend', resp);
        this.usuario = new Usuario(nombre);
        this.guardarStorage();
        resolve();
      });
    });
  }

  logoutWS() {
    this.usuario = null;
    localStorage.removeItem('usuario');

    const payload = {
      nombre: 'sin-nombre'
    };

    this.emit('configurar-usuario', payload, () => { }); // Un callback vacío a fuerza porque me lo pide.
    this.router.navigate(['/']); // Cualquier ruta lo manda al login.
  }

  getUsuario() {
    return this.usuario;
  }

  guardarStorage() {
    localStorage.setItem('usuario', JSON.stringify(this.usuario));
  }

  cargarStorage() {
    if (localStorage.getItem('usuario')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.loginWS(this.usuario.nombre);
    }
  }
}
