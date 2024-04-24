import axios from 'axios';

/**
 * postman mock server를 사용하기 위한
 * axios 인스턴스 생성
 */
export default axios.create({
  baseURL: 'https://f091cb8e-fd39-469d-9049-0c4ed4ab3af0.mock.pstmn.io',
});
