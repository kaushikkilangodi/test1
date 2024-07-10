import { createRootRoute, createRoute } from '@tanstack/react-router';
import { Root } from './components/Root';
import InstallPage from './pages/InstallPage';
import Settings from './pages/Settings';
import Appointments from './pages/Appointments';
import Notes from './pages/Notes';
import Payment from './features/profile/Payment';
import NewContact from './features/contact/NewContact';
import CompanyInfo from './features/profile/CompanyInfo';
import Slots from './features/appointment/Slots';
import QRCodeScanner from './pages/QRCodeScanner';
import CreateAppointment from './features/appointment/CreateAppointment';
import Contacts from './pages/Contacts'; //
import PageNotFound from './components/PageNotFound';
import SearchResults from './components/SearchResults';
import AppointmentInfo from './features/appointment/AppointmentInfo';
import ChatPage from './pages/ChatPage';
// import { displayContacts } from './services/realmServices';
import { SearchParams } from './components/SearchResults';

const rootRoute = createRootRoute({
  component: Root,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Appointments,
});

const qrRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/qrscanner',
  component: QRCodeScanner,
});
const appointmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/appointments',
  component: Appointments,
});
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
});
const notesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notes',
  component: Notes,
});
const installRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/install',
  component: InstallPage,
});
const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment',
  component: Payment,
});
const newContactsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/newContacts',
  component: NewContact,
});
const companyinfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/companyinfo',
  component: CompanyInfo,
});
const slotsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/slots',
  component: Slots,
});
const createAppointmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/createAppointment/$id',
  component: CreateAppointment,
});
const editAppointmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/editAppointment/$id',
  component: CreateAppointment,
});
const contactsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contacts',
  component: Contacts,
});
const editcontactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/editcontact/$id',
  component: NewContact,
});
export const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: SearchResults,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      query: search.query as string,
    };
  },
});
const appointmentinfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/appointmentinfo',
  component: AppointmentInfo,
});
const chatpageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chatpage/$id',
  component: ChatPage,
  // loader: ({ params }) => displayContacts(params.chatpage),
});

const pageNotFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/*',
  component: PageNotFound,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  qrRoute,
  appointmentsRoute,
  settingsRoute,
  notesRoute,
  installRoute,
  paymentRoute,
  newContactsRoute,
  companyinfoRoute,
  slotsRoute,
  createAppointmentRoute,
  contactsRoute,
  editcontactRoute,
  searchRoute,
  appointmentinfoRoute,
  chatpageRoute,
  pageNotFoundRoute,
  editAppointmentRoute,
]);
