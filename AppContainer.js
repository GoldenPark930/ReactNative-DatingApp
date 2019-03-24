import React from 'react'
import {Provider as ReduxProvider} from 'react-redux'
import {NavigationContext, NavigationProvider} from '@exponent/ex-navigation'
import AppWrap from './components/appWrap'
import Router from './Router'

const AppContainer = ({store}) => {
  const context = new NavigationContext({ store, router: Router })

  return (
    <ReduxProvider store={store}>
      <NavigationProvider context={context} router={Router}>
        <AppWrap context={context} />
      </NavigationProvider>
    </ReduxProvider>
  )
}

export default AppContainer
