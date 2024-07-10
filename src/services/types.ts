// src/types.ts
export interface User {
  address: {
    city: string;
    line1: string;
    line2: string;
    pinCode: string;
  };
  companyAddress: {
    city: string;
    line1: string;
    line2: string;
    pinCode: string;
  };
  _id: string;
  profile: string;
  companyName: string;
  phone: string;
  dob: string; // Assuming date of birth is a string in "YYYY-MM-DD" format
  gender: string;
  isDeleted: boolean;
  isEnabled: boolean;
  loginKey: string;
  mobile: string;
  name: string;
  upiId: string[]; // Assuming upiId is an array of strings
}

