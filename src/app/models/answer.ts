
export interface Answer{
    id: number;
    questionId: number;
    body: string;
    createdBy: string;
    upVotes: number;
    downVotes: number;
    voteScore: number;
    dateCreated: string;
    dateUpdated: string; 
}