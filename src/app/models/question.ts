
export interface Question {
  id: number;
  title: string;
  body: string;
  userId: number;
  createdBy: string; 
  isFlagged: boolean;
  dateCreated: string;
  dateUpdated: string;  
}