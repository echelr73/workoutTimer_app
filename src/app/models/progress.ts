export class Progress {
    Id: number;
    StudentId: number;
    ExerciseName: string;
    MuscleGroup: string;
    Measure: string;
    Date: string; 

    constructor() {
        this.StudentId = 0;
        this.ExerciseName = '';
        this.MuscleGroup = '';
        this.Measure = '';
        this.Date = '01/01/2025';
    }
}