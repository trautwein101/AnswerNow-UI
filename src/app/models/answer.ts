
export interface Answer{
    id: number;
    questionId: number;
    body: string;
    userId: number;
    createdBy: string;
    upVotes: number;
    downVotes: number;
    isFlagged: boolean;
    voteScore: number;
    dateCreated: string;
    dateUpdated: string; 
}