export class Student {
    Id: number;
    Name: string;
    Height: number;
    Weight: number;
    Birthdate: string;

    constructor() {
        this.Name = '';
        this.Height = 0;
        this.Weight = 0;
        this.Birthdate = '01/01/2025';
    }
}