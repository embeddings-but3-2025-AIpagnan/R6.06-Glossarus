
import './Header.css';

export function Header() {
    return (
        <header className="header">
            <div className="header-left">
                <img src="/logo.png" className="logo" title="Glosaurus" />
                <h1 className="app-name">Glosaurus</h1>
                
                <div className="separator"></div>
                <nav className="nav">
                    <a href="/" className="active">Home</a>
                </nav>
            </div>

            
        </header>
    );
}
