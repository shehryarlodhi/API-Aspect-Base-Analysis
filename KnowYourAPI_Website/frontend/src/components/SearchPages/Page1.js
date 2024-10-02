import React, { useState } from 'react';
import './Page1.css'; // Make sure the correct CSS file is imported


const Page1 = () => {
    const [inputText, setInputText] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    const handleSearch = async (event) => {
        event.preventDefault();
        console.log('Sending URL:', inputText);  // Debug: Log the URL being sent

        try {
            const response = await fetch('http://localhost:5003/api/fetch-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: inputText }),  // Send the URL entered in the text field
            });

            if (response.ok) {
                console.log('Response OK. Preparing file download...');
                
                // Create a blob for file download
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);

                // Create a temporary anchor element to trigger the download
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = downloadUrl;
                a.download = 'scraped_data.csv'; // Filename for the downloaded file
                document.body.appendChild(a);
                a.click();  // Trigger the download
                window.URL.revokeObjectURL(downloadUrl);  // Clean up the URL object
                setSearchResult('File downloaded successfully');
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
            setSearchResult('Failed to download the file.');
        }
    };

    return (
        <div className="page-container">
            <h1>Search Through Link</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter URL to scrape"
                />
                <button type="submit">Search</button>
            </form>
            {searchResult && <p>{searchResult}</p>}
        </div>
    );
};

export default Page1;
