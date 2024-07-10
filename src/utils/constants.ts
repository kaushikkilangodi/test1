import * as Realm from 'realm-web';
import toast from 'react-hot-toast';

const APP_ID = 'exelonwebapp-ixfnzgz';
export const app = new Realm.App({ id: APP_ID });

export async function getAuthenticatedUser() {
  const user = app.currentUser;
  if (!user) {
    toast.error('User is not authenticated');
    throw new Error('User not authenticated');
  }
  return user;
}

export function parseDateToUTC(dateString: string) {
  const [day, monthString, year] = dateString.split(' ');

  const monthMap: { [key: string]: number } = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sept: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const month = monthMap[monthString];
  const utcDate = new Date(Date.UTC(parseInt(year), month, parseInt(day)));
  console.log('UTC Date:', utcDate);
  
  return utcDate;
}

