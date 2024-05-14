import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { fillOrg } from '@/api/userDetail/userAxios';
import LightswitchLogo from '@/assets/lightswitchLogo.svg?react';
import { AuthAtom } from '@/global/AuthAtom';
import * as L from '@/pages/organization/indexStyle';

interface OrgInfo {
  name: string;
  ownerId: number;
}

const FillOrg = () => {
  const [organization, setOrganization] = useState<string>('');

  const [auth, setAuth] = useRecoilState(AuthAtom);
  const navigate = useNavigate();

  const handleOrganization = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setOrganization(e.target.value);
  };

  useEffect(() => {
    console.log(auth);
  }, [auth]);

  const onClickCreate = (): void => {
    const ownerId = Number(auth.memberId);
    fillOrg<OrgInfo>(
      {
        name: organization,
        ownerId: ownerId,
      },
      (data) => {
        const orgName = data.name;
        setAuth((prev) => ({
          ...prev,
          orgName: orgName,
        }));
        navigate('/');
      },
      (err) => {
        console.log(err);
      },
    );
  };

  return (
    <L.Layout>
      <L.OrgLayout>
        <L.Container>
          <LightswitchLogo />
          <L.TextBox>
            <L.TitleText>회사 이름을 입력해주세요</L.TitleText>
          </L.TextBox>
          <L.Input
            type="text"
            placeholder="회사명"
            value={organization}
            onChange={handleOrganization}
          />
          <L.ButtonWrapper>
            <L.OKButton onClick={onClickCreate}>확인</L.OKButton>
          </L.ButtonWrapper>
        </L.Container>
      </L.OrgLayout>
    </L.Layout>
  );
};
export default FillOrg;
