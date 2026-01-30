
export interface Question {
  id: number;
  title: string;
  body: string;
  userId: number;
  createdByEmail: string;
  createdByDisplayName: string;
  isFlagged: boolean;
  isDeleted: boolean;
  dateDeleted: string | null;  
  dateCreated: string;
  dateUpdated: string;
}