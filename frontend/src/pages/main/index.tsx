import React, { useEffect, useState } from 'react';

import { getMainPageOverview } from '@/api/main/mainAxios';
import FlagTable from '@/pages/main/table';

interface OverviewInfo {
  sdkKey: string;
  totalFlags: number;
  activeFlags: number;
}

const index = () => {
  const [sdkKey, setSdkKey] = useState<string>('');
  const [totalFlags, setTotalFlags] = useState<number>(0);
  const [activeFlags, setActiveFlags] = useState<number>(0);

  /**
   * 화면 마운트 시 필요한 정보 가져오기
   */
  useEffect(() => {
    const memberId = 1;
    getMainPageOverview(
      memberId,
      (data: OverviewInfo) => {
        setSdkKey(data.sdkKey);
        setTotalFlags(data.totalFlags);
        setActiveFlags(data.activeFlags);
      },
      (err) => {
        console.error(err);
      },
    );
  }, []);

  return (
    <div>
      <div>overview</div>
      <div>sdkKey : {sdkKey}</div>
      <div>totalFlags: {totalFlags}</div>
      <div>activeFlags: {activeFlags}</div>
      <FlagTable />
    </div>
  );
};

export default index;
