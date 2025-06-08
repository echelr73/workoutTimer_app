export class Progress {
    Id: number;
    StudentId: number;
    ExerciseName: string;
    MuscleGroup: string;
    Measure: number;
    Date: string; 

    constructor() {
        this.StudentId = 0;
        this.ExerciseName = '';
        this.MuscleGroup = '';
        this.Measure = 0;
        this.Date = '01/01/2025';
    }
}