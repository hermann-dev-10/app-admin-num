export type ClasseurDetail = {
  folder_name: string;
  file_name: string;
};

//export type ClasseurDate 

export type ClasseurStatus = 'NOT_STARTED' | 'STARTED' | 'PROGRESSING' | 'DONE';

export type ClasseurDetails = ClasseurDetail[];

export type Classeur = {
  id?: number;
  customer_name: string;
  description: string;
  created_at: Date;
  status: ClasseurStatus;
  month: string;
  year: string;
  details: ClasseurDetails;
};
