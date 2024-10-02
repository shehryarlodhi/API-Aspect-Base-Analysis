import React, { useState } from 'react';
import './Page2.css'; // Make sure the correct CSS file is imported

const Page2 = () => {
    const [inputText, setInputText] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    const handleSearch = (event) => {
        event.preventDefault();
        // Implement search functionality
        console.log('Searching for:', inputText);
        setSearchResult(`Search result for "${inputText}"`);
    };

    return (
        <div className="page-container">
            <h1>Search through text</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text"
                />
                <button type="submit">Search</button>
            </form>
            {searchResult && <div className="search-result">{searchResult}</div>}
        </div>
    );
};

export default Page2;
