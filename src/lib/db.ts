
import Dexie, { Table } from 'dexie';

export interface Project {
  id?: number;
  name: string;
  planUrl: string;
  createdAt: Date;
}

export interface Point {
  id?: number;
  projectId: number;
  number: number;
  x: number;
  y: number;
  title: string;
  photoUrl?: string;
  description: string;
  createdAt: Date;
}

export class PlanPointDB extends Dexie {
  projects!: Table<Project>;
  points!: Table<Point>;

  constructor() {
    super('planpoint');
    this.version(1).stores({
      projects: '++id, name, planUrl, createdAt',
      points: '++id, projectId, number, x, y, title, photoUrl, description, createdAt'
    });
  }
}

export const db = new PlanPointDB();
