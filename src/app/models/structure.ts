export class Structure {
    Id: number;
    Name: string;
    PreparationTime: number;
    TrainingTime: number;
    RestTime: number;
    Rounds: number;
    Series: number;
    RestBetweenSeries: number;

    constructor() {
        this.Name = '';
        this.PreparationTime = 0;
        this.TrainingTime = 0;
        this.RestTime = 0;
        this.Rounds = 1;
        this.Series = 1;
        this.RestBetweenSeries = 0;
    }
}