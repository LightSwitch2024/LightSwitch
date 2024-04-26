import { getFlagList, patchFlagActive } from '@api/main/mainAxios';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

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

  /**
   * flag Id에 해당하는 플래그의 활성화 상태를 변경합니다.
   * @param flagId 플래그 아이디
   */
  function switchFlag(flagId: number): void {
    const newFlagList = flagList.map((flag) => {
      if (flag.flagId === flagId) {
        return {
          ...flag,
          active: !flag.active,
        };
      }
      return flag;
    });
    setFlagList(newFlagList);
  }

  /**
   * 플래그 스위치를 눌렀을 때 실행되는 함수를 반환합니다.
   * @param flagId 플래그 아이디
   * @returns
   */
  const onPressFlagSwitch = (flagId: number) => {
    patchFlagActive(
      flagId,
      () => {
        switchFlag(flagId);
      },
      (err) => {
        console.log(err);
      },
    );
  };

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
              <TableCell align="left">
                <ToggleButton
                  value={row.active}
                  selected={row.active}
                  onChange={() => onPressFlagSwitch(row.flagId)}
                />
                {row.active ? '활성화' : '비활성화'}
              </TableCell>
              <TableCell align="center">...</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FlagTable;
