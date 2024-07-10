import { useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';

function RouteTitle() {
  const location = useLocation();

  useEffect(() => {
    const title = location.pathname.substring(1);
    document.title = `Appointment | ${
      title.charAt(0).toUpperCase() + title.slice(1)
    }`;
  }, [location]);

  return null;
}

export default RouteTitle;
