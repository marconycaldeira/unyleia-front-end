import axios from 'axios';

const getBaseURL = () => {
	return 'http://localhost:8080/api';
};


const axiosInstance = axios.create({
	baseURL: getBaseURL(),
	headers: {
		accept: 'application/json',
	},
});

export default axiosInstance;
