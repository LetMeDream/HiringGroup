export enum UserRole {
  ADMIN = 'admin',
  HIRING_GROUP = 'hiring_group',
  COMPANY = 'company',
  CANDIDATE = 'candidate',
  EMPLOYEE = 'employee'
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  companyId?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Candidate extends User {
  role: UserRole.CANDIDATE;
  profession?: string;
  university?: string;
  experiences: WorkExperience[];
}

export interface Employee extends User {
  role: UserRole.EMPLOYEE;
  employeeId: string;
  salary: number;
  contractType: 'monthly' | 'six_months' | 'yearly' | 'indefinite';
  bloodType: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  bankAccount: {
    accountNumber: string;
    bank: string;
  };
  startDate: Date;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export interface Company {
  id: string;
  name: string;
  sector: string;
  contactPerson: string;
  email: string;
  phone?: string;
  address?: string;
  isActive: boolean;
}

export interface JobOffer {
  id: string;
  companyId: string;
  profession: string;
  position: string;
  description: string;
  salary: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplication {
  id: string;
  jobOfferId: string;
  candidateId: string;
  appliedAt: Date;
  status: 'pending' | 'reviewed' | 'rejected' | 'hired';
}