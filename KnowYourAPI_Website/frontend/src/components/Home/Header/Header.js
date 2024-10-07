import React, { useState } from 'react';

const Header = () => {
    const [url, setUrl] = useState('');
    const [urlResult, setUrlResult] = useState(null);

    const handleUrlSubmit = async (event) => {
        event.preventDefault();
        console.log("Sending URL to backend:", url);

        try {
            const response = await fetch('/api/fetch-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            if (response.ok) {
                // Directly download the file
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = downloadUrl;
                a.download = 'scraped_data.csv';  // Filename for the downloaded file
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(downloadUrl);
                setUrlResult('File downloaded successfully');
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching URL data:', error.message);
        }
    };

    return (
        <header>
            <div>
                <h1>Know Your API</h1>
                <form onSubmit={handleUrlSubmit}>
                    <input
                        type="text"
                        placeholder="Enter URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <button type="submit">Scrape Data</button>
                </form>
                {urlResult && <div>{urlResult}</div>}
            </div>
        </header>
    );
};

export default Header;
