import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import './Page2.css';

// Register the chart components
Chart.register(ArcElement, Tooltip, Legend);

const Results = ({ analysisResults }) => {
    const aspects = [
        'Usability', 'Performance', 'Bug', 'Security', 'Community',
        'Compatibility', 'Documentation', 'Legal', 'Portability',
        'OnlySentiment', 'Others'
    ];

    // Calculate the percentage of each aspect present based on positive and negative results
    const dataPoints = aspects.map(aspect => {
        const aspectData = analysisResults[aspect];
        const total = aspectData.positive + aspectData.negative;
        return total;
    });

    const data = {
        labels: aspects,
        datasets: [
            {
                label: 'Aspects Analysis',
                data: dataPoints, // Total occurrences of each aspect
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FF6347', '#ADFF2F', '#87CEFA', '#BA55D3', '#FFD700'
                ],
                hoverBackgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FF6347', '#ADFF2F', '#87CEFA', '#BA55D3', '#FFD700'
                ],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                    },
                },
            },
        },
    };

    // Render positive and negative counts for each aspect
    return (
        <div className="results-container">
            <h2>Aspect Analysis</h2>
            <div className="chart-wrapper">
                <Pie data={data} options={options} />
            </div>

            <div className="aspect-analysis">
                {aspects.map((aspect, index) => {
                    const { positive, negative } = analysisResults[aspect];
                    return (
                        <div key={index} className="aspect-result">
                            <h3>{aspect}</h3>
                            <p>
                                Positive: {positive} | Negative: {negative}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Results;
