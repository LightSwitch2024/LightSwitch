import { getFlagList, patchFlagActive } from '@api/main/mainAxios';
import {
  FormControlLabel,
  Paper,
  styled,
  Switch,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
} from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FlagListItem {
  flagId: number;
  title: string;
  tags: Array<{ content: string; colorHex: string }>;
  description: string;
  maintainerName: string;
  active: boolean;
}

const FlagTable = () => {
  const navigator = useNavigate();

  const [flagList, setFlagList] = useState<Array<FlagListItem>>([]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      fontFamily: 'Pretendard-Regular',
      backgroundColor: '#031c5b',
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontFamily: 'Pretendard-Regular',
      fontSize: 18,
    },
    '&:nth-child(1)': {
      width: '15%',
    },
    '&:nth-child(2)': {
      width: '20%',
    },
    '&:nth-child(3)': {
      width: '40%',
    },
    '&:nth-child(4)': {
      width: '10%',
    },
    '&:nth-child(5)': {
      width: '10%',
    },
    '&:nth-child(6)': {
      width: '5%',
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
    // hover effect
    '&:hover': {
      backgroundColor: '#89e6f5',
    },
  }));

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            '#fff',
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
      width: 32,
      height: 32,
      '&::before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      borderRadius: 20 / 2,
    },
  }));

  const handleToggleButtonClick = (flagId: number) => {
    onPressFlagSwitch(flagId);
  };

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

  const label = { inputProps: { 'aria-label': 'Switch demo' } };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left" id="TableHeaderTitle">
                기능
              </StyledTableCell>
              <StyledTableCell align="left" id="TableHeaderTags">
                태그
              </StyledTableCell>
              <StyledTableCell align="left" id="TableHeaderDescription">
                기능 설명
              </StyledTableCell>
              <StyledTableCell align="left" id="TableHeaderMaintainer">
                생성자
              </StyledTableCell>
              <StyledTableCell align="left" id="TableHeaderActive">
                플래그
              </StyledTableCell>
              <StyledTableCell align="left" id="TableHeaderOptions"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flagList.map((row) => (
              <StyledTableRow
                key={row.flagId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <StyledTableCell
                  component="th"
                  scope="row"
                  onClick={() => {
                    navigator(`flag/${row.flagId}`);
                  }}
                >
                  <span>{row.title}</span>
                </StyledTableCell>
                <StyledTableCell
                  align="left"
                  onClick={() => {
                    navigator(`flag/${row.flagId}`);
                  }}
                >
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
                </StyledTableCell>
                <StyledTableCell
                  align="left"
                  onClick={() => {
                    navigator(`flag/${row.flagId}`);
                  }}
                >
                  {row.description}
                </StyledTableCell>
                <StyledTableCell align="left">{row.maintainerName}</StyledTableCell>
                <StyledTableCell align="left">
                  <MaterialUISwitch
                    sx={{ m: 1 }}
                    defaultChecked={row.active}
                    onChange={() => handleToggleButtonClick(row.flagId)}
                  />
                </StyledTableCell>
                <StyledTableCell align="left">...</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default FlagTable;
