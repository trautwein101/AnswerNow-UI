// From GET /api/Admin/stats
export interface AdminStats{
  totalUsers: number;
  totalQuestions: number;
  totalAnswers: number;
  newUsersThisWeek: number;
  newQuestionsThisWeek: number;
  newAnswersThisWeek: number;
}


// From GET /api/Admin/Users
export interface Users{
    id: number;
    email: string;
    displayName: string;
    role: string;
    isProfessional: boolean;
    isBanned: boolean;
    isActive: boolean;
    isSuspended: boolean;
    dateCreated: string; 
    dateUpdated: string;
    questionCount: number;
    answerCount: number;
    questionFlagCount: number;
    answerFlagCount: number;
}
