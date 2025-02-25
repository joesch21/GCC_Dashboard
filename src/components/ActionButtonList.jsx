import { useAppKit, useAppKitNetwork, useAppKitTheme, useDisconnect } from '../config/appkit';
import { bsc } from '../config/appkit';

export function ActionButtonList() {
  const modal = useAppKit();
  const { disconnect } = useDisconnect();
  const { switchNetwork } = useAppKitNetwork();
  const { themeMode, setThemeMode } = useAppKitTheme();

  function openAppKit() {
    modal.open();
  }

  function switchToBSC() {
    switchNetwork(bsc);  // Switch to BSC
  }

  async function handleDisconnect() {
    try {
      await disconnect();
    } catch (error) {
      console.error('Error during disconnect:', error);
    }
  }

  function toggleTheme() {
    const newTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newTheme);
    document.body.className = newTheme;
  }

  return (
    <div className="action-button-list">
      <button onClick={openAppKit}>Open</button>
      <button onClick={handleDisconnect}>Disconnect</button>
      <button onClick={switchToBSC}>Switch to BSC</button> {/* Now correctly switches to BSC */}
      <button onClick={toggleTheme}>
        {themeMode === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
}

export default ActionButtonList;
