import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { getFlagList } from '@api/main/mainAxios';

interface FlagListItem {
  flagId: number;
  title: string;
  tags: Array<{ content: string; colorHex: string }>;
  description: string;
  maintainerName: string;
  active: boolean;
}

const FlagTable = () => {
  const [flagList, setFlagList] = useState<Array<FlagListItem>>([]);
  useEffect(() => {
    getFlagList(
      (data: Array<FlagListItem>) => {
        setFlagList(data);
      },
      (err) => {
        console.log(err);
      },
    );
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>id</TableCell>
            <TableCell align="center">기능</TableCell>
            <TableCell align="center">태그</TableCell>
            <TableCell align="center">기능 설명</TableCell>
            <TableCell align="center">생성자</TableCell>
            <TableCell align="center">플래그</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flagList.map((row) => (
            <TableRow
              key={row.flagId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.flagId}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.title}
              </TableCell>
              <TableCell align="left">
                {row.tags.map((tag) => {
                  return (
                    <span
                      key={tag.content}
                      style={{
                        backgroundColor: tag.colorHex,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        marginRight: '0.5rem',
                      }}
                    >
                      {tag.content}
                    </span>
                  );
                })}
              </TableCell>
              <TableCell align="left">{row.description}</TableCell>
              <TableCell align="center">{row.maintainerName}</TableCell>
              <TableCell align="left">{row.active ? '활성화' : '비활성화'}</TableCell>
              <TableCell align="center">...</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FlagTable;
