
export interface Answer{
    id: number;
    questionId: number;
    body: string;
    userId: number;
    createdByEmail: string;
    createdByDisplayName: string;
    upVotes: number;
    downVotes: number;
    isFlagged: boolean;
    isDeleted: boolean;
    dateDeleted: string | null;
    dateCreated: string;
    dateUpdated: string; 
}

export type AnswerVm = Answer & { voteScore: number}