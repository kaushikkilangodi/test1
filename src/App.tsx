import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routes';
import { DateProvider } from './context/DateContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GlobalStyles from './styles/GlobalStyles';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from './context/userContext';
import { PreviousProvider } from './context/PreviousPath';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();


const router = createRouter({
  routeTree,
});

// console.log('hello',router.history);
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
declare module '@mui/material/styles' {
  interface Palette {
    customColor: Palette['primary'];
  }

  interface PaletteOptions {
    customColor?: PaletteOptions['primary'];
  }
}
const theme = createTheme({
  palette: {
    primary: {
      main: '#5A9EEE',
    },
    secondary: {
      main: '#000',
    },
    customColor: {
      main: '#D9D9D9',
      light: '#f0f0f2',
    },
  },
});
function App() {
  return (
    <DateProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <PreviousProvider>
          <QueryClientProvider client={queryClient}>
            <UserProvider>
              <RouterProvider router={router} />
            </UserProvider>
          </QueryClientProvider>
        </PreviousProvider>

        <Toaster
          position="top-center"
          // space between toasts
          gutter={12}
          // space between window and the toast
          containerStyle={{ margin: '0px' }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 3000,
            },

            style: {
              fontSize: '16px',
              fontWeight: '500',
              maxWidth: '300px',
              padding: '16px 24px',
              backgroundColor: '#d8f9ff',
              color: '#000',
            },
          }}
        />
      </ThemeProvider>
    </DateProvider>
  );
}

export default App;
