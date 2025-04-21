// src/app/models/user.model.ts
export class User {
    id: number;
    name: string;
    email: string;
  
    constructor(id: number = 0, name: string = '', email: string = '') {
      this.id = id;
      this.name = name;
      this.email = email;
    }
  }
  