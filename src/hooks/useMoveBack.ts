import { useCallback } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';

export function useMoveBack() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleMoveBack = useCallback(() => {
    if (location.pathname === '/contacts') {
      navigate({ to: '/' });
    } else {
      window.history.back();
    }
  }, [location.pathname,navigate]);

  return handleMoveBack;
}
