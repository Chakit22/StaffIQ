export type Ranking = {
  [lecturerId: number]: number[]; // Lecturer ID is a number, and it maps to an array of applicant IDs (numbers)
};

export type CourseRanking = {
  [courseCode: string]: {
    [role: string]: Ranking;
  };
};

export type Rankings = CourseRanking[]; // Rankings is an array of course rankings
