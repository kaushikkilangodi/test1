import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import styled from 'styled-components';
import Input from '../../components/Input'; // Importing your custom Input component
import { Button } from '@mui/material';
import Row from '../../components/Row';
import { useUser } from '../../context/userContext';
import { updateCompanyInfo } from '../../services/realmServices';
import { toast } from 'react-hot-toast';
// import { User } from '../../services/types'; // Adjust the path as necessary

export interface FormData {
  companyName: string;
  phone: string;
  companyAddress: {
    line1: string;
    line2: string;
  };
  city: string;
  pinCode: string;
}

const Container = styled.div`
  width: 100%;
  padding: 10px;
`;

export default function NewContact() {
  // const navigate = useNavigate();
  const { user, setUser,fetchUserProfile } = useUser();
  // const location = useLocation();
  const [hasChanged, setHasChanged] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    phone: '',
    companyAddress: {
      line1: '',
      line2: '',
    },
    city: '',
    pinCode: '',
  });

  // Populate form data if user has company information
   useEffect(() => {
     if (user && user.companyName && user.companyAddress) {
       setFormData({
         companyName: user.companyName,
         phone: user.mobile,
         companyAddress: {
           line1: user.companyAddress.line1,
           line2: user.companyAddress.line2,
         },
         city: user.companyAddress.city,
         pinCode: user.companyAddress.pinCode,
       });
     }
   }, [user]);

   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     setHasChanged(true);
     setFormData((prevFormData) => {
       if (name === 'addressLine1' || name === 'addressLine2') {
         return {
           ...prevFormData,
           companyAddress: {
             ...prevFormData.companyAddress,
             [name === 'addressLine1' ? 'line1' : 'line2']: value,
           },
         };
       }
       return {
         ...prevFormData,
         [name]: value,
       };
     });
   };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasChanged) {
      toast.error('Please update any changes to save the company info');
      return;
    }
    if (user === null) return;
    await updateCompanyInfo(user._id, formData);
    const fetch = await fetchUserProfile();
    if(fetch){
      setUser(fetch);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          label="Company Name"
          required
        />
        <Input
          type="tel"
          name="phone"
          placeholder="Enter Phone No Here"
          value={formData.phone}
          onChange={handleChange}
          label="Phone Number"
          required
        />

        <Input
          type="text"
          name="addressLine1"
          placeholder="Enter Address Line 1 Here"
          value={formData.companyAddress.line1}
          onChange={handleChange}
          label="Address Line 1"
        />
        <Input
          type="text"
          name="addressLine2"
          placeholder="Enter Address Line 2 Here"
          value={formData.companyAddress.line2}
          onChange={handleChange}
          label="Address Line 2"
        />
        <Input
          type="text"
          name="city"
          placeholder="Enter City Name Here"
          value={formData.city}
          onChange={handleChange}
          label="City"
        />
        <Input
          type="text"
          name="pinCode"
          placeholder="Enter Pincode Here"
          value={formData.pinCode}
          onChange={handleChange}
          label="Pin Code"
        />
        <Row $contentposition="center">
          <Button
            variant="outlined"
            sx={{
              width: '172px',
              borderRadius: '12px',
              height: '53px',
              boxShadow: ' 0 4px 4px 0 rgba(0, 0, 0, 0.25)',
              backgroundColor: '#5a9eee',
              color: 'white',
              textTransform: 'none',
              fontSize: '25px',
              alignItems: 'center',
              fontWeight: '700',
            }}
            type="submit"
          >
            Save
          </Button>
        </Row>
      </form>
    </Container>
  );
}
