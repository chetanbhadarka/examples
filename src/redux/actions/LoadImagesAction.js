import * as service from '../../services';
import {imageSliceAction} from '../reducerSlices/ImageSliceReducer';

export const loadImage = () => {
  const query = '?page=1&limit=50';
  return dispatch => {
    dispatch(imageSliceAction.loadImages());
    return service.Load(query).then(response => {
      if (!(response instanceof Error) && response.Status !== 'Fail') {
        dispatch(imageSliceAction.setImages({data: response}));
        // console.info('loadImage response: ', response);
      } else {
        dispatch(imageSliceAction.setImages({error: response}));
        // console.error('loadImage error: ', response);
      }
    });
  };
};

export const getMoreImage = (page = 1) => {
  const query = `?page=${page}&limit=50`;
  return dispatch => {
    dispatch(imageSliceAction.loadImages());
    return service.Load(query).then(response => {
      if (!(response instanceof Error) && response.Status !== 'Fail') {
        dispatch(imageSliceAction.updateImages({data: response, page}));
        // console.info('getMoreImage response: ', response);
      } else {
        dispatch(imageSliceAction.updateImages({error: response}));
        // console.error('getMoreImage error: ', response);
      }
    });
  };
};
