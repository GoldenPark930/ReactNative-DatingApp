import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {fetchBrowse} from '../misc'
import promiseMiddleware from 'redux-promise-middleware'
import api from '../../utils/api'

jest.setMock('algolia', () => require.requireMock('../../utils/algolia'));

describe('fetchBrowse', () => {
  let store

  const filter = 'newest'
  const page = 0
  const coords = {lat: 25.761, lng: -80.191}
  const params = {filter, page, coords}


  beforeEach(() => {
    const mockStore = configureStore([thunk, promiseMiddleware()])
    store = mockStore({})

  })

  test.skip('fetchBrowse creates correct action', async () => {
    const ok = fetchBrowse(params)()
    expect(ok).toBe().objectContaining({
      type: 'FETCH_BROWSE',
      payload: api.browse(params),
    })
  })


    // const resolvedObject = { value: 'whatever' }
    //
    // it('should resolve the resolvedObject ', () => {
    //   expect(
    //     fetchBrowse().payload.promise
    //   ).to.become(resolvedObject)
    // })

  test('dispatches FETCH_BROWSE_PENDING and FETCH_BROWSE_FULFILLED actions', async () => {

    const expectedActions = [
      {
        meta: params,
        type: 'FETCH_BROWSE_PENDING'
      }, {
        meta: params,
        payload: {hits: []},
        type: 'FETCH_BROWSE_FULFILLED'
      }
    ]

    return store.dispatch(fetchBrowse(params))
      .then(() => expect(store.getActions()).toEqual(expectedActions));
  })

  test('dispatches PENDING and REJECTED actions', async () => {

    const expectedActions = [{
      type: 'FETCH_BROWSE_PENDING',
    }, {
      type: 'FETCH_BROWSE_REJECTED',
      payload: 'missing params',
      error: true
    }];

    try{
      await store.dispatch(fetchBrowse())
    }catch(err){
      return expect(store.getActions()).toEqual(expectedActions)
    }

  })
})
