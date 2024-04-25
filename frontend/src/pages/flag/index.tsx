import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getFlagDetail } from '@/api/flagDetail/flagDetailAxios';

interface FlagDetailItem {
  flagId: number;
  title: string;
  tags: Array<{ content: string; colorHex: string }>;
  description: string;
  type: string;
  defaultValue: string;
  defaultValuePortion: number;
  defaultValueDescription: string;
  variation: string;
  variationPortion: number;
  variationDescription: string;

  userId: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

const FlagDetail = () => {
  const [flagDetail, setFlagDetail] = useState<FlagDetailItem>();

  const { flagId } = useParams<{ flagId: string }>();
  useEffect(() => {
    getFlagDetail<FlagDetailItem>(
      Number(flagId),
      (data: FlagDetailItem) => {
        setFlagDetail(data);
      },
      (err) => {
        console.log(err);
      },
    );
  }, [flagId]);

  const onPressDeleteButton = () => {
    const deleteFlag: boolean = confirm('삭제하기');

    if (deleteFlag) {
      console.log('삭제하기');
    }
  };

  return (
    <div>
      {flagDetail && (
        <div>
          <div>
            <span>{flagDetail.title}</span>
          </div>
          <div>
            {flagDetail.tags.map((tag) => {
              return (
                <span
                  key={tag.content}
                  style={{ backgroundColor: tag.colorHex, color: '#fff' }}
                >
                  {tag.content}
                </span>
              );
            })}
          </div>
          <div>
            <span>{flagDetail.description}</span>
          </div>
          <div>
            <span>{flagDetail.type}</span>
          </div>
          <div>
            <span>{flagDetail.defaultValue}</span>
          </div>
          <div>
            <span>{flagDetail.defaultValuePortion}</span>
          </div>
          <div>
            <span>{flagDetail.defaultValueDescription}</span>
          </div>
          <div>
            <span>{flagDetail.variation}</span>
          </div>
          <div>
            <span>{flagDetail.variationPortion}</span>
          </div>
          <div>
            <span>{flagDetail.variationDescription}</span>
          </div>
          <div>
            <span>{flagDetail.userId}</span>
          </div>
          <div>
            <span>{flagDetail.createdAt}</span>
          </div>
          <div>
            <span>{flagDetail.updatedAt}</span>
          </div>
          <div>
            <span>{flagDetail.active ? '활성화' : '비활성화'}</span>
          </div>
        </div>
      )}

      <button onClick={onPressDeleteButton}>삭제하기</button>
    </div>
  );
};

export default FlagDetail;
