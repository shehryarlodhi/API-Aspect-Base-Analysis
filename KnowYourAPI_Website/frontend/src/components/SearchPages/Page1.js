import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Import chart.js for pie charts
import './Page1.css';

const Page1 = () => {
    const [inputText, setInputText] = useState('');
    const [aspectData, setAspectData] = useState(null);
    const [searchResult, setSearchResult] = useState('');

    const handleSearch = async (event) => {
        event.preventDefault();
        console.log('Sending URL:', inputText);

        try {
            const response = await fetch('http://localhost:5003/api/fetch-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: inputText }),
            });

            if (response.ok) {
                const aspectResults = await response.json();
                setAspectData(aspectResults);
                setSearchResult('Data processed successfully.');
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
            setSearchResult('Failed to process the data.');
        }
    };

    // Prepare data for the pie chart
    const prepareChartData = (aspectData) => {
        const labels = Object.keys(aspectData);
        const positiveData = labels.map(label => aspectData[label].positive);
        const negativeData = labels.map(label => aspectData[label].negative);

        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#F44336', '#9C27B0', '#E91E63', '#3F51B5', '#00BCD4'
        ];

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Positive Sentiment (%)',
                    data: positiveData,
                    backgroundColor: colors,
                },
                {
                    label: 'Negative Sentiment (%)',
                    data: negativeData,
                    backgroundColor: colors.map(color => `${color}AA`), // Add transparency for negative
                },
            ],
        };
    };

    return (
        <div className="page-container">
            <h1>Scraper Page</h1>
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

            {aspectData && (
                <div>
                    <h2>Aspect Sentiment Analysis</h2>
                    <Pie data={prepareChartData(aspectData)} />
                    <div className="aspect-summary">
                        {Object.entries(aspectData).map(([aspect, data]) => (
                            <div key={aspect}>
                                <h3>{aspect}</h3>
                                <p>Positive: {data.positive.toFixed(2)}%</p>
                                <p>Negative: {data.negative.toFixed(2)}%</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page1;
