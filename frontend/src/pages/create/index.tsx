import React, { useEffect, useState } from 'react';

import { createFlag } from '@/api/create/createAxios';

interface TagItem {
  content: string;
  colorHex: string;
}

const CreateFlag = () => {
  const [title, setTitle] = useState<string>('');
  const [tags, setTags] = useState<Array<TagItem>>([]);
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<string>('BOOLEAN');
  const [defaultValue, setDefaultValue] = useState<string>('');
  const [defaultPortion, setDefaultPortion] = useState<number>(100);
  const [defaultDescription, setDefaultDescription] = useState<string>('');
  const [variation, setVariation] = useState<string>('');
  const [variationPortion, setVariationPortion] = useState<number>(0);
  const [variationDescription, setVariationDescription] = useState<string>('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // setTags(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDescription(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setType(e.target.value);
  };

  const handleDefaultValueChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDefaultValue(e.target.value);
  };

  const handleDefaultPortionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDefaultPortion(Number(e.target.value));
  };

  const handleDefaultDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setDefaultDescription(e.target.value);
  };

  const handleVariationChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setVariation(e.target.value);
  };

  const handleVariantPortionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setVariationPortion(Number(e.target.value));
  };

  const handleVariationDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setVariationDescription(e.target.value);
  };

  const onClickAdd = () => {
    createFlag(
      {
        title: title,
        tags: tags,
        description: description,
        type: type,
        defaultValue: defaultValue,
        defaultValuePortion: defaultPortion ? defaultPortion : 0,
        defaultValueDescription: defaultDescription,
        variation: variation,
        variationPortion: variationPortion ? variationPortion : 0,
        variationDescription: variationDescription,

        //TODO : userId 전역설정 기능 추가 후 수정
        userId: 1,
      },
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      },
    );
  };

  return (
    <div>
      <div>
        <label htmlFor="title">플래그 이름</label>
        <input
          type="title"
          placeholder="플래그 이름"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <div>
        <label htmlFor="tags">태그</label>
        {/*<select value={tags} onChange={handleTagsChange}>*/}
        {/*  */}
        {/*</select>*/}
      </div>
      <div>
        <label htmlFor="description">설명</label>
        <input
          type="description"
          placeholder="설명"
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
      <div>
        <label htmlFor="type">타입</label>
        <select value={type} onChange={handleTypeChange}>
          <option value="BOOLEAN">BOOLEAN</option>
          <option value="string">STRING</option>
          <option value="INTEGER">NUMBER</option>
          {/*<option value="JSON">JSON</option>*/}
        </select>
      </div>
      <div>
        <label htmlFor="defaultValue">기본값</label>
        <input
          type="defaultValue"
          placeholder="값을 입력하세요"
          value={defaultValue}
          onChange={handleDefaultValueChange}
        />
      </div>
      <div>
        <label htmlFor="defaultPortion">기본 비율</label>
        <input
          type="defaultPortion"
          placeholder="기본 비율"
          value={defaultPortion}
          onChange={handleDefaultPortionChange}
        />
      </div>
      <div>
        <label htmlFor="defaultDescription">기본 설명</label>
        <input
          type="defaultDescription"
          placeholder="설명"
          value={defaultDescription}
          onChange={handleDefaultDescriptionChange}
        />
      </div>
      <div>
        <label htmlFor="variation">변수</label>
        <input
          type="variation"
          placeholder="변수 이름"
          value={variation}
          onChange={handleVariationChange}
        />
      </div>
      <div>
        <label htmlFor="variationPortion">변수 비율</label>
        <input
          type="variationPortion"
          placeholder="비율"
          value={variationPortion}
          onChange={handleVariantPortionChange}
        />
      </div>
      <div>
        <label htmlFor="variationDescription">변수 설명</label>
        <input
          type="variationDescription"
          placeholder="설명"
          value={variationDescription}
          onChange={handleVariationDescriptionChange}
        />
      </div>
      <div>
        <button onClick={onClickAdd}>추가</button>
      </div>
    </div>
  );
};

export default CreateFlag;
