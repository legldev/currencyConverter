import './App.css';
import CurrencyConverter from './CurrencyConverter';

function App() {
  return (
    <div className="App">
      <CurrencyConverter />
      <footer className="site-footer">
        ©{' '}
        <a href="https://fuzzdea.com" rel="noreferrer" target="_blank">
          fuzzdea
        </a>
        . Made with ♥.
      </footer>
    </div>
  );
}

export default App;
