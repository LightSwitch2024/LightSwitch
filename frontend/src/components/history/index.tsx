import React, { useEffect } from 'react';

import * as S from '@/components/history/indexStyle';

import { History, HistoryType } from '@/types/Flag';
const index = (props: History) => {
  const setTimeOption = (createdAt: number[]) => {
    const year = createdAt[0];
    const month = createdAt[1] < 10 ? `0${createdAt[1]}` : createdAt[1];
    const day = createdAt[2] < 10 ? `0${createdAt[2]}` : createdAt[2];
    const hour = createdAt[3] < 10 ? `0${createdAt[3]}` : createdAt[3];
    const minute = createdAt[4] < 10 ? `0${createdAt[4]}` : createdAt[4];
    const second = createdAt[5] < 10 ? `0${createdAt[5]}` : createdAt[5];
    const timeString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;

    const time = new Date(timeString);

    // 현재시간 기준 1분 안이면 방금 전
    if (new Date().getTime() - time.getTime() < 60000) {
      return '방금 전';
    }
    // 현재시간 기준 1시간 안이면 몇분 전
    else if (new Date().getTime() - time.getTime() < 3600000) {
      return `${Math.floor((new Date().getTime() - time.getTime()) / 60000)}분 전`;
    }
    // 현재시간 기준 1일 안이면 몇시간 전
    else if (new Date().getTime() - time.getTime() < 86400000) {
      return `${Math.floor((new Date().getTime() - time.getTime()) / 3600000)}시간 전`;
    }
    // 현재시간 기준 1주 안이면 몇일 전
    else if (new Date().getTime() - time.getTime() < 604800000) {
      return `${Math.floor((new Date().getTime() - time.getTime()) / 86400000)}일 전`;
    }
    // 현재시간 기준 1달 안이면 몇주 전
    else if (new Date().getTime() - time.getTime() < 2592000000) {
      return `${Math.floor((new Date().getTime() - time.getTime()) / 604800000)}주 전`;
    }
    // 현재시간 기준 1년 안이면 몇달 전
    else if (new Date().getTime() - time.getTime() < 31536000000) {
      return `${Math.floor((new Date().getTime() - time.getTime()) / 2592000000)}달 전`;
    }
    // 현재시간 기준 1년 이상이면 몇년 전
    else {
      return `${Math.floor((new Date().getTime() - time.getTime()) / 31536000000)}년 전`;
    }
  };

  const renderHistoryTextByType = (history: History) => {
    if (history.action === HistoryType.CREATE_FLAG) {
      return (
        <>
          <S.HistoryContentText>
            &quot;{history.flagTitle}&quot;이(가) 생성되었습니다.
          </S.HistoryContentText>
          <S.HistoryTimeText>{setTimeOption(history.createdAt)}</S.HistoryTimeText>
        </>
      );
    } else if (history.action === HistoryType.UPDATE_FLAG_TITLE) {
      return (
        <>
          <S.HistoryContentText>
            &quot;{history.flagTitle}&quot;의 이름이 &quot;{history.previous}&quot;에서
            &quot;
            {history.current}&quot;으로 변경되었습니다.
          </S.HistoryContentText>
          <S.HistoryTimeContainer>
            <S.HistoryTimeText>{setTimeOption(history.createdAt)}</S.HistoryTimeText>
          </S.HistoryTimeContainer>
        </>
      );
    } else if (history.action === HistoryType.UPDATE_FLAG_TYPE) {
      return (
        <>
          <S.HistoryContentText>
            &quot;{history.flagTitle}&quot;의 타입이 &quot;{history.previous}&quot;에서
            &quot;
            {history.current}&quot;으로 변경되었습니다.
          </S.HistoryContentText>
          <S.HistoryTimeContainer>
            <S.HistoryTimeText>{setTimeOption(history.createdAt)}</S.HistoryTimeText>
          </S.HistoryTimeContainer>
        </>
      );
    } else if (history.action === HistoryType.SWITCH_FLAG) {
      return (
        <>
          <S.HistoryContentText>
            &quot;
            {history.flagTitle}&quot;이(가) &quot;{history.current}&quot;되었습니다.
          </S.HistoryContentText>
          <S.HistoryTimeContainer>
            <S.HistoryTimeText>{setTimeOption(history.createdAt)}</S.HistoryTimeText>
          </S.HistoryTimeContainer>
        </>
      );
    } else if (history.action === HistoryType.DELETE_FLAG) {
      return (
        <>
          <S.HistoryContentText>
            &quot;{history.flagTitle}&quot;이(가) 삭제되었습니다.
          </S.HistoryContentText>
          <S.HistoryTimeContainer>
            <S.HistoryTimeText>{setTimeOption(history.createdAt)}</S.HistoryTimeText>
          </S.HistoryTimeContainer>
        </>
      );
    } else if (history.action === HistoryType.CREATE_VARIATION) {
      return (
        <>
          <S.HistoryContentText>
            &quot;{history.flagTitle}&quot;의 새로운 변수 {history.current}이(가)
            생성되었습니다.
          </S.HistoryContentText>
          <S.HistoryTimeContainer>
            <S.HistoryTimeText>{setTimeOption(history.createdAt)}</S.HistoryTimeText>
          </S.HistoryTimeContainer>
        </>
      );
    } else if (history.action === HistoryType.UPDATE_VARIATION_VALUE) {
      return (
        <>
          <S.HistoryContentText>
            &quot;{history.flagTitle}&quot;의 변수 {history.previous}가 {history.current}
            로 변경되었습니다.
          </S.HistoryContentText>
          <S.HistoryTimeContainer>
            <S.HistoryTimeText>{setTimeOption(history.createdAt)}</S.HistoryTimeText>
          </S.HistoryTimeContainer>
        </>
      );
    } else if (history.action === HistoryType.UPDATE_VARIATION_PORTION) {
      return (
        <>
          <S.HistoryContentText>
            &quot;{history.flagTitle}&quot;의 {history.target}의 비율이 {history.previous}
            에서 {history.current}로 변경되었습니다.
          </S.HistoryContentText>
          <S.HistoryTimeContainer>
            <S.HistoryTimeText>{setTimeOption(history.createdAt)}</S.HistoryTimeText>
          </S.HistoryTimeContainer>
        </>
      );
    } else if (history.action === HistoryType.DELETE_VARIATION) {
      return (
        <>
          <S.HistoryContentText>
            &quot;{history.flagTitle}&quot;의 변수 {history.previous}이(가)
            삭제되었습니다.
          </S.HistoryContentText>
          <S.HistoryTimeContainer>
            <S.HistoryTimeText>{setTimeOption(history.createdAt)}</S.HistoryTimeText>
          </S.HistoryTimeContainer>
        </>
      );
    } else if (history.action === HistoryType.CREATE_KEYWORD) {
      return (
        <>
          <S.HistoryContentText>
            &quot;{history.flagTitle}&quot;의 새로운 키워드 {history.current}이(가)
            추가되었습니다.
          </S.HistoryContentText>
          <S.HistoryTimeContainer>
            <S.HistoryTimeText>{setTimeOption(history.createdAt)}</S.HistoryTimeText>
          </S.HistoryTimeContainer>
        </>
      );
    } else if (history.action === HistoryType.UPDATE_KEYWORD) {
      return (
        <>
          <S.HistoryContentText>
            &quot;{history.flagTitle}&quot;의 키워드 &quot;{history.target}&quot;의 값이{' '}
            {history.previous}에서 {history.current}로 변경되었습니다.
          </S.HistoryContentText>
          <S.HistoryTimeContainer>
            <S.HistoryTimeText>{setTimeOption(history.createdAt)}</S.HistoryTimeText>
          </S.HistoryTimeContainer>
        </>
      );
    } else if (history.action === HistoryType.DELETE_KEYWORD) {
      return (
        <>
          <S.HistoryContentText>
            &quot;{history.flagTitle}&quot;의 키워드 &quot;{history.previous}&quot;이(가)
            삭제되었습니다.
          </S.HistoryContentText>
          <S.HistoryTimeContainer>
            <S.HistoryTimeText>{setTimeOption(history.createdAt)}</S.HistoryTimeText>
          </S.HistoryTimeContainer>
        </>
      );
    } else if (history.action === HistoryType.CREATE_PROPERTY) {
      return (
        <>
          <S.HistoryContentText>
            &quot;{history.flagTitle}&quot;의 키워드 &quot;{history.target}&quot;에 새로운
            속성 {history.current}이(가) 추가되었습니다.
          </S.HistoryContentText>
          <S.HistoryTimeContainer>
            <S.HistoryTimeText>{setTimeOption(history.createdAt)}</S.HistoryTimeText>
          </S.HistoryTimeContainer>
        </>
      );
    } else if (history.action === HistoryType.UPDATE_PROPERTY_KEY) {
      return (
        <>
          <S.HistoryContentText>
            &quot;{history.flagTitle}&quot;의 키워드 &quot;{history.target}&quot;의 속성이
            &quot;{history.previous}&quot;에서 &quot;{history.current}&quot;으로
            변경되었습니다.
          </S.HistoryContentText>
          <S.HistoryTimeContainer>
            <S.HistoryTimeText>{setTimeOption(history.createdAt)}</S.HistoryTimeText>
          </S.HistoryTimeContainer>
        </>
      );
    } else if (history.action === HistoryType.UPDATE_PROPERTY_VALUE) {
      return (
        <>
          <S.HistoryContentText>
            &quot;{history.flagTitle}&quot;의 키워드 {history.target}의 값이 &quot;
            {history.previous}&quot;에서 &quot;{history.current}&quot;으로 변경되었습니다.
          </S.HistoryContentText>
          <S.HistoryTimeContainer>
            <S.HistoryTimeText>{setTimeOption(history.createdAt)}</S.HistoryTimeText>
          </S.HistoryTimeContainer>
        </>
      );
    } else if (history.action === HistoryType.DELETE_PROPERTY) {
      return (
        <>
          <S.HistoryContentText>
            &quot;{history.flagTitle}&quot;의 키워드 &quot;{history.target}&quot;의 속성
            &quot;{history.previous}&quot;이(가) 삭제되었습니다.
          </S.HistoryContentText>
          <S.HistoryTimeContainer>
            <S.HistoryTimeText>{setTimeOption(history.createdAt)}</S.HistoryTimeText>
          </S.HistoryTimeContainer>
        </>
      );
    } else {
      return (
        <S.HistoryContentText>
          &quot;{history.flagTitle}&quot;의 히스토리를 불러오는데 가 존재하지 않습니다.
        </S.HistoryContentText>
      );
    }
  };

  return <>{renderHistoryTextByType(props)}</>;
};

export default index;
