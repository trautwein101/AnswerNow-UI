// From GET /api/Admin/stats
export interface AdminStats{
  totalUsers: number;
  totalQuestions: number;
  totalAnswers: number;
  newUsersThisWeek: number;
  newQuestionsThisWeek: number;
  newAnswersThisWeek: number;
  totalIsFlaggedQuestions: number;
  totalisFlaggedAnswers: number;
  newIsFaggedQuestionsThisWeek: number;
  newIsFlaggedAnswersThisWeek: number;
}


// From GET /api/Admin/Users
export interface Users{
    id: number;
    email: string;
    displayName: string;
    role: string;
    isProfessional: boolean;
    isActive: boolean;
    isInActive: boolean; 
    isPending: boolean
    isSuspended: boolean;
    isBanned: boolean; 
    lastLogin: string;
    dateCreated: string; 
    dateUpdated: string;
    questionCount: number;
    answerCount: number;
    questionFlagCount: number;
    answerFlagCount: number;
}
