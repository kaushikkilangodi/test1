import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';

const Style1 = styled('div')(() => ({
  border: '1.5px solid #5A9EEE',
  borderRadius: '20px', // Add border radius
  marginLeft: 10,
  width: 90,
  height: 25,
}));

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch
    sx={{ marginLeft: 20 }}
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    {...props}
  />
))(({ theme }) => ({
  width: 80,
  height: 15.7,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(65px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#5A9EEE' : '#5A9EEE',
        opacity: 1,
        border: '1.5px solid #5A9EEE',
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#5A9EEE',
      border: '6px solid #D9D9D9',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 12,
    height: 12,
    // border: '1.5px solid black',
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#D9D9D9' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));
interface switchprop {
  onChange: () => void;
}
export default function CustomizedSwitch({ onChange }: switchprop) {
  return (
    <FormGroup>
      <Style1>
        <FormControlLabel
          onChange={onChange}
          control={<IOSSwitch sx={{ m: 1, marginLeft: 1.9, marginTop: '2px' }} />}
          label=""
          // labelPlacement="start"
          sx={{
            fontFamily: 'Helvetica',
            fontSize: '18px',
            fontWeight: '400',
            lineHeight: '20.7px',
            letterSpacing: '0.11em',
            textAlign: 'center',
            color: '#000000',
            gap: '30px',
          }}
        />
      </Style1>
    </FormGroup>
  );
}
