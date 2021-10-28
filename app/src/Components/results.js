import React from 'react';
import map from 'lodash/map'

import { Typography } from '@mui/material';
import Card from '@mui/material/Card'
import Rating from '@mui/material/Rating'
import IconButton from '@mui/material/IconButton'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'


export const ResultCard = ({result}) => {
  const rating = Math.random() * 5

  return (
    <Card sx={{ margin: 2, padding: '12px 24px', borderRadius: '10px' }} elevation={3}>
      <div style={{ display: 'flex' }}>
        <Typography sx={{ fontSize: 18, fontWeight: 'bold', paddingRight: 4, margin: 'auto 0' }}>
          {result['Name']}
        </Typography>
        <Rating
          sx={{ margin: 'auto 0' }}
          value={rating}
          readOnly
        />
        <Typography sx={{ margin: 'auto 0', paddingLeft: 1, paddingRight: 4, fontSize: 14 }}>
          {Math.round(rating)}/5 ({Math.round(Math.random()*1000)} votes)
        </Typography>
        <Typography sx={{ margin: 'auto 0', fontSize: 14 }}>
          {Math.round(Math.random()*10000)} Views
        </Typography>
        <IconButton
          sx={{ marginLeft: 'auto' }}
        >
          <BookmarkBorderIcon/>
        </IconButton>
      </div>
      <Typography sx={{ padding: '6px 42px' }}>
        {result['Course Description']}
      </Typography>
    </Card>
  )
}


export const Results = ({ data }) => {
  if(!data) return null

  return (
    <>
      <Typography variant='h4'>
        Results:
      </Typography>
      {map(data, result => <ResultCard result={result} />)}
    </>
  )
}