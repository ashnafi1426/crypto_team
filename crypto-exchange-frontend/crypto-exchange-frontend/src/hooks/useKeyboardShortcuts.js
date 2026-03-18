import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let waitingForSecondKey = false;
    let timeoutId = null;

    const handleKeyPress = (e) => {
      // Don't trigger if typing in input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Escape key - close modals
      if (e.key === 'Escape') {
        // Dispatch custom event for modals to listen to
        window.dispatchEvent(new CustomEvent('closeModal'));
        return;
      }

      // Ctrl/Cmd + K - Search (placeholder for future search feature)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        console.log('Search shortcut triggered');
        // TODO: Open search modal
        return;
      }

      // ? - Show keyboard shortcuts help
      if (e.key === '?' && !e.shiftKey) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('showKeyboardShortcuts'));
        return;
      }

      // G key - start navigation sequence
      if (e.key === 'g' && !waitingForSecondKey) {
        waitingForSecondKey = true;
        
        // Reset after 2 seconds if no second key pressed
        timeoutId = setTimeout(() => {
          waitingForSecondKey = false;
        }, 2000);
        
        return;
      }

      // Second key in G sequence
      if (waitingForSecondKey) {
        clearTimeout(timeoutId);
        waitingForSecondKey = false;

        switch (e.key) {
          case 'd':
            navigate('/');
            break;
          case 'w':
            navigate('/wallet');
            break;
          case 't':
            navigate('/trade');
            break;
          case 'm':
            navigate('/markets');
            break;
          case 'h':
            navigate('/history');
            break;
          case 'a':
            navigate('/analytics');
            break;
          case 's':
            navigate('/staking');
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate]);
};
