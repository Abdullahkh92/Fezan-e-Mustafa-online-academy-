export type SubmissionType = 'free_trial' | 'admission' | 'inquiry' | 'contact';

export type SubmissionStatus = 'New' | 'Contacted' | 'Enrolled' | 'Completed';

export interface InquiryRecord {
  id: string;
  type: SubmissionType;
  studentName: string;
  parentName: string;
  age: string;
  country: string;
  whatsapp: string;
  email: string;
  course: string;
  timing: string;
  genderPreference?: 'Any' | 'Male Teacher' | 'Female Teacher';
  message: string;
  status: SubmissionStatus;
  createdAt: string;
  adminNotes?: string;
}

export interface CourseDetail {
  id: string;
  title: string;
  arabicTitle: string;
  shortDesc: string;
  fullDesc: string;
  duration: string;
  level: string;
  suitableFor: string;
  keyTopics: string[];
  learningOutcomes: string[];
  highlights: string[];
  image: string;
}
