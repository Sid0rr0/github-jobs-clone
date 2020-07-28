import { useReducer, useEffect } from 'react';
import axios from 'axios';

const ACTIONS = {
	MAKE_REQUEST: 'make_request',
	GET_DATA: 'get_data',
	ERROOR: 'error'
};

const BASE_URL = 'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json';

function reducer(state, action) {
	switch(action.type) {
		case ACTIONS.MAKE_REQUEST:
			return { loading: true, jobs: [] };
		case ACTIONS.GET_DATA:
			return { ...state, loading: false, jobs: action.payload.jobs };
		case ACTIONS.ERROOR:
			return { ...state, loading: false, error: action.payload.error, jobs: [] };
		default:
			return state;
	}
}

export default function useFetchJobs(params, page) {
	const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true });

	useEffect(() => {
		const cancelToken = axios.CancelToken.source();
		
		dispatch({ type: ACTIONS.MAKE_REQUEST });
		axios.get(BASE_URL, {
			cancelToken: cancelToken.token,
			params: { markdown: true, page: page, ...params }
		}).then(res => {
			dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data }});
		}).catch(e => {
			if(axios.isCancel(e)) return;
			dispatch({ type: ACTIONS.ERROOR, payload: { error: e } });
		});

		return () => {
			cancelToken.cancel();
		};

		// eslint-disable-next-line
	}, [params, page]);

	return state;
}