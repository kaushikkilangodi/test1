export const showBackButton = ['/appointments', '/notes', '/settings', '/'];
export const hideSearchBar = [
  (pathname: string) => pathname.startsWith('/chatpage'),
  (pathname: string) => pathname.startsWith('/createAppointment'),
  (pathname: string) => pathname.startsWith('/editcontact'),
  (pathname: string) => pathname.startsWith('/editAppointment'),
  '/payment',
  '/appointmentinfo',
  '/slots',
  '/settings',
  '/newContacts',
  '/qrscanner',
  '/companyinfo',
];

export const hideQrButton = [
  (pathname: string) => pathname.startsWith('/createAppointment'),
  (pathname: string) => pathname.startsWith('/editAppointment'),
  '/contacts',
  '/payment',
  '/appointmentinfo',
  '/slots',
  '/newContacts',
  '/editcontact',
  '/qrscanner',
  '/companyinfo',
];

export const ITEMS_PER_PAGE = 10;