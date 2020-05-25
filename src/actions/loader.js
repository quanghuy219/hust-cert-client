export function startLoader() {
    return {
      type: 'IS_LOADING',
    };
  }
  
export function stopLoader() {
    return {
      type: 'FINISH_LOADING'
    };
  }
