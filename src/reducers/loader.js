const initialState = {
  loading: false,
};

export default function loader(state = initialState, action) {
  switch (action.type) {
    case 'IS_LOADING':
      return Object.assign({}, state, {
        loading: true,
      });
    case 'FINISH_LOADING':
      return Object.assign({}, state, {
        loading: false,
      });
    default:
      return state;
  }
}
