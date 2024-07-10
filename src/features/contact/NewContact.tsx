import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import styled from 'styled-components';
import Input from '../../components/Input'; // Importing your custom Input component
import Row from '../../components/Row';
import { useLocation, useNavigate, useParams } from '@tanstack/react-router';
import { Button } from '@mui/material';
import {
  createUser,
  editContact,
  fetchContactById,
} from '../../services/realmServices';
import { toast } from 'react-hot-toast';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface FormData {
  name: string;
  phone: string;
  gender: string;
  dob: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  pinCode: string;
}

const Container = styled.div`
  width: 100%;
`;
const Content = styled.div`
  margin: 20px 0;
  font-size: 20px;
  color: #000;
`;

const StyledPhoneInput = styled(PhoneInput)`
  width: 100%;
  padding: 12px;

  font-size: 12px;
  /* margin: 24px 0; */

  border: 1px solid rgba(217, 217, 217, 1);
  border-radius: 5px;
  height: 53px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;

  & input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 12px;
  }

  &:focus-within {
    outline: none;
    box-shadow: 0 0 8px rgba(10, 17, 23, 0.4);
  }
`;
const InputContainer = styled.div<{ width?: string }>`
  position: relative;
  margin: 24px 0;
  border-radius: 12px;
  width: ${(props) => props.width || '350px'};
`;
const InputLabel = styled.label`
  position: absolute;
  top: -12px;
  left: 12px;
  background-color: #fff;
  padding: 0 5px;
  font-size: 14px;
  color: #000;
  transition:
    top 0.3s ease,
    font-size 0.3s ease,
    color 0.3s ease;
  pointer-events: none;
`;

export default function NewContact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    gender: '',
    dob: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    pinCode: '',
  });

  const location = useLocation();
  const [hasChanged, setHasChanged] = useState(false);
  const isEditContact = location.pathname.split('/')[1] === 'editcontact';
  const { id } = useParams({ strict: false });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHasChanged(true);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handlePhoneChange = (phone: string) => {
    // Extract country code using a regular expression
    const countryCodeMatch = phone.match(/^\+(\d{1,4})/);
    const countryCode = countryCodeMatch ? countryCodeMatch[1] : '';

    console.log(countryCode); // This will log the country code, e.g., "91" for "+918765432111"

    setHasChanged(true);
    setFormData((prevFormData) => ({
      ...prevFormData,
      phone,
    }));
  };

  useEffect(() => {
    async function fetchContact() {
      if (isEditContact) {
        if (id === undefined) return;
        const data = await fetchContactById(id);
        console.log('data', data);
        setFormData(data);
      }
    }
    fetchContact();
  }, [isEditContact, id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditContact) {
      if (id === undefined) return;
      if (!hasChanged) {
        // Display toast message and exit the function
        toast.error('Please Update any Changes to Save the Contact');
        return;
      }
      await editContact(id, formData);
    } else {
      console.log(formData);
      const id = await createUser(formData);
      console.log('id', id?.insertedId.toString());
      navigate({ to: `/createAppointment/${id?.insertedId.toString()}` });
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          label="Name"
          required
        />
        <Row $contentposition="center">
          <InputContainer>
            <StyledPhoneInput
              international
              limitMaxLength
              // countryCallingCodeEditable={false}
              defaultCountry="IN"
              value={formData.phone}
              onChange={handlePhoneChange}
              required
            />
            <InputLabel>Phone Number</InputLabel>
          </InputContainer>
        </Row>
        <Content>
          <Row type="vertical">
            <Row size="xxLarge" type="horizontal" $contentposition="center">
              Gender:
              <Input
                type="radio"
                name="gender"
                label="Male"
                value="male"
                checked={formData.gender === 'male'} // Determines if this option is selected
                onChange={handleChange}
              />
              <Input
                type="radio"
                name="gender"
                label="Female"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
              />
            </Row>
          </Row>
        </Content>
        <Input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          label="Date of Birth"
          required
        />
        <Input
          type="text"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          label="Address Line 1"
          required
        />
        <Input
          type="text"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleChange}
          label="Address Line 2"
        />
        <Input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          label="City"
          required
        />
        <Input
          type="text"
          name="pinCode"
          value={formData.pinCode}
          onChange={handleChange}
          label="Pin Code"
          required
        />
        <Row $contentposition="center">
          <Button
            variant="outlined"
            type="submit"
            sx={{
              color: 'white',
              backgroundColor: '#5A9EEE',
              fontWeight: '700',
              font: 'Helvetica',
              fontSize: '15px',
              borderRadius: '12px',
              width: '100px',
              height: '45px',
              ':hover': { backgroundColor: '#5A9EEE', color: 'white' },
            }}
          >
            {isEditContact ? 'Save' : 'Next'}
          </Button>
        </Row>
      </form>
    </Container>
  );
}
