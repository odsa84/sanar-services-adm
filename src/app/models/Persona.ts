export class Persona {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
    telefono: string;
    email: string;
    password: string;

    getEmail() {
        return this.email;
    }
}