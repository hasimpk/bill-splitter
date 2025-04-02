export interface Resident {
  id: string;
  name: string;
  apartmentId: string;
  startDate: string;
  endDate?: string;
}

export interface Home {
  id: string;
  number: string;
  residents: number;
  daysStayed: number;
}

export interface Story {
  floor: number;
  homes: Home[];
}

export interface Tower {
  id: string;
  name: string;
  stories: Story[];
}

export interface BillCalculation {
  towerId: string;
  towerName: string;
  floor: number;
  homeNumber: string;
  residents: number;
  daysStayed: number;
  share: number;
}