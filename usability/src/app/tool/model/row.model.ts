
export class Group {
  public rows: Array<Row>;

  constructor(rows?: Array<Row>) {
    this.rows = rows ? rows : [];
  }

}

export class Row {
  id: number;
  desc: string;
  steps: number;
  importance: number;
  time: number;

  constructor(id?: number, desc?: string, steps?: number, importance?: number, time?: number){
    this.id = id;
    this.desc = desc;
    this.steps = steps;
    this.importance = importance;
    this.time = time;
  }

}
