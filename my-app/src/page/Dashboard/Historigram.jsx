import React, { useState, handleChange } from 'react';
import Chart from 'react-apexcharts';
import { Select, MenuItem} from '@mui/material';

const Historigram = () => {
    const [options, setOptions] = useState({
        chart: {
            type: 'bar',
            padding: '3rem',
        },
        xaxis: {
            categories: ['Robot 1', 'Robot 2', 'Robot 3', 'Robot 4', 'Robot 5'],
        },
        title: {
            text: 'Pourcentage de pièces palettisées par robot',
            align: 'center',
            
        },
    });

    const [series, setSeries] = useState([
        {
            name: 'Pourcentage',
            data: [30, 40, 50, 60, 70],
            
        },
    ]);

    const handleClick = (period) => {
        // Logique pour changer la période
        console.log('Changer la période à :', period);
    };

    return (
        <div style={{
            transition: '0.7s',
            backgroundColor: 'rgb(233, 235, 240)',
            boxShadow: '0 5px 25px rgba(220, 145, 145, 0.5)',
            }}>
        <Select onChange={handleChange} defaultValue="Le mois dernier">
            <MenuItem value="Aujourd'hui">Aujourd'hui</MenuItem>
            <MenuItem value="La semaine dernière">La semaine dernière</MenuItem>
            <MenuItem value="Le mois dernier">Le mois dernier</MenuItem>
        </Select>
        <Chart options={options} series={series} type="bar" height={300} width={1100} />
    </div>
    );
};

export default Historigram;
