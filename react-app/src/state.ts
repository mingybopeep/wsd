import { configureStore } from "@reduxjs/toolkit";
import homepageReducer from "./containers/Homepage/state";
import fixturesReducer from "./containers/Fixtures/state";
import fixtureOddsReducer from "./containers/FixtureOdds/state";
import sessionReducer from "./containers/SessionProvider/state";

// ...
const store = configureStore({
  reducer: {
    homepage: homepageReducer,
    fixtures: fixturesReducer,
    fixtureOdds: fixtureOddsReducer,
    session: sessionReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export default store;
