import { instance } from '../../api/instance';

type SendAuthCodeData = {
  email: string;
};

type SignUpData = {
  email: string;
  password: string;
  authCode: string;
};

export const SignUp = () => {
  const handleSendAuthCode = (sendAuthCodeData: SendAuthCodeData): void => {
    instance
      .post('/mails', sendAuthCodeData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (signUp: SignUpData): void => {
    instance
      .post('/users/', signUp)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
