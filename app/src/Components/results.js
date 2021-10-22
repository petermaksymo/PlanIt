import React from 'react';
import map from 'lodash/map'
import { Typography} from '@mui/material';


export const Results = ({ data }) => {
    if(!data) return null

    return (
        <>
            <Typography variant='h4'>Results:</Typography>
            {data.map(year => {
                return map(year.Course, (course => <div dangerouslySetInnerHTML={{ __html: course }} />))
            })}
            {data.map(year => JSON.stringify(year))}
        </>
    )
}