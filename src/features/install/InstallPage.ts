// install.ts
export interface DeferredPrompt {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const handleBeforeInstallPrompt = (
  e: Event,
  setDeferredPrompt: React.Dispatch<
    React.SetStateAction<DeferredPrompt | null>
  >,
  setShowInstallPrompt: React.Dispatch<React.SetStateAction<boolean>>
) => {
  e.preventDefault();
  const deferredPrompt = e as unknown as DeferredPrompt;
  setDeferredPrompt(deferredPrompt);
  setShowInstallPrompt(true);
};

export const handleAppInstalled = (
  setShowInstallPrompt: React.Dispatch<React.SetStateAction<boolean>>
) => {
  console.log('App was installed.');
  localStorage.setItem('appInstalled', 'true');
  setShowInstallPrompt(false);
};

export const handleInstallClick = async (
  deferredPrompt: DeferredPrompt | null,
  setShowInstallPrompt: React.Dispatch<React.SetStateAction<boolean>>,
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>,
  setDeferredPrompt: React.Dispatch<
    React.SetStateAction<DeferredPrompt | null>
  >,
  setIsInstallButtonClicked: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setIsInstallButtonClicked(false); // Reset loading state
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      localStorage.setItem('appInstalled', 'true');
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
      setShowLogin(true);
    } else {
      console.log('User dismissed the install prompt');
      setDeferredPrompt(null); // Reset the deferred prompt
      setShowInstallPrompt(true); // Show the install prompt again
    }
  } else {
    console.log('No install prompt available');
    setIsInstallButtonClicked(false); // Reset loading state
  }
};
