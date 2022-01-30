
import ajax from "../utils/ajax-adapter";
import { ajax_fetch } from "../utils/ajax-fetch";
import { local_token_delete, local_token_get, local_token_set } from "../utils/auth-utils";
import config from "../utils/config";

const AUTH_LOGOUT_FETCHING = 'AUTH_LOGOUT_FETCHING';
const AUTH_LOGOUT = 'AUTH_LOGOUT';
const AUTH_REGISTER_FETCHING = 'AUTH_REGISTER_FETCHING';
const AUTH_REGISTER_SUCCESS = 'AUTH_REGISTER_SUCCESS';
const AUTH_REGISTER_FAIL = 'AUTH_REGISTER_FAIL';
const AUTH_FORMLOGIN_FETCHING = 'AUTH_FORMLOGIN_FETCHING';
const AUTH_FORMLOGIN_SUCCESS = 'AUTH_FORMLOGIN_SUCCESS';
const AUTH_FORMLOGIN_FAIL = 'AUTH_FORMLOGIN_FAIL';
const AUTH_GET_MY_USER_DATA_FETCHING = 'AUTH_GET_MY_USER_DATA_FETCHING';
const AUTH_GET_MY_USER_DATA_SUCCESS = 'AUTH_GET_MY_USER_DATA_SUCCESS';
const TOUR_CREATE_FETCHING = 'TOUR_CREATE_FETCHING';
const TOUR_CREATE_SUCCESS = 'TOUR_CREATE_SUCCESS';
const TOUR_CREATE_FAIL = 'TOUR_CREATE_FAIL';


const errCatched = (error) => {
  console.log('errCatched');
  console.error(error);
}


export const actionRouteSet = (route) => {
  return {
    type: 'ROUTE_SET',
    payload: route
  }
};

export const actionDrawerOpen = () => {
  return {
    type: 'DRAWER_OPEN'
  }
};

export const actionDrawerClose = () => {
  return {
    type: 'DRAWER_CLOSE'
  }
};

export const actionToursDataNeeded = () => {
  return {
    type: 'TOURS_DATA_NEEDED'
  }
};

export const actionReviewsDataNeeded = () => {
  return {
    type: 'REVIEWS_DATA_NEEDED'
  }
};


// AUTH ACTIONS

export const actionAuthLogout = () => {
  // THUNK
  return (dispatch) => {
    dispatch({
      type: AUTH_LOGOUT_FETCHING
    });

    // korak 2 - fetchujemo podatke
    ajax.postAuthLogout()
      .then(response => ajax_fetch.response_json_smart(response))
      .then((response) => {
        if (response && response.is_success_response === true) {
          // BACKEND LOGOUT FINISHED
          // now we do frontend logout procedure
          const res_payload = response.payload;
          console.log(res_payload);
          // delete token
          local_token_delete()
            .then(() => {
              // tell redux we logged out
              dispatch({
                type: AUTH_LOGOUT,
                payload: res_payload
              });
            })

        }
      })

  };
};


export const actionAuthRegister = (entbox) => {
  // THUNK
  return (dispatch) => {
    // korak 1 - dispetchujemo akciju uz prikaz spinera
    dispatch({
      type: AUTH_REGISTER_FETCHING
    });

    // korak 2 - fetchujemo podatke
    ajax.postAuthRegister(entbox)
      .then(response => {
        console.log(response);
        return response;
      })
      .then(response => ajax_fetch.response_json_smart(response))
      .then((response) => {
        // korak 3 - zavrseno fetcovanje
        // if (response.success === true) {
        console.log(response);
        if (response && response.is_success_response === true) {
          // console.log(response);
          const res_payload = response.payload;
          console.log(res_payload);
          dispatch({
            type: AUTH_REGISTER_SUCCESS,
            payload: res_payload
          });
          /*
          // KORAK cuvanje lokalnog tokena
          let token = res_payload.token;
          authUtils.localTokenSet(token)
            .then(() => {
              authUtils.ajaxTokenSet(token);
              dispatch(actionAuthAutologin()); // AUTOLOGIN...
            });
            */

          //
        } else {
          dispatch({ type: AUTH_REGISTER_FAIL });
          console.log(response);
        }
      })
      .catch(errCatched)

  }
};


export const actionAuthFormLogin = (entbox) => {
  // THUNK
  return (dispatch) => {
    // korak 1 - dispetchujemo akciju uz prikaz spinera
    dispatch({
      type: AUTH_FORMLOGIN_FETCHING
    });

    // korak 2 - fetchujemo podatke
    ajax.postAuthFormLogin(entbox)
      .then(response => {
        console.log(response);
        return response;
      })
      .then(response => ajax_fetch.response_json_smart(response))
      .then((response) => {
        // korak 3 - zavrseno fetcovanje
        // if (response.success === true) {
        console.log(response);
        if (response && response.is_success_response === true) {
          // console.log(response);
          const res_payload = response.payload;
          console.log(res_payload);
          dispatch({
            type: AUTH_FORMLOGIN_SUCCESS,
            payload: res_payload
          });
          // dispatch(actionShowToast('Sucess! DOBILI SMO TOKEN :)', tc.GREEN));
          // KORAK cuvanje lokalnog tokena
          let token = res_payload.token;
          // const TOKEN_LOCAL_KEY = config.TOKEN_LOCAL_KEY;
          const TOKEN_HEADER_KEY = config.TOKEN_HEADER_KEY;
          local_token_set(token)
            .then((token) => {
              // configure ajax headers
              ajax.ajaxHeadersConfigurator.setHeader(TOKEN_HEADER_KEY, token);
              console.log('testing autologin');
              ajax.getAuthMyUserData()
                .then(response => ajax_fetch.response_json_smart(response))
                .then((response) => {
                  if (response && response.is_success_response === true) {
                    // console.log(response);
                    const res_payload = response.payload;
                    console.log(res_payload);
                    if (res_payload && res_payload.user && res_payload.user.username) {
                      dispatch({
                        type: AUTH_GET_MY_USER_DATA_SUCCESS,
                        payload: res_payload
                      });
                    }
                  }
                })
            })

          //
        } else {
          dispatch({
            type: AUTH_FORMLOGIN_FAIL,
            payload: response
          });
          // dispatch(actionShowToast('Greska! :('));
          console.log(response);
        }
      })
      .catch(errCatched)

  }
};


export const actionAuthGetMyUserData = () => {
  // THUNK
  return (dispatch) => {
    dispatch({
      type: AUTH_GET_MY_USER_DATA_FETCHING
    });
    local_token_get()
      .then((token) => {
        console.log(token);
        const TOKEN_HEADER_KEY = config.TOKEN_HEADER_KEY;
        ajax.ajaxHeadersConfigurator.setHeader(TOKEN_HEADER_KEY, token);
        console.log('we set headers... now try getAuthMyUserData');
        ajax.getAuthMyUserData()
          .then(response => ajax_fetch.response_json_smart(response))
          .then((response) => {
            if (response && response.is_success_response === true) {
              console.log(response);
              const res_payload = response.payload;
              console.log(res_payload);
              if (res_payload && res_payload.user && res_payload.user.username) {
                dispatch({
                  type: AUTH_GET_MY_USER_DATA_SUCCESS,
                  payload: res_payload
                });
              }
            }
          })

      })

  };
};


// TOUR ACTIONS

export const actionTourCreate = (entbox) => {
  // THUNK
  return (dispatch) => {
    // korak 1 - dispetchujemo akciju uz prikaz spinera
    dispatch({
      type: TOUR_CREATE_FETCHING
    });

    // korak 2 - fetchujemo podatke
    ajax.postTourCreate(entbox)
      .then(response => {
        console.log(response);
        return response;
      })
      .then(response => ajax_fetch.response_json_smart(response))
      .then((response) => {
        // korak 3 - zavrseno fetcovanje
        // if (response.success === true) {
        console.log(response);
        if (response && response.is_success_response === true) {
          // console.log(response);
          const res_payload = response.payload;
          console.log(res_payload);
          dispatch({
            type: TOUR_CREATE_SUCCESS,
            payload: res_payload
          });


          //
        } else {
          dispatch({ type: TOUR_CREATE_FAIL });
          console.log(response);
        }
      })
      .catch(errCatched)

  }
};
