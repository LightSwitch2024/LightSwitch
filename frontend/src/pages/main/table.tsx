import { getFlagList, getFlagListByKeyword, patchFlagActive } from '@api/main/mainAxios';
import MoreIcon from '@assets/more-icon.svg?react';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import {
  Box,
  IconButton,
  Paper,
  styled,
  Switch,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  useTheme,
} from '@mui/material';
import { switchClasses } from '@mui/material/Switch';
import * as S from '@pages/main/indexStyle';
import { Tag } from '@/types/Tag';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLoadingStore } from '@/global/LoadingAtom';

interface FlagListItem {
  flagId: number;
  title: string;
  tags: Array<{ content: string; colorHex: string }>;
  description: string;
  maintainerName: string;
  active: boolean;
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

interface FlagTableProps {
  flagKeyword: string;
  tags: Array<Tag>;
  activeFlagChanged: (activeFlags: number) => void;
}

interface FlagActiveReqDto {
  active: boolean;
}

/**
 * 페이지 네이션 옵션 선언부
 * @param props
 * @returns
 */
function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const FlagTable = (props: FlagTableProps) => {
  const navigator = useNavigate();
  const { contentLoading, contentLoaded } = useLoadingStore();
  const [flagList, setFlagList] = useState<Array<FlagListItem>>([]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(4);

  /**
   * 페이지 네이션 변경 이벤트 핸들러
   * @param event
   * @param newPage
   */
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  /**
   * 페이지 당 행 수 변경 이벤트 핸들러
   * @param event
   */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**
   * 테이블 스타일 선언
   */
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      fontFamily: 'Pretendard-Regular',
      backgroundColor: '#031c5b',
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.palette.common.white,
      zIndex: 1,
    },
    [`&.${tableCellClasses.body}`]: {
      fontFamily: 'Pretendard-Regular',
      fontSize: 18,
    },
    '&:nth-child(1)': {
      width: '20%',
    },
    '&:nth-child(2)': {
      width: '15%',
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
      cursor: 'pointer',
    },
  }));

  /**
   * 스위치 컴포넌트 스타일 선언
   */
  const SwitchTextTrack = styled(Switch)({
    width: 80,
    height: 48,
    padding: 8,
    [`& .${switchClasses.switchBase}`]: {
      padding: 11,
      color: '#565555',
    },
    [`& .${switchClasses.thumb}`]: {
      width: 26,
      height: 26,
      backgroundColor: '#fff',
    },
    [`& .${switchClasses.track}`]: {
      background: 'linear-gradient(to right, #565555, #a2a1a1)',
      opacity: '1 !important',
      borderRadius: 20,
      position: 'relative',
      '&:before, &:after': {
        display: 'inline-block',
        position: 'absolute',
        top: '50%',
        width: '50%',
        transform: 'translateY(-50%)',
        color: '#fff',
        textAlign: 'center',
        fontSize: '0.75rem',
        fontWeight: 500,
      },
      '&:before': {
        content: '"ON"',
        left: 4,
        opacity: 0,
      },
      '&:after': {
        content: '"OFF"',
        right: 4,
      },
    },
    [`& .${switchClasses.checked}`]: {
      [`&.${switchClasses.switchBase}`]: {
        color: '#031c5b',
        transform: 'translateX(32px)',
        '&:hover': {
          backgroundColor: 'rgba(24,90,257,0.08)',
        },
      },
      [`& .${switchClasses.thumb}`]: {
        backgroundColor: '#fff',
      },
      [`& + .${switchClasses.track}`]: {
        background: 'linear-gradient(to right, #0533a5, #031c5b)',
        '&:before': {
          opacity: 1,
        },
        '&:after': {
          opacity: 0,
        },
      },
    },
  });

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 28,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(30px)',
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
      width: 25,
      height: 25,
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

  const handleToggleButtonClick = (flagId: number, active: boolean) => {
    onPressFlagSwitch(flagId, active);
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
  function switchFlag(flagId: number, result: boolean): void {
    const newFlagList = flagList.map((flag) => {
      if (flag.flagId === flagId) {
        return {
          ...flag,
          active: result,
        };
      }
      return flag;
    });
    setFlagList(newFlagList);

    const activeFlags = newFlagList.filter((flag) => flag.active);
    props.activeFlagChanged(activeFlags.length);
  }

  /**
   * 플래그 스위치를 눌렀을 때 실행되는 함수를 반환합니다.
   * @param flagId 플래그 아이디
   * @returns
   */
  const onPressFlagSwitch = (flagId: number, currentActive: boolean) => {
    // 서로 다른 사용자가 동시에 같은 플래그를 수정할 때 발생하는 문제를 해결하기 위해
    // 현재 상태를 active로 보내고, 서버에서도 변경된 flag의 active 상태를 반환받아
    // 클라이언트에서 다시 한 번 변경을 시도합니다.
    contentLoading();
    patchFlagActive<boolean>(
      flagId,
      { active: currentActive },
      (changedActive) => {
        switchFlag(flagId, changedActive);
        contentLoaded();
      },
      (err) => {
        console.log(err);
      },
    );
  };

  /**
   * 키워드 변경이 감지되면 플래그 리스트를 다시 불러옵니다.
   * 변경이 2초 이내에 다시 발생하면 이전 요청은 취소됩니다.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (props.flagKeyword === '') {
        getFlagList(
          (data: Array<FlagListItem>) => {
            if (props.tags.length !== 0) {
              const filteredData = data.filter((item) =>
                item.tags.some((itemTag) =>
                  props.tags.some((propTag) => propTag.content === itemTag.content),
                ),
              );
              setFlagList(filteredData);
            } else {
              setFlagList(data);
            }
          },
          (err) => {
            console.log(err);
          },
        );
      } else {
        getFlagListByKeyword(
          props.flagKeyword,
          (data: Array<FlagListItem>) => {
            if (props.tags.length !== 0) {
              const filteredData = data.filter((item) =>
                item.tags.some((itemTag) =>
                  props.tags.some((propTag) => propTag.content === itemTag.content),
                ),
              );
              setFlagList(filteredData);
            } else {
              setFlagList(data);
            }
          },
          (err) => {
            console.log(err);
          },
        );
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [props.flagKeyword, props.tags]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">기능</StyledTableCell>
              <StyledTableCell align="left">태그</StyledTableCell>
              <StyledTableCell align="left">기능설명</StyledTableCell>
              <StyledTableCell align="left">생성자</StyledTableCell>
              <StyledTableCell align="center">플래그</StyledTableCell>
              <StyledTableCell align="left"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? flagList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : flagList
            ).map((row) => (
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
                  <S.TableRowDescriptionDiv>{row.description}</S.TableRowDescriptionDiv>
                </StyledTableCell>
                <StyledTableCell align="left">{row.maintainerName}</StyledTableCell>
                <StyledTableCell align="left">
                  <SwitchTextTrack
                    sx={{ m: 1 }}
                    defaultChecked={row.active}
                    onChange={() => handleToggleButtonClick(row.flagId, row.active)}
                  />
                </StyledTableCell>
                <StyledTableCell align="left">
                  <MoreIcon />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[4, 8, 20, { label: 'All', value: -1 }]}
                colSpan={3}
                count={flagList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
};

export default FlagTable;
