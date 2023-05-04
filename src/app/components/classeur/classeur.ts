export type ClasseurDetail = {
  folder_name: string;
  file_name: string;
};

//export type ClasseurDate 

export type ClasseurStatus = 'NOT_STARTED' | 'PROGRESSING' | 'DONE';

export type ClasseurDetails = ClasseurDetail[];

export type Classeur = {
  id?: number;
  customer_name: string;
  description: string;
  date_binder_creation: Date;
  created_at: Date;
  status: ClasseurStatus;
  month: string;
  year: string;
  details: ClasseurDetails;
  //added_by: string;
};
